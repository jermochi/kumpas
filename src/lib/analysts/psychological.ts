import { getSystemInstructions, getJsonContexts  } from '../utils';

export function buildPsychSystemPrompt(): string {
  const baseInstructions = getSystemInstructions('psychological_analyst.md');
  const laborContexts = getJsonContexts('psych-analyst');
  
  // Combine base instructions with context
   return `
  <psychological_data_context>
  ${laborContexts}
  </psychological_data_context>
  
  ${baseInstructions}
  `;
}