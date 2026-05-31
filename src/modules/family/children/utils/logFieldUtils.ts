/** Safe display helpers — Firestore fields may be Timestamp or legacy shapes. */

export function coerceLogText(value: unknown): string {
  if (value == null) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  return '';
}

function timestampToIso(value: { toDate: () => Date }): string {
  return value.toDate().toISOString();
}

/** YYYY-MM-DD or short fallback for UI meta lines. */
export function formatChildLogDate(createdAt: unknown, emptyFallback = ''): string {
  if (createdAt == null) return emptyFallback;
  if (typeof createdAt === 'string') {
    return createdAt.length >= 10 ? createdAt.slice(0, 10) : createdAt || emptyFallback;
  }
  if (
    typeof createdAt === 'object' &&
    createdAt !== null &&
    'toDate' in createdAt &&
    typeof (createdAt as { toDate: () => Date }).toDate === 'function'
  ) {
    return timestampToIso(createdAt as { toDate: () => Date }).slice(0, 10);
  }
  const s = String(createdAt);
  return s.length >= 10 ? s.slice(0, 10) : s || emptyFallback;
}

/** Strip `[kind]` prefix from barnfokus-stored observation. */
export function barnfokusDisplayText(observation: unknown, maxLen?: number): string {
  const raw = coerceLogText(observation).replace(/^\[[\w_]+\]\s*/, '');
  if (maxLen == null || raw.length <= maxLen) return raw;
  return `${raw.slice(0, maxLen).trimEnd()}…`;
}
