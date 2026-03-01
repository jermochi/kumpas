import { NextResponse } from "next/server";
import { callAgent, isAgentFailure } from "@/lib/llm";
import { getSystemInstructions } from "@/lib/utils";

export async function POST(req: Request) {
    try {
        const body = await req.json() as {
            labor?: unknown;
            feasibility?: unknown;
            psychological?: unknown;
            career_path?: string;
            career_path_source?: string;
        };

        if (!body.labor || !body.feasibility || !body.psychological) {
            return NextResponse.json(
                { error: "All three agent outputs are required" },
                { status: 400 }
            );
        }

        const systemPrompt = getSystemInstructions("adjacent_career.md");

        const agentInput = JSON.stringify({
            career_path_detected: body.career_path,
            career_path_source: body.career_path_source,
            labor_market_analysis: body.labor,
            feasibility_analysis: body.feasibility,
            psychological_analysis: body.psychological,
        });

        const result = await callAgent(
            systemPrompt,
            agentInput,
            process.env.VERDICT_AGENT_API_KEY as string,
            "adjacent_career"
        );

        if (isAgentFailure(result)) {
            return NextResponse.json({ error: result.error }, { status: 500 });
        }

        return NextResponse.json(result);
    } catch (err) {
        console.error("Adjacent career finder error:", err);
        return NextResponse.json({ error: "Failed to find adjacent careers" }, { status: 500 });
    }
}