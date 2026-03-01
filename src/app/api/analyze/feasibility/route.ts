import { NextResponse } from 'next/server';
import { callAgent } from '@/lib/llm';
import { buildFeasibilitySystemPrompt } from '@/lib/analysts/feasibility';

export async function POST(req: Request) {
  try {
    const { transcript, careerPathTitle } = await req.json();
    if (!transcript || !careerPathTitle)
      return NextResponse.json({ error: 'Transcript and careerPathTitle required' }, { status: 400 });

    const feasibilityPrompt = buildFeasibilitySystemPrompt(careerPathTitle);
    const feasibilityAnalysis = await callAgent(feasibilityPrompt, transcript, process.env.FEASIBILITY_AGENT_API_KEY as string, "Feasibility Analyst");

    return NextResponse.json({ status: 'success', data: feasibilityAnalysis });
  } catch (error) {
    console.error('Feasibility Analyst Error:', error);
    return NextResponse.json({ error: 'Feasibility analysis failed' }, { status: 500 });
  }
}