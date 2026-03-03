import { NextResponse } from 'next/server';
import { callAgent } from '@/lib/llm';
import { buildJobDemandSystemPrompt } from '@/lib/analysts/jobDemand';

export async function POST(req: Request) {
  try {
    const { sessionIntakeOutput, careerPathTitle } = await req.json();
    if (!sessionIntakeOutput || !careerPathTitle)
      return NextResponse.json({ error: 'Session Intake Output and careerPathTitle required' }, { status: 400 });

    const jobDemandPrompt = buildJobDemandSystemPrompt(careerPathTitle);
    const jobDemandAnalysis = await callAgent(jobDemandPrompt, sessionIntakeOutput, process.env.JOB_DEMAND_AGENT_API_KEY as string, "Job Demand Analyst");

    return NextResponse.json({ status: 'success', data: jobDemandAnalysis });
  } catch (error) {
    console.error('Job Demand Analyst Error:', error);
    return NextResponse.json({ error: 'Job demand analysis failed' }, { status: 500 });
  }
}