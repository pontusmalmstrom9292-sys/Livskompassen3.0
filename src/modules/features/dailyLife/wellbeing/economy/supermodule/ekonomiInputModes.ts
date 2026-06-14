import type { EconomyCapacityLevel } from './capacityResolver';

/** Canonical input modes — EkonomiInputSuperModule (Fas 8). */
export type EkonomiInputMode =
  | 'saldo'
  | 'mikrosteg'
  | 'profil'
  | 'matprep'
  | 'kuvert'
  | 'spar'
  | 'impuls'
  | 'inkast'
  | 'arbetsliv_bro';

export type EkonomiInputModeMeta = {
  id: EkonomiInputMode;
  label: string;
  description: string;
  tier: 'primary' | 'more';
  minCapacityLevel: EconomyCapacityLevel;
  writesTransactions: boolean;
  writesMutable: boolean;
  navigationOnly: boolean;
};

export const DEFAULT_EKONOMI_INPUT_MODE: EkonomiInputMode = 'saldo';

export const EKONOMI_INPUT_MODES: EkonomiInputModeMeta[] = [
  {
    id: 'saldo',
    label: 'Snabbsaldo',
    description: 'Saldo och snabbtillägg',
    tier: 'primary',
    minCapacityLevel: 'critical',
    writesTransactions: true,
    writesMutable: false,
    navigationOnly: false,
  },
  {
    id: 'mikrosteg',
    label: 'Ett steg',
    description: 'Ett mikrosteg i taget',
    tier: 'primary',
    minCapacityLevel: 1,
    writesTransactions: true,
    writesMutable: false,
    navigationOnly: false,
  },
  {
    id: 'profil',
    label: 'Veckobudget',
    description: 'Budget och matlåda-preset',
    tier: 'primary',
    minCapacityLevel: 2,
    writesTransactions: false,
    writesMutable: true,
    navigationOnly: false,
  },
  {
    id: 'matprep',
    label: 'Neuro-kost',
    description: 'Matprep och checklista',
    tier: 'primary',
    minCapacityLevel: 2,
    writesTransactions: false,
    writesMutable: true,
    navigationOnly: false,
  },
  {
    id: 'kuvert',
    label: 'Kuvert',
    description: 'Budgetkuvert',
    tier: 'more',
    minCapacityLevel: 2,
    writesTransactions: false,
    writesMutable: true,
    navigationOnly: false,
  },
  {
    id: 'spar',
    label: 'Sparmål',
    description: 'Sparande och mål',
    tier: 'more',
    minCapacityLevel: 2,
    writesTransactions: false,
    writesMutable: true,
    navigationOnly: false,
  },
  {
    id: 'impuls',
    label: 'Impulspaus',
    description: 'Pausa impulsköp',
    tier: 'more',
    minCapacityLevel: 3,
    writesTransactions: false,
    writesMutable: true,
    navigationOnly: false,
  },
  {
    id: 'inkast',
    label: 'Inkast',
    description: 'Granska innan spar',
    tier: 'more',
    minCapacityLevel: 3,
    writesTransactions: false,
    writesMutable: false,
    navigationOnly: false,
  },
  {
    id: 'arbetsliv_bro',
    label: 'Arbete & logg',
    description: 'Stämpel och ekonomilogg',
    tier: 'more',
    minCapacityLevel: 3,
    writesTransactions: false,
    writesMutable: false,
    navigationOnly: true,
  },
];

export const EKONOMI_INPUT_MODES_PRIMARY = EKONOMI_INPUT_MODES.filter((m) => m.tier === 'primary');
export const EKONOMI_INPUT_MODES_MORE = EKONOMI_INPUT_MODES.filter((m) => m.tier === 'more');

const ALL_MODE_IDS = new Set<EkonomiInputMode>(EKONOMI_INPUT_MODES.map((m) => m.id));

export function isEkonomiInputMode(value: string | null | undefined): value is EkonomiInputMode {
  if (!value) return false;
  return ALL_MODE_IDS.has(value as EkonomiInputMode);
}

/** Parse URL `inputMode` — unknown values fall back to default. */
export function parseEkonomiInputMode(value: string | null | undefined): EkonomiInputMode {
  if (!value || !isEkonomiInputMode(value)) return DEFAULT_EKONOMI_INPUT_MODE;
  return value;
}

export function getEkonomiInputModeMeta(mode: EkonomiInputMode): EkonomiInputModeMeta {
  return EKONOMI_INPUT_MODES.find((m) => m.id === mode) ?? EKONOMI_INPUT_MODES[0];
}

export function filterModesByAllowed(
  allowed: EkonomiInputMode[],
): { primary: EkonomiInputModeMeta[]; more: EkonomiInputModeMeta[] } {
  const allowedSet = new Set(allowed);
  const visible = EKONOMI_INPUT_MODES.filter((m) => allowedSet.has(m.id));
  return {
    primary: visible.filter((m) => m.tier === 'primary'),
    more: visible.filter((m) => m.tier === 'more'),
  };
}
