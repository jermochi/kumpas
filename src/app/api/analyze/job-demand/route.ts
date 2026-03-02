import { NextResponse } from 'next/server';
import { callAgent } from '@/lib/llm';
import { buildJobSystemPrompt } from '@/lib/analysts/job';

export async function POST(req: Request) {
    try {
        const { transcript, careerPathTitle } = await req.json();
        if (!transcript || !careerPathTitle)
            return NextResponse.json({ error: 'Transcript and careerPathTitle required' }, { status: 400 });

        const jobDemandPrompt = buildJobSystemPrompt(careerPathTitle);
        const jobDemandAnalysis = await callAgent(jobDemandPrompt, transcript, process.env.JOB_AGENT_API_KEY as string, "Job Demand Analyst");

        return NextResponse.json({ status: 'success', data: jobDemandAnalysis });
    } catch (error) {
        console.error('Job Demand Analyst Error:', error);
        return NextResponse.json({ error: 'Job demand analysis failed' }, { status: 500 });
    }
}
