import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { getSystemInstructions } from "@/lib/server-utils";
import type { ExtractedNotes } from "@/lib/analysis-types";

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

    const systemPrompt = getSystemInstructions('notes_analysis.md');

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            { inlineData: { mimeType, data: imageBase64 } },
            { text: "Extract the counselor notes from this image. Map them to the 5 sections: careerGoal, interests, financial, concerns, impression. Return only the raw JSON object with HTML-formatted values." },
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
    const parsed = JSON.parse(cleaned);

    // Ensure each value is valid HTML for contentEditable — wrap plain text in <p> tags
    const wrapHtml = (val: unknown): string => {
      if (!val || typeof val !== "string") return "";
      const trimmed = val.trim();
      if (!trimmed) return "";
      // If it already starts with an HTML tag, return as-is
      if (/^<[a-z]/i.test(trimmed)) return trimmed;
      // Otherwise wrap each line in <p>
      return trimmed.split(/\n+/).map(line => `<p>${line}</p>`).join("");
    };

    const result: ExtractedNotes = {
      careerGoal: wrapHtml(parsed.careerGoal),
      interests:  wrapHtml(parsed.interests),
      financial:  wrapHtml(parsed.financial),
      concerns:   wrapHtml(parsed.concerns),
      impression: wrapHtml(parsed.impression),
    };

    return NextResponse.json(result);
  } catch (err) {
    console.error("Extract notes error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to extract notes" },
      { status: 500 },
    );
  }
}
