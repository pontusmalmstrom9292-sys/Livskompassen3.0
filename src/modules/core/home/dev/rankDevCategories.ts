/**
 * Lokal ranker — ordnar kategorier inom tillåten pool (preset + low-capacity hard gates).
 */
import type { HemV3DevCard } from '../hemV3DevelopmentCards';
import type { HomeSignalSnapshot } from './homeSignalSnapshot';

const BOOST: Record<string, string[]> = {
  // check-in option → category ids
  Trött: ['narvaro', 'vila', 'kropp'],
  Spänd: ['narvaro', 'vila', 'kropp'],
  Orolig: ['rsd', 'trygghet'],
  Stabil: ['sjalvkansla', 'lar-dig'],
  'Inget — vila': ['vila', 'trygghet'],
  'Andning 2 min': ['narvaro', 'kropp'],
  'En uppgift': ['logistik', 'quiz'],
};

/**
 * Returnerar samma kort, omordnade (högre score först). Muterar inte original.
 */
export function rankDevCategories<T extends HemV3DevCard>(
  cards: readonly T[],
  signals: HomeSignalSnapshot,
): T[] {
  const scores = new Map<string, number>();
  for (const card of cards) {
    scores.set(card.id, 0);
  }

  for (const option of signals.compassOptionsToday) {
    const boostIds = BOOST[option];
    if (!boostIds) continue;
    for (const id of boostIds) {
      scores.set(id, (scores.get(id) ?? 0) + 3);
    }
  }

  if (signals.journalExistsToday) {
    scores.set('sjalvkansla', (scores.get('sjalvkansla') ?? 0) + 1);
  } else if (signals.kognitivLevel >= 2) {
    scores.set('trygghet', (scores.get('trygghet') ?? 0) + 1);
  }

  if (typeof signals.kasamOverall === 'number' && signals.kasamOverall < 55) {
    scores.set('sjalvkansla', (scores.get('sjalvkansla') ?? 0) + 2);
    scores.set('rsd', (scores.get('rsd') ?? 0) + 1);
  }

  if (signals.presetId === 'foralder_trygg' && signals.childBracket) {
    scores.set('relation', (scores.get('relation') ?? 0) + 2);
    scores.set('prova-nytt', (scores.get('prova-nytt') ?? 0) + 1);
  }

  if (signals.lowCapacity) {
    for (const id of ['narvaro', 'vila', 'kropp', 'trygghet']) {
      scores.set(id, (scores.get(id) ?? 0) + 5);
    }
  }

  return [...cards].sort((a, b) => (scores.get(b.id) ?? 0) - (scores.get(a.id) ?? 0));
}
