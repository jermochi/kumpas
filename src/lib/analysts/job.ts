import { getSystemInstructions, getFilteredJsonContexts } from '../server-utils';

export function buildJobSystemPrompt(careerPathTitle: string): string {
  const baseInstructions = getSystemInstructions('job_analyst.md');
  // Only load JD-R profiles matching this career (exact + ~5 fuzzy matches)
  // instead of all 300+ job profiles (~10.8MB → ~5-10KB)
  const jobContexts = getFilteredJsonContexts('job-analyst', careerPathTitle);

  // Combine career path, data context, and base instructions
  return `
<career_path_title>${careerPathTitle}</career_path_title>

<job_data_context>
${jobContexts}
</job_data_context>

${baseInstructions}
`;
}