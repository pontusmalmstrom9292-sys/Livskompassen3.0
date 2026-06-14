/** Canonical input modes — FamiljenInputSuperModule (Fas 7). */
export type FamiljenInputMode =
  | 'barnfokus'
  | 'livslogg_stund'
  | 'fysiologi'
  | 'livslogg_observation'
  | 'vardagsstruktur'
  | 'inkast';

export type FamiljenInputModeMeta = {
  id: FamiljenInputMode;
  label: string;
  description: string;
  /** Primär växlare vs "Mer…" */
  tier: 'primary' | 'more';
  /** Skriver till children_logs direkt (false = HITL/review only) */
  writesChildrenLogs: boolean;
  /** Erbjuder post-save Valv HITL (SaveAsEvidencePrompt) */
  offersVaultHitl: boolean;
  /** content_class enligt U6 */
  contentClass: 'PLAY' | 'EVIDENCE' | null;
};

export const FAMILJEN_INPUT_MODES: FamiljenInputModeMeta[] = [
  {
    id: 'barnfokus',
    label: 'Barnfokus',
    description: 'Dagens fråga — roligt, knas, lära känna',
    tier: 'primary',
    writesChildrenLogs: true,
    offersVaultHitl: false,
    contentClass: 'PLAY',
  },
  {
    id: 'livslogg_stund',
    label: 'Ny stund',
    description: 'Positiv stund med barnet',
    tier: 'primary',
    writesChildrenLogs: true,
    offersVaultHitl: false,
    contentClass: 'EVIDENCE',
  },
  {
    id: 'fysiologi',
    label: 'Fysiologi',
    description: 'Sömn, ångest, aptit 1–5',
    tier: 'primary',
    writesChildrenLogs: true,
    offersVaultHitl: false,
    contentClass: 'EVIDENCE',
  },
  {
    id: 'livslogg_observation',
    label: 'Livslogg',
    description: 'Neutral observation + valfri påverkan',
    tier: 'primary',
    writesChildrenLogs: true,
    offersVaultHitl: true,
    contentClass: 'EVIDENCE',
  },
  {
    id: 'vardagsstruktur',
    label: 'Vardagsstruktur',
    description: 'Rutin / husregler i praktiken',
    tier: 'primary',
    writesChildrenLogs: true,
    offersVaultHitl: false,
    contentClass: 'EVIDENCE',
  },
  {
    id: 'inkast',
    label: 'Inkast',
    description: 'Granska innan spar till rätt silo',
    tier: 'more',
    writesChildrenLogs: false,
    offersVaultHitl: false,
    contentClass: null,
  },
];

export const FAMILJEN_INPUT_MODES_PRIMARY = FAMILJEN_INPUT_MODES.filter((m) => m.tier === 'primary');
export const FAMILJEN_INPUT_MODES_MORE = FAMILJEN_INPUT_MODES.filter((m) => m.tier === 'more');

/** Fas 7A — router UI exposes barnfokus only until 7B kickoff. */
export const FAMILJEN_INPUT_MODES_FAS7A: FamiljenInputModeMeta[] = FAMILJEN_INPUT_MODES.filter(
  (m) => m.id === 'barnfokus',
);

const ROUTER_VISIBLE_FAS7A = new Set<FamiljenInputMode>(
  FAMILJEN_INPUT_MODES_FAS7A.map((m) => m.id),
);

export const DEFAULT_FAMILJEN_INPUT_MODE: FamiljenInputMode = 'barnfokus';

export function isFamiljenInputMode(value: string | null | undefined): value is FamiljenInputMode {
  if (!value) return false;
  return FAMILJEN_INPUT_MODES.some((m) => m.id === value);
}

export function parseFamiljenInputMode(value: string | null | undefined): FamiljenInputMode {
  if (!value || !isFamiljenInputMode(value)) return DEFAULT_FAMILJEN_INPUT_MODE;
  if (!ROUTER_VISIBLE_FAS7A.has(value)) return DEFAULT_FAMILJEN_INPUT_MODE;
  return value;
}

export function getFamiljenInputModeMeta(mode: FamiljenInputMode): FamiljenInputModeMeta {
  const meta = FAMILJEN_INPUT_MODES.find((m) => m.id === mode);
  if (!meta) {
    // Fallback if somehow invalid
    return FAMILJEN_INPUT_MODES[0];
  }
  return meta;
}
