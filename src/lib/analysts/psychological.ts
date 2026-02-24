import { getSystemInstructions } from '../utils';

export function buildPsychSystemPrompt(): string {
  return getSystemInstructions('psychological_analyst.md');
}