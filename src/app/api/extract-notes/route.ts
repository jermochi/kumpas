import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const { imageBase64, mimeType } = await req.json();
    if (!imageBase64 || !mimeType)
      return NextResponse.json({ error: "Missing imageBase64 or mimeType" }, { status: 400 });

    const apiKey = process.env.TRANSCRIPTION_LAYER_API_KEY;
    if (!apiKey)
      return NextResponse.json({ error: "Server config error: missing API key" }, { status: 500 });

    const ai = new GoogleGenAI({ apiKey });

    const systemPrompt = `You are a handwriting extraction assistant for a school counselor app.
You will receive a photo of handwritten counselor notes about a student.

Extract and organize the notes into exactly 5 sections. Return ONLY a raw JSON object (no markdown fences, no explanation) with these keys:
- careerGoal
- interests
- financial
- concerns
- impression

Each value must be an HTML fragment using only: <p>, <strong>, <em>, <ul>, <li>, <ol>.
If a section is not found, return "<p></p>" for that key.
Keep original meaning. Clean up grammar only if needed for clarity.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            { inlineData: { mimeType, data: imageBase64 } },
            { text: "Extract the handwritten counselor notes from this image. Map them to the 5 sections: Career Goal, Personal Interests & Strengths, Family & Financial Situation, Concerns & Red Flags, and Counselor's Overall Impression. Return only the raw JSON object." },
          ],
        },
      ],
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
      },
    });

    const text = response.text;
    if (!text)
      return NextResponse.json({ error: "No response from vision model" }, { status: 500 });

    const cleaned = text.trim().replace(/^```(?:json)?\s*\n?/i, "").replace(/\n?```\s*$/i, "");
    return NextResponse.json(JSON.parse(cleaned));
  } catch (err) {
    console.error("Extract notes error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to extract notes" },
      { status: 500 },
    );
  }
}
