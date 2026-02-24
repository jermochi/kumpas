import { NextResponse } from 'next/server';
import { callAgent } from '@/lib/llm';
import { buildLaborSystemPrompt } from '@/lib/analysts/labor';

export async function POST(req: Request) {
  try {
    const { transcript } = await req.json();
    if (!transcript) return NextResponse.json({ error: 'Transcript required' }, { status: 400 });

    const laborPrompt = buildLaborSystemPrompt();
    const laborAnalysis = await callAgent(laborPrompt, transcript, process.env.LABOR_AGENT_API_KEY as string);

    return NextResponse.json({ status: 'success', data: laborAnalysis });
  } catch (error) {
    console.error('Labor Analyst Error:', error);
    return NextResponse.json({ error: 'Labor analysis failed' }, { status: 500 });
  }
}