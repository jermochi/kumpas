import { NextResponse } from 'next/server';
import { callAgent } from '@/lib/llm';
import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'src/prompts', 'feasibility_analyst.md');
const feasibilityAnalystInstructions = fs.readFileSync(filePath, 'utf8');

export async function POST(req: Request) {
  try {
    const { transcript } = await req.json();

    if (!transcript) {
      return NextResponse.json({ error: 'Transcript is required' }, { status: 400 });
    }

    const analysis = await callAgent(
      feasibilityAnalystInstructions, 
      transcript, 
      process.env.FEASIBILITY_AGENT_API_KEY as string
    );

    return NextResponse.json({
      status: 'success',
      data: analysis
    });

  } catch (error) {
    console.error('Error processing Feasibility Analysis:', error);
    return NextResponse.json({ error: 'Failed to analyze feasibility' }, { status: 500 });
  }
}