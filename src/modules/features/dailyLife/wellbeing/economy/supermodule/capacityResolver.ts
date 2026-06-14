import { SAFETY_THRESHOLD } from '@/core/config/constants';
import type { EkonomiInputMode } from './ekonomiInputModes';

export type EconomyCapacityLevel = 'critical' | 1 | 2 | 3;

export type EconomyCapacityContext = {
  level: EconomyCapacityLevel;
  /** Normaliserad 0–1 — från user_capability_state.capacityScore */
  capacityScore: number;
  circuitBreakerActive: boolean;
  economyAdvancedUnlocked: boolean;
  /** Modes tillåtna i lägesväxlare — beräknade, ej hårdkodade i UI */
  allowedModes: EkonomiInputMode[];
  isLoading: boolean;
};

export type EconomyCapacityCapabilityState = {
  economy_advanced?: boolean;
  capacityScore?: number;
} | null;

export type EconomyCapacityEconomyStatus = {
  economy_advanced?: boolean;
} | null;

export type EconomyCheckins48h = {
  count: number;
  averageMoodEnergy: number;
};

export type ResolveEconomyCapacityInput = {
  capabilityState: EconomyCapacityCapabilityState;
  economyStatus: EconomyCapacityEconomyStatus;
  evolutionFlags: readonly string[];
  checkins48h: EconomyCheckins48h;
  isLoading?: boolean;
};

const MODES_LEVEL_1: EkonomiInputMode[] = ['saldo', 'mikrosteg'];
const MODES_LEVEL_2: EkonomiInputMode[] = [...MODES_LEVEL_1, 'profil', 'matprep', 'kuvert', 'spar'];
const MODES_LEVEL_3: EkonomiInputMode[] = [
  ...MODES_LEVEL_2,
  'impuls',
  'inkast',
  'arbetsliv_bro',
];
const MODES_CRITICAL: EkonomiInputMode[] = ['saldo'];

function normalizeCapacityScore(raw: number | undefined): number {
  if (typeof raw !== 'number' || Number.isNaN(raw)) return 0;
  return Math.min(1, Math.max(0, raw));
}

function resolveEconomyAdvancedUnlocked(
  circuitBreakerActive: boolean,
  capabilityState: EconomyCapacityCapabilityState,
  economyStatus: EconomyCapacityEconomyStatus,
  evolutionFlags: readonly string[],
): boolean {
  if (circuitBreakerActive) return false;
  return (
    capabilityState?.economy_advanced === true &&
    economyStatus?.economy_advanced === true &&
    evolutionFlags.includes('economy_advanced')
  );
}

function resolveLevel(
  circuitBreakerActive: boolean,
  economyAdvancedUnlocked: boolean,
  capacityScore: number,
): EconomyCapacityLevel {
  if (circuitBreakerActive) return 'critical';
  if (!economyAdvancedUnlocked) return 1;
  if (capacityScore >= 0.5) return 3;
  return 2;
}

function modesForLevel(level: EconomyCapacityLevel): EkonomiInputMode[] {
  switch (level) {
    case 'critical':
      return MODES_CRITICAL;
    case 1:
      return MODES_LEVEL_1;
    case 2:
      return MODES_LEVEL_2;
    case 3:
      return MODES_LEVEL_3;
    default:
      return MODES_CRITICAL;
  }
}

/**
 * Canonical kapacitetsadapter — §4.3 Ekonomi-INPUT-SUPERHUB-SPEC.
 * Pure function; Firestore lyssnas i routern.
 */
export function resolveEconomyCapacity(input: ResolveEconomyCapacityInput): EconomyCapacityContext {
  const { capabilityState, economyStatus, evolutionFlags, checkins48h, isLoading = false } =
    input;

  const capacityScore = normalizeCapacityScore(capabilityState?.capacityScore);

  const circuitBreakerActive =
    checkins48h.count > 0 && checkins48h.averageMoodEnergy < SAFETY_THRESHOLD;

  const economyAdvancedUnlocked = resolveEconomyAdvancedUnlocked(
    circuitBreakerActive,
    capabilityState,
    economyStatus,
    evolutionFlags,
  );

  const level = resolveLevel(circuitBreakerActive, economyAdvancedUnlocked, capacityScore);
  const allowedModes = modesForLevel(level);

  return {
    level,
    capacityScore,
    circuitBreakerActive,
    economyAdvancedUnlocked,
    allowedModes,
    isLoading,
  };
}

/** Högsta tillåtna mode — fallback vid otillåten URL. */
export function pickFallbackMode(allowedModes: EkonomiInputMode[]): EkonomiInputMode {
  if (allowedModes.includes('saldo')) return 'saldo';
  return allowedModes[0] ?? 'saldo';
}
