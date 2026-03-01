import { GoogleGenAI } from '@google/genai';

/**
 * Sanitize a raw LLM output string so it can be safely JSON.parsed.
 * Handles: markdown code-fences, trailing commas, single-line comments,
 * control characters inside strings.
 */
function sanitizeJsonString(raw: string): string {
  let s = raw.trim();

  // Strip markdown code fences (```json ... ``` or ``` ... ```)
  s = s.replace(/^```(?:json)?\s*\n?/i, '').replace(/\n?```\s*$/i, '');

  // Remove single-line JS-style comments (// …) that are NOT inside strings.
  s = s.replace(/^\s*\/\/.*$/gm, '');

  // Remove trailing commas before } or ]
  s = s.replace(/,\s*([\]}])/g, '$1');

  // Remove control characters (except \n \r \t) that break JSON
  s = s.replace(/[\x00-\x08\x0b\x0c\x0e-\x1f]/g, '');

  return s.trim();
}

/**
 * Extract the first complete JSON object or array from a string
 * by counting braces/brackets. Handles cases where LLM wraps JSON
 * in extra text, markdown, or explanation.
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

    if (depth === 0) {
      return raw.slice(start, i + 1);
    }
  }
  return null;
}

export async function callAgent(
  systemPromptText: string,
  userTranscript: string,
  apiKey: string,
  analyst: string = "Agent"
) {
  if (!apiKey) {
    throw new Error("API key is missing for this agent.");
  }

  const ai = new GoogleGenAI({ apiKey: apiKey });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Analyze this session transcript: ${userTranscript}`,
      config: {
        systemInstruction: systemPromptText,
        responseMimeType: 'application/json',
      }
    });

  const textOutput = response.text;

  // Token metadata for estimating costs and monitoring usage
  const usage = response.usageMetadata;
  const pad = (s: string | number, n: number) => String(s).padEnd(n);
  const lines = [
    `\nToken Usage — ${analyst}`,
    `${"─".repeat(35)}`,
    `${pad("Prompt (input)",          25)} ${pad(usage?.promptTokenCount        ?? 0, 8)}`,
    `${pad("Response (output)",       25)} ${pad(usage?.candidatesTokenCount    ?? 0, 8)}`,
    `${pad("Thinking",                25)} ${pad(usage?.thoughtsTokenCount      ?? 0, 8)}`,
    `${pad("Cached input",            25)} ${pad(usage?.cachedContentTokenCount ?? 0, 8)}`,
    `${"─".repeat(35)}`,
    `${pad("Total",                   25)} ${pad(usage?.totalTokenCount         ?? 0, 8)}`,
  ];

  console.log(lines.join("\n"));

    if (!textOutput) {
      throw new Error("No text returned from Gemini");
    }

    // Tier 1: Direct parse
    try {
      return JSON.parse(textOutput);
    } catch {
      // Tier 2: Sanitize and parse
      try {
        return JSON.parse(sanitizeJsonString(textOutput));
      } catch {
        // Tier 3: Extract JSON block via brace-counting
        const extracted = extractJsonBlock(textOutput);
        if (extracted) {
          try {
            return JSON.parse(extracted);
          } catch (e3) {
            console.error("All JSON parse attempts failed. Raw output preview:", textOutput.slice(0, 500));
            throw e3;
          }
        }
        throw new Error("No JSON object found in LLM output");
      }
    }

  } catch (error) {
    console.error("Gemini API Error:", error);
    return { error: `Failed to generate or parse agent output: ${error instanceof Error ? error.message : String(error)}` };
  }
}