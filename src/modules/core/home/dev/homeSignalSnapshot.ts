/**
 * Lokal signal-whitelist för Utvecklingskort-rankning.
 * Forbidden: journal-/Valv-råtext, Kunskap-RAG, children_logs-RAG.
 */
import type { EvolutionHubDoc } from '@/core/types/firestore';
import type { LifeHubPresetId } from '@/core/lifeOs/lifeHubPresets';
import { getHomeCognitiveLevel, isLowHomeCapacity } from '../homeCapacityGate';

export type HomeSignalSnapshot = {
  presetId: LifeHubPresetId;
  lowCapacity: boolean;
  kognitivLevel: number;
  capacityScore: number | null;
  journalExistsToday: boolean;
  compassOptionsToday: string[];
  kasamOverall?: number;
  childBracket?: string;
  unlockedPacks: string[];
};

export type CheckInLike = {
  optionSelected?: string;
  createdAt?: Date | { toDate?: () => Date } | string | number | null;
};

function toDate(value: CheckInLike['createdAt']): Date | null {
  if (!value) return null;
  if (value instanceof Date) return value;
  if (typeof value === 'object' && typeof value.toDate === 'function') {
    try {
      return value.toDate();
    } catch {
      return null;
    }
  }
  if (typeof value === 'string' || typeof value === 'number') {
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? null : d;
  }
  return null;
}

function isSameLocalDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function buildHomeSignalSnapshot(input: {
  presetId: LifeHubPresetId;
  evolutionDoc: EvolutionHubDoc | null;
  capacityScore: number;
  journalExistsToday: boolean;
  checkInsToday?: readonly CheckInLike[];
  kasamOverall?: number;
  childBracket?: string;
}): HomeSignalSnapshot {
  const kognitivLevel = getHomeCognitiveLevel(input.evolutionDoc);
  const lowCapacity = isLowHomeCapacity(input.evolutionDoc, input.capacityScore);
  const compassOptionsToday = (input.checkInsToday ?? [])
    .map((c) => (typeof c.optionSelected === 'string' ? c.optionSelected : ''))
    .filter(Boolean);

  return {
    presetId: input.presetId,
    lowCapacity,
    kognitivLevel,
    capacityScore: input.capacityScore,
    journalExistsToday: input.journalExistsToday,
    compassOptionsToday,
    kasamOverall: input.kasamOverall,
    childBracket: input.childBracket,
    unlockedPacks: input.evolutionDoc?.unlockedPacks ?? [],
  };
}

/** Filtrera check-ins till dagens lokala datum. */
export function filterCheckInsToday<T extends CheckInLike>(
  checkIns: readonly T[],
  now = new Date(),
): T[] {
  return checkIns.filter((c) => {
    const d = toDate(c.createdAt);
    return d ? isSameLocalDay(d, now) : false;
  });
}
