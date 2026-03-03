import { NextResponse } from "next/server";
import { callAgent } from "@/lib/llm";
import fs from "fs";
import path from "path";

function getPrompt(filename: string): string {
    const filePath = path.join(process.cwd(), "src/prompts", filename);
    return fs.readFileSync(filePath, "utf8");
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { counselorNotes, extractedDocuments } = body as { counselorNotes?: string, extractedDocuments?: any[] };

        if (!counselorNotes) {
            return NextResponse.json({ error: "Session Notes are required" }, { status: 400 });
        }

        const systemPrompt = getPrompt("transcription_layer.md");

        let combinedInput = `=== Session Notes ===\n${counselorNotes}\n`;

        if (extractedDocuments && extractedDocuments.length > 0) {
            extractedDocuments.forEach((doc, idx) => {
                combinedInput += `\n=== Document ${idx + 1} ===\n${JSON.stringify(doc, null, 2)}\n`;
            });
        }

        const structured = await callAgent(
            systemPrompt,
            combinedInput,
            process.env.TRANSCRIPTION_LAYER_API_KEY as string,
            "Verdict Agent: Transcription Layer"
        );

        if (structured.error) {
            return NextResponse.json({ error: structured.error }, { status: 500 });
        }

        return NextResponse.json(structured);
    } catch (err) {
        console.error("Transcription layer error:", err);
        return NextResponse.json({ error: "Failed to process transcript" }, { status: 500 });
    }
}