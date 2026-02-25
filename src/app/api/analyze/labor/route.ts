import { NextResponse } from 'next/server';
import { callAgent } from '@/lib/llm';
import { buildLaborSystemPrompt } from '@/lib/analysts/labor';
import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'src/prompts', 'labor_analyst.md');
const laborAnalystInstructions = fs.readFileSync(filePath, 'utf8');

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