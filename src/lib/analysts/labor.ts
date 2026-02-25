import { getSystemInstructions, getJsonContexts } from '../utils';

export function buildLaborSystemPrompt(): string {
  const baseInstructions = getSystemInstructions('labor_analyst.md');
  const laborContexts = getJsonContexts('labor-analyst');

  // Combine base instructions with context
  return `
<regional_labor_data_context>
${laborContexts}
</regional_labor_data_context>

${baseInstructions}
`;
}