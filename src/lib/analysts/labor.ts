import { getSystemInstructions, getFilteredLaborContexts } from '../utils';

export function buildLaborSystemPrompt(careerPathTitle: string): string {
  const baseInstructions = getSystemInstructions('labor_analyst.md');
  const laborContexts = getFilteredLaborContexts(careerPathTitle);

  // Combine career path, data context, and base instructions
  return `
<career_path_title>${careerPathTitle}</career_path_title>

<regional_labor_data_context>
${laborContexts}
</regional_labor_data_context>

${baseInstructions}
`;
}