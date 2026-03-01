import { NextResponse } from "next/server";
import { callAgent, isAgentFailure } from "@/lib/llm";
import fs from "fs";
import path from "path";

function getPrompt(filename: string): string {
    const filePath = path.join(process.cwd(), "src/prompts", filename);
    return fs.readFileSync(filePath, "utf8");
}

export async function POST(req: Request) {
    try {
        const { transcript } = await req.json() as { transcript?: string };

        if (!transcript) {
            return NextResponse.json({ error: "Transcript is required" }, { status: 400 });
        }

        const systemPrompt = getPrompt("transcription_layer.md");

        const structured = await callAgent(
            systemPrompt,
            transcript,
            process.env.TRANSCRIPTION_LAYER_API_KEY as string,
            "transcription_layer"
        );

        if (isAgentFailure(structured)) {
            return NextResponse.json({ error: structured.error }, { status: 500 });
        }

        return NextResponse.json(structured);
    } catch (err) {
        console.error("Transcription layer error:", err);
        return NextResponse.json({ error: "Failed to process transcript" }, { status: 500 });
    }
}