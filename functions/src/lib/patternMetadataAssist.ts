import { HttpsError } from 'firebase-functions/v2/https';
import { createGenAI } from './genaiClient';
import { GEMINI_PRO } from './modelRouter';
import {
  TACTIC_PATTERN_DEFS,
  type TacticMatch,
  compileTacticPatterns,
} from './tacticPatternLibrary';

const PATTERN_ASSIST_MODEL = GEMINI_PRO;

const ALLOWED_PATTERN_IDS = new Set(TACTIC_PATTERN_DEFS.map((d) => d.id));

import { PATTERN_ASSIST_RESPONSE_SCHEMA, validatePatternAssistResponse } from '../schemas/patternAssist';
import { PATTERN_ASSIST_SYSTEM } from '../sharedRules';

function extractJsonObject(raw: string): string {
  const cleaned = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
  const start = cleaned.indexOf('{');
  const end = cleaned.lastIndexOf('}');
  if (start >= 0 && end > start) return cleaned.slice(start, end + 1);
  return cleaned;
}

/** Deterministisk DCAP-före-LLM — ingen modell beslutar auth eller WORM. */
export function dcapGatePatternAssist(text: string): { allow: boolean; reason: string } {
  const trimmed = text.trim();
  if (trimmed.length < 12) {
    return { allow: false, reason: 'text_too_short' };
  }
  if (trimmed.length > 12_000) {
    return { allow: false, reason: 'text_too_long' };
  }
  return { allow: true, reason: 'ok' };
}

function buildCatalogPrompt(): string {
  return TACTIC_PATTERN_DEFS.map((d) => `- ${d.id} → ${d.technique}`).join('\n');
}

function matchesFromPatternIds(text: string, patternIds: string[]): TacticMatch[] {
  const compiled = compileTacticPatterns();
  const matches: TacticMatch[] = [];
  const seen = new Set<string>();

  for (const patternId of patternIds) {
    if (seen.has(patternId)) continue;
    const def = TACTIC_PATTERN_DEFS.find((d) => d.id === patternId);
    if (!def) continue;
    seen.add(patternId);
    const entry = compiled.find((c) => c.def.id === patternId);
    const m = entry?.re.exec(text);
    matches.push({
      patternId: def.id,
      technique: def.technique,
      matchedText: m?.[0]?.slice(0, 120) ?? def.technique,
      kunskapFactId: def.kunskapFactId,
      weight: def.weight ?? 20,
    });
  }
  return matches;
}

function parsePatternIds(raw: string): string[] {
  try {
    const parsed = JSON.parse(extractJsonObject(raw));
    const validated = validatePatternAssistResponse(parsed, ALLOWED_PATTERN_IDS);
    return validated?.pattern_ids ?? [];
  } catch {
    return [];
  }
}

/** P3 Flow-assist — föreslår katalog-patternIds; valideras mot stängd lista. */
export async function suggestPatternIdsViaLlm(
  text: string,
  geminiApiKey?: string,
): Promise<string[]> {
  const gate = dcapGatePatternAssist(text);
  if (!gate.allow) return [];

  const prompt = `Tillåten katalog (välj endast härifrån):
${buildCatalogPrompt()}

Text att analysera (användarens valv-post — metadata endast):
---
${text.slice(0, 6000)}
---

Returnera JSON med pattern_ids.`;

  try {
    const ai = createGenAI(geminiApiKey);
    const response = await ai.models.generateContent({
      model: PATTERN_ASSIST_MODEL,
      contents: prompt,
      config: {
        systemInstruction: PATTERN_ASSIST_SYSTEM,
        temperature: 0.1,
        maxOutputTokens: 400,
        responseMimeType: 'application/json',
        responseSchema: PATTERN_ASSIST_RESPONSE_SCHEMA,
      },
    });

    const raw = response.text?.trim() ?? '';
    if (!raw) return [];
    return parsePatternIds(raw);
  } catch (error) {
    console.warn('[suggestPatternIdsViaLlm] fallback empty:', error);
    if (error instanceof HttpsError) throw error;
    return [];
  }
}

export function tacticMatchesFromLlmPatternIds(text: string, patternIds: string[]): TacticMatch[] {
  return matchesFromPatternIds(text, patternIds);
}
