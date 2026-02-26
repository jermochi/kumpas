import { NextResponse } from 'next/server';
import { callAgent } from '@/lib/llm';
import { buildPsychSystemPrompt } from '@/lib/analysts/psychological';

export async function POST(req: Request) {
  try {
    const { transcript, careerPathTitle } = await req.json();
    if (!transcript || !careerPathTitle)
      return NextResponse.json({ error: 'Transcript and careerPathTitle required' }, { status: 400 });

    const psychologicalPrompt = buildPsychSystemPrompt(careerPathTitle);
    const psychologicalAnalysis = await callAgent(psychologicalPrompt, transcript, process.env.PSYCHOLOGICAL_AGENT_API_KEY as string);

    return NextResponse.json({ status: 'success', data: psychologicalAnalysis });
  } catch (error) {
    console.error('Psychological Analyst Error:', error);
    return NextResponse.json({ error: 'Psychological analysis failed' }, { status: 500 });
  }
}