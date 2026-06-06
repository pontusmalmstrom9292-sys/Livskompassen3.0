import type { MabraProjectId } from '../constants/mabraProjects';
import { MABRA_REFLECTION_CARDS } from '../content/mabraReflectionCards';
import { SELF_ESTEEM_CARDS, type SelfEsteemCard } from '../content/selfEsteemCards';

export type VitProjectCard = {
  bankId: string;
  lens: string;
  text_sv: string;
  content_class: 'REFLECTION';
};

export type VitProjectCardPick = {
  dateKey: string;
  projectId: MabraProjectId;
  card: VitProjectCard;
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

function toVitProjectCard(card: SelfEsteemCard | (typeof MABRA_REFLECTION_CARDS)[number]): VitProjectCard {
  return {
    bankId: card.bankId,
    lens: card.lens,
    text_sv: card.text_sv,
    content_class: 'REFLECTION',
  };
}

function poolForProject(projectId: MabraProjectId): readonly VitProjectCard[] {
  if (projectId === 'self_esteem') {
    return SELF_ESTEEM_CARDS.map(toVitProjectCard);
  }
  return MABRA_REFLECTION_CARDS.map(toVitProjectCard);
}

/**
 * Deterministiskt frågekort per projekt och dag — samma kort hela dagen.
 * Ingen streak, ingen Kunskap-RAG; bankId från Mabra-CONTENT-BANK.
 */
export function pickVitProjectCard(options: {
  projectId: MabraProjectId;
  uid?: string;
  date?: Date;
}): VitProjectCardPick {
  const dateKey = localDateKey(options.date);
  const uid = options.uid ?? 'anon';
  const seed = `${dateKey}|${uid}|${options.projectId}|vit_card`;
  const pool = poolForProject(options.projectId);
  return {
    dateKey,
    projectId: options.projectId,
    card: pickFromPool(pool, seed),
  };
}
