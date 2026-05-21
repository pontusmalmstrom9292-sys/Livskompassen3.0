import type { VaultEntryType } from '../types/vaultEntry';

export const BODY_SIGNALS = [
  'Tung över axlarna',
  'Klump i magen',
  'Svårt att andas',
] as const;

export const VAULT_ENTRY_MODES: { id: VaultEntryType; label: string }[] = [
  { id: 'simple', label: 'Enkel' },
  { id: 'two_column', label: 'Tvåspalt' },
  { id: 'three_shield', label: 'Tresteg' },
  { id: 'body_signal', label: 'Magkänsel' },
];

export const SHIELD_STEPS = [
  { key: 'what', label: 'Vad händer?', placeholder: 'Objektivt, utan tolkning...' },
  { key: 'feeling', label: 'Vad känner jag?', placeholder: 'Kroppsligt eller emotionellt...' },
  { key: 'boundary', label: 'Hur vill jag att det ska vara?', placeholder: 'Gräns eller önskat tillstånd...' },
] as const;
