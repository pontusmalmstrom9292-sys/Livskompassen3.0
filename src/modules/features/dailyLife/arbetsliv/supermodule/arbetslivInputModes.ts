/** Canonical input modes — ArbetslivInputSuperModule (Fas 10 / 14A / lönekontor). */
export type ArbetslivInputMode = 'stampla' | 'inkomster' | 'tid' | 'lonest';

export type ArbetslivWriteTarget = 'time_entries' | 'economy_ledger' | 'economy_profiles' | 'read_only';

export type ArbetslivInputModeMeta = {
  id: ArbetslivInputMode;
  label: string;
  description: string;
  tier: 'primary';
  writeTarget: ArbetslivWriteTarget;
  /** Legacy TabBar paritet — `?tab=` på /arbetsliv */
  legacyTab: ArbetslivInputMode | 'logg';
};

export const DEFAULT_ARBETSLIV_INPUT_MODE: ArbetslivInputMode = 'stampla';

export const ARBETSLIV_INPUT_MODES: ArbetslivInputModeMeta[] = [
  {
    id: 'stampla',
    label: 'Stämpel',
    description: 'Stämpla in och ut — flex',
    tier: 'primary',
    writeTarget: 'time_entries',
    legacyTab: 'stampla',
  },
  {
    id: 'lonest',
    label: 'Lönekontor',
    description: 'Lön, avtal, skatt — auto-omräkning',
    tier: 'primary',
    writeTarget: 'economy_profiles',
    legacyTab: 'lonest',
  },
  {
    id: 'inkomster',
    label: 'Inkomster',
    description: 'Lön, FK, omvårdnadsbidrag',
    tier: 'primary',
    writeTarget: 'economy_ledger',
    legacyTab: 'inkomster',
  },
  {
    id: 'tid',
    label: 'Tid & flex',
    description: 'Veckosaldo (read-only)',
    tier: 'primary',
    writeTarget: 'read_only',
    legacyTab: 'tid',
  },
];

export const ARBETSLIV_INPUT_MODES_PRIMARY = ARBETSLIV_INPUT_MODES;

const ALL_MODE_IDS = new Set<ArbetslivInputMode>(ARBETSLIV_INPUT_MODES.map((m) => m.id));

export function isArbetslivInputMode(value: string | null | undefined): value is ArbetslivInputMode {
  if (!value) return false;
  return ALL_MODE_IDS.has(value as ArbetslivInputMode);
}

/** Parse URL `inputMode` — unknown values fall back to default. */
export function parseArbetslivInputMode(value: string | null | undefined): ArbetslivInputMode {
  if (!value || !isArbetslivInputMode(value)) return DEFAULT_ARBETSLIV_INPUT_MODE;
  return value;
}

export function getArbetslivInputModeMeta(mode: ArbetslivInputMode): ArbetslivInputModeMeta {
  return ARBETSLIV_INPUT_MODES.find((m) => m.id === mode) ?? ARBETSLIV_INPUT_MODES[0];
}

/** Map legacy `?tab=` on /arbetsliv to superhub inputMode. */
export function arbetslivTabToInputMode(tab: string | null | undefined): ArbetslivInputMode {
  if (tab === 'tid' || tab === 'inkomster' || tab === 'lonest') return tab;
  return DEFAULT_ARBETSLIV_INPUT_MODE;
}
