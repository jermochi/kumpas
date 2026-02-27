import Groq from "groq-sdk";
import { del } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: NextRequest) {
  const { blobUrl } = (await req.json()) as { blobUrl?: string };

  if (!blobUrl) {
    return NextResponse.json({ error: "No blobUrl provided" }, { status: 400 });
  }

  try {
    // Fetch the audio file from Vercel Blob (private store requires auth)
    const audioResponse = await fetch(blobUrl, {
      headers: {
        Authorization: `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}`,
      },
    });
    if (!audioResponse.ok) {
      return NextResponse.json(
        { error: "Failed to fetch audio from blob storage" },
        { status: 500 }
      );
    }

    const audioBlob = await audioResponse.blob();
    const fileName = blobUrl.split("/").pop() || "audio.webm";
    const file = new File([audioBlob], fileName, { type: audioBlob.type });

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
    console.error("Groq transcription error:", err);
    return NextResponse.json(
      { error: "Transcription failed" },
      { status: 500 }
    );
  }
}