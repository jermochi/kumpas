import { getSystemInstructions, getFilteredFeasibilityContexts } from '../utils';

export function buildFeasibilitySystemPrompt(careerPathTitle: string): string {
  const baseInstructions = getSystemInstructions('feasibility_analyst.md');
  const feasibilityContexts = getFilteredFeasibilityContexts(careerPathTitle);

  // Combine career path, data context, and base instructions
  return `
<career_path_title>${careerPathTitle}</career_path_title>

<feasibility_data_context>
${feasibilityContexts}
</feasibility_data_context>

${baseInstructions}
`;
}