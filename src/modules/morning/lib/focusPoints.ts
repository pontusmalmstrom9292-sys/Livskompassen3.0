/** Kanonisk Firestore-sökväg för dagligt fokus (Kat 5 / Morgonkompassen). */
export const USER_DAILY_FOCUS_COLLECTION = 'user_daily_focus';

export const MORNING_FOCUS_SLOTS = 3;

const EMPTY_FOCUS_POINTS: readonly string[] = ['', '', ''] as const;

export function getLocalIsoDate(date = new Date()): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

/** Normaliserar rå `focusPoints` till exakt tre strängplatser. */
export function normalizeFocusPoints(raw: unknown): string[] {
  const points = [...EMPTY_FOCUS_POINTS];
  if (!Array.isArray(raw)) return points;
  raw.forEach((value, index) => {
    if (index < MORNING_FOCUS_SLOTS && typeof value === 'string') {
      points[index] = value;
    }
  });
  return points;
}

export function hasAnyFocusPoint(points: string[]): boolean {
  return points.some((point) => point.trim() !== '');
}

/** Parsar legacy `daily_intentions.intention` (JSON-array eller fri text). */
export function parseLegacyIntention(intention: string): string[] {
  const points = [...EMPTY_FOCUS_POINTS];
  try {
    const parsed = JSON.parse(intention);
    if (Array.isArray(parsed)) {
      parsed.forEach((value, index) => {
        if (index < MORNING_FOCUS_SLOTS && typeof value === 'string') {
          points[index] = value;
        }
      });
      return points;
    }
  } catch {
    // fall through — behandla som enstaka sträng
  }
  if (intention.trim()) {
    points[0] = intention;
  }
  return points;
}
