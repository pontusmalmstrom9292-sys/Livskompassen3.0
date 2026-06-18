export type BiffRewriteToneCheck = 'pass' | 'still_emotional' | 'too_long';

export type BiffRewriteDraftResult = {
  cleanedText: string;
  toneCheck: BiffRewriteToneCheck;
};

function stripJsonFences(raw: string): string {
  return raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
}

function extractJsonObject(raw: string): string {
  const cleaned = stripJsonFences(raw);
  const start = cleaned.indexOf('{');
  const end = cleaned.lastIndexOf('}');
  if (start >= 0 && end > start) return cleaned.slice(start, end + 1);
  return cleaned;
}

function normalizeToneCheck(value: unknown): BiffRewriteToneCheck {
  const v = String(value ?? '').trim().toLowerCase();
  if (v === 'still_emotional' || v === 'too_long') return v;
  return 'pass';
}

export function biffRewriteDraftFallback(draft: string): BiffRewriteDraftResult {
  const trimmed = draft.trim();
  return {
    cleanedText: trimmed,
    toneCheck: 'pass',
  };
}

export function parseBiffRewriteDraftJson(raw: string, draft: string): BiffRewriteDraftResult {
  const jsonText = extractJsonObject(raw);
  const parsed = JSON.parse(jsonText) as Partial<BiffRewriteDraftResult>;
  const cleanedText =
    typeof parsed.cleanedText === 'string' && parsed.cleanedText.trim()
      ? parsed.cleanedText.trim()
      : draft.trim();
  return {
    cleanedText,
    toneCheck: normalizeToneCheck(parsed.toneCheck),
  };
}
