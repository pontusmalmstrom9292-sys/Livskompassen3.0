import type { EkonomiInputMode } from './ekonomiInputModes';

export type EconomyCapacityLevel = 'critical' | 1 | 2 | 3;

const MODES_LEVEL_1: EkonomiInputMode[] = ['saldo', 'mikrosteg'];
const MODES_LEVEL_2: EkonomiInputMode[] = [...MODES_LEVEL_1, 'profil', 'matprep', 'kuvert', 'spar'];
const MODES_LEVEL_3: EkonomiInputMode[] = [
  ...MODES_LEVEL_2,
  'impuls',
  'inkast',
  'arbetsliv_bro',
];
const MODES_CRITICAL: EkonomiInputMode[] = ['saldo'];

/** Tillåtna input-modes per kapacitetsnivå — nivå beräknas i useEconomyLevel. */
export function getAllowedModesForLevel(level: EconomyCapacityLevel): EkonomiInputMode[] {
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

/** Högsta tillåtna mode — fallback vid otillåten URL. */
export function pickFallbackMode(allowedModes: EkonomiInputMode[]): EkonomiInputMode {
  if (allowedModes.includes('saldo')) return 'saldo';
  return allowedModes[0] ?? 'saldo';
}
