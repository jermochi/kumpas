import { getSystemInstructions, getJsonContexts } from '../utils';

export function buildFeasibilitySystemPrompt(): string {
  const baseInstructions = getSystemInstructions('feasibility_analyst.md');
  const laborContexts = getJsonContexts('feasibility-analyst');
  
  // Combine base instructions with context
   return `
  <feasibility_data_context>
  ${laborContexts}
  </feasibility_data_context>
  
  ${baseInstructions}
  `;
}