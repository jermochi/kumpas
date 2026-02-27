import Groq from "groq-sdk";
import { del, get } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: NextRequest) {
  const { blobUrl } = (await req.json()) as { blobUrl?: string };

  if (!blobUrl) {
    return NextResponse.json({ error: "No blobUrl provided" }, { status: 400 });
  }

  try {
    // Fetch the audio file from Vercel Blob using the SDK (required for private blobs)
    console.log("Transcribe: fetching blob at URL:", blobUrl);
    let result;
    try {
      result = await get(blobUrl, { access: "private" });
    } catch (blobErr) {
      console.error("Blob get() threw:", blobErr);
      return NextResponse.json(
        { error: `Failed to fetch audio from blob storage: ${(blobErr as Error).message}` },
        { status: 500 }
      );
    }

    if (!result || result.statusCode !== 200) {
      console.error("Blob get() returned:", result?.statusCode ?? "null");
      return NextResponse.json(
        { error: "Failed to fetch audio from blob storage" },
        { status: 500 }
      );
    }

    // Convert the ReadableStream into a Blob
    const audioBlob = new Blob(
      [await new Response(result.stream).arrayBuffer()],
      { type: result.blob.contentType ?? "audio/webm" }
    );
    const fileName = blobUrl.split("/").pop() || "audio.webm";
    const file = new File([audioBlob], fileName, { type: audioBlob.type });

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