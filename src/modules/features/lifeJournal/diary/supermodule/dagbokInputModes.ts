/** Canonical input modes — DagbokInputSuperModule (Fas 11). */
export type DagbokInputMode = 'reflektion' | 'quick_mirror' | 'arkiv' | 'burn';

export type DagbokWriteTarget = 'journal_worm' | 'read_only' | 'none';

export type DagbokInputModeMeta = {
  id: DagbokInputMode;
  label: string;
  description: string;
  tier: 'primary' | 'more';
  writeTarget: DagbokWriteTarget;
  /** Legacy DagbokPage ?mode= paritet */
  legacyDagbokMode: 'reflektera' | 'snabb' | 'arkiv';
  /** Anropar journalQuickMirror efter snabb-spar */
  usesQuickMirror: boolean;
};

export const DEFAULT_DAGBOK_INPUT_MODE: DagbokInputMode = 'reflektion';

export const DAGBOK_INPUT_MODES: DagbokInputModeMeta[] = [
  {
    id: 'reflektion',
    label: 'Reflektera',
    description: 'Steg för steg — humör, text, spara',
    tier: 'primary',
    writeTarget: 'journal_worm',
    legacyDagbokMode: 'reflektera',
    usesQuickMirror: false,
  },
  {
    id: 'quick_mirror',
    label: 'Snabb spegling',
    description: 'Känsla + valfri rad + spegling',
    tier: 'primary',
    writeTarget: 'journal_worm',
    legacyDagbokMode: 'snabb',
    usesQuickMirror: true,
  },
  {
    id: 'arkiv',
    label: 'Minneslista',
    description: 'Läs dina sparade tankar',
    tier: 'primary',
    writeTarget: 'read_only',
    legacyDagbokMode: 'arkiv',
    usesQuickMirror: false,
  },
  {
    id: 'burn',
    label: 'Bränn',
    description: 'Ventilera och förstör (Zero Footprint)',
    tier: 'primary',
    writeTarget: 'none',
    legacyDagbokMode: 'reflektera',
    usesQuickMirror: false,
  },
];

export const DAGBOK_INPUT_MODES_PRIMARY = DAGBOK_INPUT_MODES.filter((m) => m.tier === 'primary');
export const DAGBOK_INPUT_MODES_MORE = DAGBOK_INPUT_MODES.filter((m) => m.tier === 'more');

/** Fas 11C — alla tre lägen synliga i router. */
export const DAGBOK_INPUT_MODES_FAS11C: DagbokInputModeMeta[] = [...DAGBOK_INPUT_MODES];

const ROUTER_VISIBLE_FAS11C = new Set<DagbokInputMode>(
  DAGBOK_INPUT_MODES_FAS11C.map((m) => m.id),
);

export function isDagbokInputMode(value: string | null | undefined): value is DagbokInputMode {
  if (!value) return false;
  return DAGBOK_INPUT_MODES.some((m) => m.id === value);
}

export function parseDagbokInputMode(value: string | null | undefined): DagbokInputMode {
  if (!value || !isDagbokInputMode(value)) return DEFAULT_DAGBOK_INPUT_MODE;
  if (!ROUTER_VISIBLE_FAS11C.has(value)) return DEFAULT_DAGBOK_INPUT_MODE;
  return value;
}

export function getDagbokInputModeMeta(mode: DagbokInputMode): DagbokInputModeMeta {
  const meta = DAGBOK_INPUT_MODES.find((m) => m.id === mode);
  if (!meta) return DAGBOK_INPUT_MODES[0];
  return meta;
}

/** Map legacy `?mode=` on DagbokPage to superhub inputMode. */
export function dagbokLegacyModeToInputMode(mode: string | null | undefined): DagbokInputMode {
  if (mode === 'snabb') return 'quick_mirror';
  if (mode === 'arkiv') return 'arkiv';
  if (mode === 'reflektera') return 'reflektion';
  return DEFAULT_DAGBOK_INPUT_MODE;
}
