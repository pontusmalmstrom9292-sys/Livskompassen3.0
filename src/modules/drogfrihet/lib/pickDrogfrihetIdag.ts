import { DROGFRIHET_CARDS, type DrogfrihetCard } from '../content/drogfrihetCatalog';

export type DrogfrihetIdagPick = {
  dateKey: string;
  card: DrogfrihetCard;
};

function fnv1a(input: string): number {
  let hash = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function localDateKey(date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** Deterministiskt dagkort — samma hela dagen, nytt vid midnatt. Ingen streak. */
export function pickDrogfrihetIdag(options?: { uid?: string; date?: Date }): DrogfrihetIdagPick {
  const dateKey = localDateKey(options?.date);
  const uid = options?.uid ?? 'anon';
  const seed = `${dateKey}|${uid}|drogfrihet-idag`;
  const index = fnv1a(seed) % DROGFRIHET_CARDS.length;
  return { dateKey, card: DROGFRIHET_CARDS[index]! };
}
