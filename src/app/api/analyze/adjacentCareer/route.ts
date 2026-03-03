import { NextResponse } from "next/server";
import { callAgent } from "@/lib/llm";
import { getSystemInstructions } from "@/lib/server-utils";

export async function POST(req: Request) {
    try {
        const body = await req.json() as {
            feasibility?: unknown;
            labor?: unknown;
            jobDemand?: unknown;
            career_path?: string;
            career_path_source?: string;
        };

        if (!body.feasibility || !body.labor || !body.jobDemand) {
            return NextResponse.json(
                { error: "All three agent outputs are required" },
                { status: 400 }
            );
        }

        const systemPrompt = getSystemInstructions("adjacent_career.md");

        // The Adjacent Career Finder receives all 3 agent JSON outputs
        // and the career path — it identifies related alternative careers
        const agentInput = JSON.stringify({
            career_path_detected: body.career_path,
            career_path_source: body.career_path_source,
            labor_market_analysis: body.labor,
            feasibility_analysis: body.feasibility,
            job_demand_analysis: body.jobDemand,
        });

        const result = await callAgent(
            systemPrompt,
            agentInput,
            process.env.ADJACENT_CAREER_AGENT_API_KEY as string,
            "Adjacent Career Agent"
        );

        if (result.error) {
            return NextResponse.json({ error: result.error }, { status: 500 });
        }

        return NextResponse.json(result);
    } catch (err) {
        console.error("Adjacent career finder error:", err);
        return NextResponse.json({ error: "Failed to find adjacent careers" }, { status: 500 });
    }
}