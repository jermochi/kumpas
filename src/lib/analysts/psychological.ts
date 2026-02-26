import { getSystemInstructions, getFilteredJsonContexts } from '../utils';

export function buildPsychSystemPrompt(careerPathTitle: string): string {
  const baseInstructions = getSystemInstructions('psychological_analyst.md');
  // Only load JD-R profiles matching this career (exact + ~5 fuzzy matches)
  // instead of all 300+ job profiles (~10.8MB → ~5-10KB)
  const psychContexts = getFilteredJsonContexts('psych-analyst', careerPathTitle);

  // Combine career path, data context, and base instructions
  return `
<career_path_title>${careerPathTitle}</career_path_title>

<psychological_data_context>
${psychContexts}
</psychological_data_context>

${baseInstructions}
`;
}