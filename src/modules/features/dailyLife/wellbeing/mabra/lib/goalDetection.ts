import type { EvolutionHubDoc } from '@/core/types/firestore';
import type { EconomyCapacityLevel } from '@/features/dailyLife/wellbeing/economy/supermodule/capacityResolver';

/** Minsta antal tecken för att ett fokus ska räknas i detektering. */
export const FOCUS_KEY_MIN_LENGTH = 3;

/** Antal upprepningar på fönsterperiod för goalCandidate. */
export const RECURRENCE_THRESHOLD = 3;

/** Historikfönster (dagar) för recurrence-analys. */
export const FOCUS_HISTORY_WINDOW_DAYS = 14;

/** Signalfönster (dagar) för checkins, sessioner, planering. */
export const SIGNAL_WINDOW_DAYS = 7;

/** Antal låga checkins som sänker confidence. */
export const LOW_MOOD_CHECKIN_THRESHOLD = 3;

/** Minsta andel klara planning_tasks innan förenkling föreslås. */
export const PLANNING_COMPLETION_MIN = 0.3;

/** Minsta antal mabra_sessions per 7d — under detta → mikrosteg. */
export const MABRA_SESSION_MIN_7D = 2;

export type FocusHistoryEntry = {
  date: string;
  points: string[];
};

export type GoalCandidate = {
  text: string;
  focusKey: string;
  count: number;
  firstSeen: string;
  lastSeen: string;
  /** 0–1, regelbaserad — ingen LLM. */
  confidence: number;
  suggestMicroStep: boolean;
};

export type GoalDetectionSignals = {
  focusEntries: FocusHistoryEntry[];
  lowMoodCheckinCount: number;
  mabraSessionCount7d: number;
  planningCompletionRate: number;
  capacityLevel: 1 | 2 | 3;
};

export type GoalDetectionResult = {
  candidates: GoalCandidate[];
  signals: GoalDetectionSignals;
  capacityLevel: 1 | 2 | 3;
  suggestSimplify: boolean;
  suggestMicroStep: boolean;
};

/** Normaliserar fokustext till fingerprint (G3). */
export function normalizeFocusKey(text: string): string | null {
  const normalized = text.trim().toLowerCase().replace(/\s+/g, ' ');
  if (normalized.length < FOCUS_KEY_MIN_LENGTH) return null;
  return normalized;
}

function parseIsoDate(value: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const parsed = new Date(`${value}T12:00:00`);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

/** Filtrerar historikposter inom ett rullande datumfönster. */
export function filterFocusEntriesByWindow(
  entries: FocusHistoryEntry[],
  windowDays: number,
  now = new Date(),
): FocusHistoryEntry[] {
  const cutoff = new Date(now);
  cutoff.setDate(cutoff.getDate() - windowDays);

  return entries.filter((entry) => {
    const entryDate = parseIsoDate(entry.date);
    return entryDate !== null && entryDate >= cutoff;
  });
}

type RecurrenceRow = {
  text: string;
  focusKey: string;
  count: number;
  firstSeen: string;
  lastSeen: string;
};

/** Räknar frekvens per focusKey över historik (G4). */
export function countFocusRecurrence(entries: FocusHistoryEntry[]): RecurrenceRow[] {
  const map = new Map<string, RecurrenceRow>();

  for (const entry of entries) {
    const seenKeysThisDay = new Set<string>();
    for (const raw of entry.points) {
      const focusKey = normalizeFocusKey(raw);
      if (!focusKey || seenKeysThisDay.has(focusKey)) continue;
      seenKeysThisDay.add(focusKey);

      const existing = map.get(focusKey);
      if (!existing) {
        map.set(focusKey, {
          text: raw.trim(),
          focusKey,
          count: 1,
          firstSeen: entry.date,
          lastSeen: entry.date,
        });
        continue;
      }

      existing.count += 1;
      if (entry.date < existing.firstSeen) existing.firstSeen = entry.date;
      if (entry.date > existing.lastSeen) existing.lastSeen = entry.date;
      if (raw.trim().length > existing.text.length) {
        existing.text = raw.trim();
      }
    }
  }

  return [...map.values()].sort((a, b) => b.count - a.count || a.text.localeCompare(b.text, 'sv'));
}

function clampConfidence(value: number): number {
  return Math.min(1, Math.max(0, value));
}

function applySignalAdjustments(
  baseConfidence: number,
  signals: GoalDetectionSignals,
): { confidence: number; suggestMicroStep: boolean } {
  let confidence = baseConfidence;
  let suggestMicroStep = false;

  if (signals.lowMoodCheckinCount >= LOW_MOOD_CHECKIN_THRESHOLD) {
    confidence -= 0.2;
  }
  if (signals.mabraSessionCount7d < MABRA_SESSION_MIN_7D) {
    confidence -= 0.15;
    suggestMicroStep = true;
  }
  if (signals.planningCompletionRate < PLANNING_COMPLETION_MIN) {
    confidence -= 0.1;
  }

  return { confidence: clampConfidence(confidence), suggestMicroStep };
}

/**
 * Kapacitetsnivå (G7): primärt `evolution_hub.pillars.kognitiv.level`,
 * fallback till ekonomi-nivå (1–3).
 */
export function resolveCapacityLevel(
  evolutionDoc: EvolutionHubDoc | null | undefined,
  economyLevel: EconomyCapacityLevel,
): 1 | 2 | 3 {
  const kognitivLevel = evolutionDoc?.pillars?.kognitiv?.level;
  if (typeof kognitivLevel === 'number' && kognitivLevel >= 1 && kognitivLevel <= 3) {
    return kognitivLevel as 1 | 2 | 3;
  }
  if (economyLevel === 'critical' || economyLevel === 1) return 1;
  if (economyLevel === 2) return 2;
  return 3;
}

/**
 * Deterministisk goal-detektering (read-only, ingen LLM).
 * Returnerar goalCandidate[] i RAM — ingen auto-write.
 */
export function detectGoalCandidates(signals: GoalDetectionSignals): GoalDetectionResult {
  const windowed = filterFocusEntriesByWindow(
    signals.focusEntries,
    FOCUS_HISTORY_WINDOW_DAYS,
  );
  const recurrence = countFocusRecurrence(windowed);

  const suggestSimplify = signals.planningCompletionRate < PLANNING_COMPLETION_MIN;
  const suggestMicroStepGlobal =
    signals.mabraSessionCount7d < MABRA_SESSION_MIN_7D || signals.capacityLevel === 1;

  const candidates: GoalCandidate[] = recurrence
    .filter((row) => row.count >= RECURRENCE_THRESHOLD)
    .map((row) => {
      const baseConfidence = Math.min(1, 0.45 + row.count * 0.12);
      const adjusted = applySignalAdjustments(baseConfidence, signals);
      return {
        text: row.text,
        focusKey: row.focusKey,
        count: row.count,
        firstSeen: row.firstSeen,
        lastSeen: row.lastSeen,
        confidence: adjusted.confidence,
        suggestMicroStep: adjusted.suggestMicroStep || suggestMicroStepGlobal,
      };
    });

  const limited =
    signals.capacityLevel === 1 ? candidates.slice(0, 1) : candidates;

  return {
    candidates: limited,
    signals,
    capacityLevel: signals.capacityLevel,
    suggestSimplify,
    suggestMicroStep: suggestMicroStepGlobal,
  };
}
