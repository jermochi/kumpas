import { getSystemInstructions, getJsonContexts } from '../utils';

export function buildPsychSystemPrompt(careerPathTitle: string): string {
  const baseInstructions = getSystemInstructions('psychological_analyst.md');
  const psychContexts = getJsonContexts('psych-analyst');

  // Combine career path, data context, and base instructions
  return `
<career_path_title>${careerPathTitle}</career_path_title>

<psychological_data_context>
${psychContexts}
</psychological_data_context>

${baseInstructions}
`;
}