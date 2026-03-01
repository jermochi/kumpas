import { NextResponse } from 'next/server';
import { callAgent } from '@/lib/llm';
import { buildLaborSystemPrompt } from '@/lib/analysts/labor';

export async function POST(req: Request) {
  try {
    const { transcript, careerPathTitle } = await req.json();
    if (!transcript || !careerPathTitle)
      return NextResponse.json({ error: 'Transcript and careerPathTitle required' }, { status: 400 });

    const laborPrompt = buildLaborSystemPrompt(careerPathTitle);
    const laborAnalysis = await callAgent(laborPrompt, transcript, process.env.LABOR_AGENT_API_KEY as string, "Labor Market Analyst");

    return NextResponse.json({ status: 'success', data: laborAnalysis });
  } catch (error) {
    console.error('Labor Analyst Error:', error);
    return NextResponse.json({ error: 'Labor analysis failed' }, { status: 500 });
  }
}
