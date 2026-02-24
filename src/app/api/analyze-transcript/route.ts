import { NextResponse } from 'next/server';
import { callAgent } from '@/lib/llm';
import fs from 'fs';
import path from 'path';

// Helper function to read prompt files safely
function getSystemPrompt(filename: string) {
  const filePath = path.join(process.cwd(), 'src/prompts', filename);
  return fs.readFileSync(filePath, 'utf8');
}

export async function POST(req: Request) {
  try {
    const { transcript } = await req.json();

    if (!transcript) {
      return NextResponse.json({ error: 'Transcript is required' }, { status: 400 });
    }

    // Read the markdown files from the file system
    const laborAnalystInstructions = getSystemPrompt('labor_analyst.md');
    const feasibilityAnalystInstructions = getSystemPrompt('feasibility_analyst.md');
    const psychologicalAnalystInstructions = getSystemPrompt('psychological_analyst.md');

    // Execute in parallel with separate keys and system instructions
    const [laborAnalysis, feasibilityAnalysis, psychologicalAnalysis] = await Promise.all([
      callAgent(laborAnalystInstructions, transcript, process.env.LABOR_AGENT_API_KEY as string),
      callAgent(feasibilityAnalystInstructions, transcript, process.env.FEASIBILITY_AGENT_API_KEY as string),
      callAgent(psychologicalAnalystInstructions, transcript, process.env.PSYCHOLOGICAL_AGENT_API_KEY as string),
    ]);

    return NextResponse.json({
      status: 'success',
      data: {
        labor: laborAnalysis,
        feasibility: feasibilityAnalysis,
        psychological: psychologicalAnalysis,
      }
    });

  } catch (error) {
    console.error('Error processing transcript:', error);
    return NextResponse.json({ error: 'Failed to analyze transcript' }, { status: 500 });
  }
}