import Groq from "groq-sdk";
import { del, get } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: NextRequest) {
  const contentType = req.headers.get("content-type") || "";

  if (contentType.includes("multipart/form-data")) {
    try {
      const formData = await req.formData();
      const file = formData.get("file") as File | null;

      if (!file) {
        return NextResponse.json({ error: "No file provided" }, { status: 400 });
      }

      console.log("Transcribe: sending direct file to Groq, size:", file.size, "type:", file.type);

      const transcription = await groq.audio.transcriptions.create({
        file,
        model: "whisper-large-v3-turbo",
        response_format: "verbose_json",
      });

      return NextResponse.json({ text: transcription.text });
    } catch (err) {
      console.error("Transcription error (direct):", err);
      return NextResponse.json(
        { error: `Transcription failed: ${(err as Error).message}` },
        { status: 500 }
      );
    }
  }

  const { blobUrl } = (await req.json()) as { blobUrl?: string };

  if (!blobUrl) {
    return NextResponse.json({ error: "No blobUrl provided" }, { status: 400 });
  }

  try {
    // Fetch the audio file from Vercel Blob using a standard fetch for public blobs
    console.log("Transcribe: fetching public blob at URL:", blobUrl);

    // Retry logic: Vercel CDN sometimes takes a few seconds to propagate the public blob
    let result: Response | null = null;
    let attempts = 0;
    const maxAttempts = 5;

    while (attempts < maxAttempts) {
      result = await fetch(blobUrl);
      if (result.ok) break;

      if (result.status === 404) {
        console.log(`Blob not found, retrying in 1s (Attempt ${attempts + 1}/${maxAttempts})...`);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        attempts++;
      } else {
        break;
      }
    }

    if (!result || !result.ok) {
      console.error("Fetch failed after retries:", result?.status);
      return NextResponse.json(
        { error: "Failed to fetch audio from blob storage after multiple attempts" },
        { status: 500 }
      );
    }

    // Convert the Response into a Blob
    const audioBlob = await result.blob();
    const fileName = blobUrl.split("/").pop() || "audio.webm";
    const file = new File([audioBlob], fileName, { type: audioBlob.type || "audio/webm" });

    console.log("Transcribe: sending to Groq, file size:", audioBlob.size, "type:", audioBlob.type);

    const transcription = await groq.audio.transcriptions.create({
      file,
      model: "whisper-large-v3-turbo",
      response_format: "verbose_json",
    });

    // Clean up: delete the blob after successful transcription
    try {
      await del(blobUrl);
    } catch (delErr) {
      console.warn("Failed to delete blob (non-critical):", delErr);
    }

    return NextResponse.json({ text: transcription.text });
  } catch (err) {
    console.error("Transcription error:", err);
    return NextResponse.json(
      { error: `Transcription failed: ${(err as Error).message}` },
      { status: 500 }
    );
  }
}