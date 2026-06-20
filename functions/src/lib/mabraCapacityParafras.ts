import * as admin from 'firebase-admin';
import type { CoachTone } from '../../../shared/adaptation/adaptationTypes';
import { capacityScoreToScale10 } from '../../../shared/evolution/capacityScore';
import {
  parafraseCoachFromBank,
  type MabraCoachBankEntry,
  type MabraCoachExercise,
  type MabraCoachHub,
} from './mabraContentBank';

export type CapacityBand = 'low' | 'mid' | 'high';

const DEFAULT_CAPACITY_SCORE = 5;

/** Normalisera till 0–10 (0–1 kanon, legacy 0–10 eller 0–100). */
export function normalizeCapacityScore(raw: number | undefined): number {
  return capacityScoreToScale10(raw);
}

export function toCapacityBand(score: number): CapacityBand {
  const n = normalizeCapacityScore(score);
  if (n < 4) return 'low';
  if (n < 7) return 'mid';
  return 'high';
}

export async function fetchUserCapacityScore(uid: string): Promise<number> {
  try {
    const snap = await admin.firestore().collection('user_capability_state').doc(uid).get();
    if (!snap.exists) return DEFAULT_CAPACITY_SCORE;
    const data = snap.data();
    return normalizeCapacityScore(
      typeof data?.capacityScore === 'number' ? data.capacityScore : undefined,
    );
  } catch (err) {
    console.warn('[P4] fetchUserCapacityScore fallback:', err);
    return DEFAULT_CAPACITY_SCORE;
  }
}

function firstSentence(text: string): string {
  const match = text.match(/^[^.!?]+[.!?]?/);
  const sentence = match?.[0]?.trim() ?? text.trim();
  return sentence.endsWith('.') || sentence.endsWith('!') || sentence.endsWith('?')
    ? sentence
    : `${sentence}.`;
}

export type CapacityAwareCoachResult = {
  coach: string;
  capacityBand: CapacityBand;
  microSteps?: string[];
  coachToneApplied?: CoachTone;
};

/**
 * P4 — deterministisk capacity-aware parafras (ingen LLM).
 * low: kort coach + mikrosteg; mid/high: standard bank_parafras.
 */
export function parafraseCoachFromBankWithCapacity(
  entry: MabraCoachBankEntry,
  band: CapacityBand,
  hubSymptom?: MabraCoachHub,
  exerciseType?: MabraCoachExercise,
  coachTone: CoachTone = 'standard',
): CapacityAwareCoachResult {
  const toneForBand: CoachTone =
    band === 'low' && coachTone === 'detailed' ? 'standard' : coachTone;

  if (band !== 'low') {
    return {
      coach: parafraseCoachFromBank(entry, hubSymptom, exerciseType, toneForBand),
      capacityBand: band,
      ...(coachTone !== 'standard' ? { coachToneApplied: coachTone } : {}),
    };
  }

  const full = parafraseCoachFromBank(entry, hubSymptom, exerciseType, toneForBand);
  const core = firstSentence(entry.text_sv);
  const ackLine = full.split('.')[0]?.trim() ?? 'Ett steg i taget.';
  const microSteps = [ackLine.endsWith('.') ? ackLine : `${ackLine}.`, core, 'Inget mer krävs nu.'];
  const coach =
    toneForBand === 'minimal'
      ? `${ackLine} ${core} Klart.`
      : `${ackLine} ${core} Inget mer krävs av dig just nu.`;

  return {
    coach,
    capacityBand: band,
    microSteps,
    ...(coachTone !== 'standard' ? { coachToneApplied: coachTone } : {}),
  };
}
