import { getSystemInstructions, getJsonContexts } from '../utils';

export function buildFeasibilitySystemPrompt(): string {
  return getSystemInstructions('feasibility_analyst.md');
}