import {
  DAGLIG_MIX_CARDS,
  DAGLIG_MIX_PLAYS,
  type DagligMixCard,
  type DagligMixPlay,
} from '../content/dagligMixCatalog';
import {
  MABRA_REFLECTION_CARDS,
  type MabraReflectionCard,
} from '../content/mabraReflectionCards';

export type DagligMixPick = {
  dateKey: string;
  card: DagligMixCard;
  play: DagligMixPlay;
};

/** FNV-1a — deterministisk hash för daglig rotation (ingen streak-logik). */
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

function pickFromPool<T>(pool: readonly T[], seed: string): T {
  const index = fnv1a(seed) % pool.length;
  return pool[index]!;
}

/**
 * Deterministisk daglig mix — samma kort + spel hela dagen per användare.
 * Ny mix vid midnatt lokal tid. Ingen streak, ingen Kunskap-RAG.
 */
export function pickDagligMix(options?: { uid?: string; date?: Date }): DagligMixPick {
  const dateKey = localDateKey(options?.date);
  const uid = options?.uid ?? 'anon';
  const cardSeed = `${dateKey}|${uid}|card`;
  const playSeed = `${dateKey}|${uid}|play`;

  return {
    dateKey,
    card: pickFromPool(DAGLIG_MIX_CARDS, cardSeed),
    play: pickFromPool(DAGLIG_MIX_PLAYS, playSeed),
  };
}

export type DailyReflectionPick = {
  dateKey: string;
  card: MabraReflectionCard;
};

/** Deterministiskt frågekort per dag — samma pool som reflection deck, ingen LLM. */
export function pickDailyReflectionCard(options?: {
  uid?: string;
  date?: Date;
}): DailyReflectionPick {
  const dateKey = localDateKey(options?.date);
  const uid = options?.uid ?? 'anon';
  const seed = `${dateKey}|${uid}|reflection`;
  return {
    dateKey,
    card: pickFromPool(MABRA_REFLECTION_CARDS, seed),
  };
}
