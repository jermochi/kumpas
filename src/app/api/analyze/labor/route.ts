import { NextResponse } from 'next/server';
import { callAgent } from '@/lib/llm';
import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'src/prompts', 'labor_analyst.md');
const laborAnalystInstructions = fs.readFileSync(filePath, 'utf8');

export async function POST(req: Request) {
  try {
    const { transcript } = await req.json();

    if (!transcript) {
      return NextResponse.json({ error: 'Transcript is required' }, { status: 400 });
    }

    const analysis = await callAgent(
      laborAnalystInstructions, 
      transcript, 
      process.env.LABOR_AGENT_API_KEY as string
    );

    return NextResponse.json({
      status: 'success',
      data: analysis
    });

  } catch (error) {
    console.error('Error processing Labor Analysis:', error);
    return NextResponse.json({ error: 'Failed to analyze labor market viability' }, { status: 500 });
  }
}