/**
 * Lokal kortrotation för Barnhub — device only, Zero Footprint-vänlig.
 * Ingen moln-ML. Rensas vid Device Clear om localStorage rensas.
 */

const STORAGE_KEY = 'lk.barnhub.cardRotation.v1';

export type CardRotationState = {
  /** cardId → last opened ISO date */
  opened: Record<string, string>;
  /** cardId → skip count */
  skipped: Record<string, number>;
  /** cardId → last skipped ISO */
  lastSkipped: Record<string, string>;
};

function empty(): CardRotationState {
  return { opened: {}, skipped: {}, lastSkipped: {} };
}

export function loadCardRotation(): CardRotationState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return empty();
    const parsed = JSON.parse(raw) as Partial<CardRotationState>;
    return {
      opened: parsed.opened ?? {},
      skipped: parsed.skipped ?? {},
      lastSkipped: parsed.lastSkipped ?? {},
    };
  } catch {
    return empty();
  }
}

function save(state: CardRotationState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* quota / private mode — ignore */
  }
}

export function markCardOpened(cardId: string): void {
  const s = loadCardRotation();
  s.opened[cardId] = new Date().toISOString();
  save(s);
}

export function markCardSkipped(cardId: string): void {
  const s = loadCardRotation();
  s.skipped[cardId] = (s.skipped[cardId] ?? 0) + 1;
  s.lastSkipped[cardId] = new Date().toISOString();
  save(s);
}

/** Lägre score = mer prioriterad (ej nyss öppnad, färre skips). */
export function cardRotationScore(cardId: string, now = Date.now()): number {
  const s = loadCardRotation();
  const openedAt = s.opened[cardId];
  const skips = s.skipped[cardId] ?? 0;
  let score = skips * 10;
  if (openedAt) {
    const ageH = (now - Date.parse(openedAt)) / 3_600_000;
    if (ageH < 24) score += 50;
    else if (ageH < 72) score += 20;
  }
  const skippedAt = s.lastSkipped[cardId];
  if (skippedAt) {
    const ageH = (now - Date.parse(skippedAt)) / 3_600_000;
    if (ageH < 12) score += 30;
  }
  return score;
}

export function sortCardsByRotation<T extends { id: string }>(cards: readonly T[]): T[] {
  return [...cards].sort((a, b) => cardRotationScore(a.id) - cardRotationScore(b.id));
}
