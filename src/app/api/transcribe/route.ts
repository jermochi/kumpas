import Groq from "groq-sdk";
import { NextRequest, NextResponse } from "next/server";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  try {
    const transcription = await groq.audio.transcriptions.create({
      file,
      model: "whisper-large-v3-turbo",
      response_format: "verbose_json",
    });

    return NextResponse.json({ text: transcription.text });
  } catch (err) {
    console.error("Groq transcription error:", err);
    return NextResponse.json({ error: "Transcription failed" }, { status: 500 });
  }
}