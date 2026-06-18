/** P1 flow_biff_rewrite — Gemini responseSchema + validators. */

export const BIFF_REWRITE_RESPONSE_SCHEMA = {
  type: 'object',
  properties: {
    cleanedText: { type: 'string' },
    toneCheck: { type: 'string', enum: ['pass', 'still_emotional', 'too_long'] },
  },
  required: ['cleanedText', 'toneCheck'],
} as const;

export type BiffToneCheck = 'pass' | 'still_emotional' | 'too_long';

export interface BiffRewriteResponse {
  cleanedText: string;
  toneCheck: BiffToneCheck;
}

export function validateBiffRewriteResponse(value: unknown): BiffRewriteResponse | null {
  if (!value || typeof value !== 'object') return null;
  const o = value as Record<string, unknown>;
  if (typeof o.cleanedText !== 'string') return null;
  const tone = o.toneCheck;
  if (tone !== 'pass' && tone !== 'still_emotional' && tone !== 'too_long') return null;
  return { cleanedText: o.cleanedText, toneCheck: tone };
}
