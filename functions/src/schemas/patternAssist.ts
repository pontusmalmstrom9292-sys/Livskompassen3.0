/** P1 flow_pattern_assist — Gemini responseSchema + validators. */

export const PATTERN_ASSIST_RESPONSE_SCHEMA = {
  type: 'object',
  properties: {
    pattern_ids: {
      type: 'array',
      items: { type: 'string' },
    },
  },
  required: ['pattern_ids'],
} as const;

export interface PatternAssistResponse {
  pattern_ids: string[];
}

export function validatePatternAssistResponse(
  value: unknown,
  allowedIds: Set<string>,
): PatternAssistResponse | null {
  if (!value || typeof value !== 'object') return null;
  const o = value as Record<string, unknown>;
  if (!Array.isArray(o.pattern_ids)) return null;
  const pattern_ids = o.pattern_ids
    .filter((id): id is string => typeof id === 'string' && allowedIds.has(id))
    .slice(0, 5);
  return { pattern_ids };
}
