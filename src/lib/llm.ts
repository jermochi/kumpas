import { GoogleGenAI } from '@google/genai';

// ─── JSON Sanitization Utilities ─────────────────────────────────────────────

/**
 * Sanitize a raw LLM output string so it can be safely JSON.parsed.
 * Handles: markdown code-fences, trailing commas, single-line comments,
 * control characters inside strings.
 */
function sanitizeJsonString(raw: string): string {
  let s = raw.trim();
  s = s.replace(/^```(?:json)?\s*\n?/i, '').replace(/\n?```\s*$/i, '');
  s = s.replace(/^\s*\/\/.*$/gm, '');
  s = s.replace(/,\s*([\]}])/g, '$1');
  s = s.replace(/[\x00-\x08\x0b\x0c\x0e-\x1f]/g, '');
  return s.trim();
}

/**
 * Extract the first complete JSON object or array from a string
 * by counting braces/brackets.
 */
function extractJsonBlock(raw: string): string | null {
  const start = raw.search(/[{\[]/);
  if (start === -1) return null;

  const openChar = raw[start];
  const closeChar = openChar === '{' ? '}' : ']';
  let depth = 0;
  let inString = false;
  let escape = false;

  for (let i = start; i < raw.length; i++) {
    const ch = raw[i];
    if (escape) { escape = false; continue; }
    if (ch === '\\') { escape = true; continue; }
    if (ch === '"') { inString = !inString; continue; }
    if (inString) continue;
    if (ch === openChar) depth++;
    if (ch === closeChar) depth--;
    if (depth === 0) return raw.slice(start, i + 1);
  }
  return null;
}

/**
 * Try to parse JSON from raw LLM output using three fallback tiers.
 * Throws if all tiers fail.
 */
function parseJsonOutput(raw: string): unknown {
  // Tier 1: Direct parse
  try { return JSON.parse(raw); } catch { /* fall through */ }

  // Tier 2: Sanitize then parse
  try { return JSON.parse(sanitizeJsonString(raw)); } catch { /* fall through */ }

  // Tier 3: Extract JSON block via brace-counting then parse
  const extracted = extractJsonBlock(raw);
  if (extracted) {
    try { return JSON.parse(extracted); } catch { /* fall through */ }
  }

  throw new Error(`No valid JSON found in output. Preview: ${raw.slice(0, 300)}`);
}

// ─── Agent Failure Shape ──────────────────────────────────────────────────────

export interface AgentFailure {
  error: string;
  agent: string;
}

export function isAgentFailure(val: unknown): val is AgentFailure {
  return (
    typeof val === 'object' &&
    val !== null &&
    'error' in val &&
    'agent' in val
  );
}

// ─── Core Call ────────────────────────────────────────────────────────────────

const MAX_RETRIES = 2;
const RETRY_DELAY_MS = 1500;

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Call a Gemini agent with retry logic. Always returns — never throws.
 * On failure returns an AgentFailure object the pipeline can check with isAgentFailure().
 *
 * @param systemPromptText  The agent's system prompt
 * @param userTranscript    The structured transcript or input payload
 * @param apiKey            Gemini API key
 * @param agentName         Human-readable name for logging ("transcription", "labor_market", etc.)
 */
export async function callAgent(
  systemPromptText: string,
  userTranscript: string,
  apiKey: string,
  agentName = 'unknown'
): Promise<unknown> {
  if (!apiKey) {
    return { error: 'API key is missing.', agent: agentName } satisfies AgentFailure;
  }

  const ai = new GoogleGenAI({ apiKey });
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Analyze this session transcript: ${userTranscript}`,
        config: {
          systemInstruction: systemPromptText,
          responseMimeType: 'application/json',
        },
      });

      const textOutput = response.text;

      if (!textOutput || textOutput.trim().length === 0) {
        throw new Error('Empty response from Gemini');
      }

      // Detect plain-text safety refusals / non-JSON responses early
      const looksLikeJson = textOutput.includes('{') || textOutput.includes('[');
      if (!looksLikeJson && textOutput.length < 800) {
        throw new Error(`Non-JSON response received: "${textOutput.slice(0, 200)}"`);
      }

      const parsed = parseJsonOutput(textOutput);

      // If the model itself emitted a parse_failure per our prompt instructions,
      // normalise it into an AgentFailure so the pipeline handles it uniformly.
      if (
        parsed !== null &&
        typeof parsed === 'object' &&
        'error' in (parsed as Record<string, unknown>)
      ) {
        const p = parsed as Record<string, unknown>;
        return {
          error: String(p.error ?? 'Model-reported parse_failure'),
          agent: String(p.agent ?? agentName),
        } satisfies AgentFailure;
      }

      return parsed;

    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      console.warn(`[callAgent:${agentName}] attempt ${attempt}/${MAX_RETRIES} failed:`, lastError.message);
      if (attempt < MAX_RETRIES) await sleep(RETRY_DELAY_MS * attempt);
    }
  }

  // All retries exhausted — return structured failure, never throw
  console.error(`[callAgent:${agentName}] all retries exhausted. Last error:`, lastError?.message);
  return {
    error: lastError?.message ?? 'Unknown error after retries',
    agent: agentName,
  } satisfies AgentFailure;
}