import { NextResponse } from 'next/server';
import { callAgent } from '@/lib/llm';
import { buildLaborSystemPrompt } from '@/lib/analysts/labor';
import { laborMarketSchema } from '@/lib/agent-schemas';

export async function POST(req: Request) {
  try {
    const { sessionIntakeOutput, careerPathTitle } = await req.json();
    if (!sessionIntakeOutput || !careerPathTitle)
      return NextResponse.json({ error: 'Session Intake Output and careerPathTitle required' }, { status: 400 });

    const laborPrompt = buildLaborSystemPrompt(careerPathTitle);
    const laborAnalysis = await callAgent(laborPrompt, sessionIntakeOutput, process.env.LABOR_AGENT_API_KEY as string, "Labor Market Analyst", laborMarketSchema);

    return NextResponse.json({ status: 'success', data: laborAnalysis });
  } catch (error) {
    console.error('Labor Analyst Error:', error);
    return NextResponse.json({ error: 'Labor analysis failed' }, { status: 500 });
  }
}
