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
        const body = await req.json() as {
            labor?:         unknown;
            feasibility?:   unknown;
            psychological?: unknown;
            career_path?:   string;
            career_path_source?: string;
        };

        if (!body.labor || !body.feasibility || !body.psychological) {
            return NextResponse.json(
                { error: "All three agent outputs are required" },
                { status: 400 }
            );
        }

        const systemPrompt = getPrompt("verdict_generator.md");

        // The Verdict Generator receives all 3 agent JSON outputs as a single
        // structured input — it works exclusively from agent JSON, not the transcript
        const agentInput = JSON.stringify({
            career_path_detected: body.career_path,
            career_path_source:   body.career_path_source,
            labor_market_analysis:  body.labor,
            feasibility_analysis:   body.feasibility,
            psychological_analysis: body.psychological,
        });

        const verdict = await callAgent(
            systemPrompt,
            agentInput,
            process.env.VERDICT_AGENT_API_KEY as string
        );

        if (verdict.error) {
            return NextResponse.json({ error: verdict.error }, { status: 500 });
        }

        return NextResponse.json(verdict);
    } catch (err) {
        console.error("Verdict generator error:", err);
        return NextResponse.json({ error: "Failed to generate verdict" }, { status: 500 });
    }
}