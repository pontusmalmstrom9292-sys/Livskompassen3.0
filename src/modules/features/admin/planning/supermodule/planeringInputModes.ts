/** Canonical input modes — PlaneringInputSuperModule (Fas 9). */
export type PlaneringInputMode = 'task_quick' | 'inkast' | 'quick_list';

export type PlaneringInputModeMeta = {
  id: PlaneringInputMode;
  label: string;
  description: string;
  /** Primär växlare vs "Mer…" */
  tier: 'primary' | 'more';
  /** Skriver till planning_tasks via usePlanningTasks */
  writesPlanningTasks: boolean;
  /** Skriver till localStorage quick lists */
  writesLocalStorage: boolean;
  /** G10 HITL — ingen direkt Firestore från delegate */
  hitlCapture: boolean;
};

export const PLANERING_INPUT_MODES: PlaneringInputModeMeta[] = [
  {
    id: 'task_quick',
    label: 'Snabb uppgift',
    description: 'Lägg till i Att göra eller Väntar',
    tier: 'primary',
    writesPlanningTasks: true,
    writesLocalStorage: false,
    hitlCapture: false,
  },
  {
    id: 'inkast',
    label: 'Smart inkast',
    description: 'Granska innan spar (G10)',
    tier: 'primary',
    writesPlanningTasks: false,
    writesLocalStorage: false,
    hitlCapture: true,
  },
  {
    id: 'quick_list',
    label: 'Inköpslista',
    description: 'Lokal lista — ej Firestore',
    tier: 'primary',
    writesPlanningTasks: false,
    writesLocalStorage: true,
    hitlCapture: false,
  },
];

export const PLANERING_INPUT_MODES_PRIMARY = PLANERING_INPUT_MODES.filter((m) => m.tier === 'primary');
export const PLANERING_INPUT_MODES_MORE = PLANERING_INPUT_MODES.filter((m) => m.tier === 'more');

/** Fas 9C — alla tre lägen synliga i router. */
export const PLANERING_INPUT_MODES_FAS9C: PlaneringInputModeMeta[] = [...PLANERING_INPUT_MODES];

const ROUTER_VISIBLE_FAS9C = new Set<PlaneringInputMode>(
  PLANERING_INPUT_MODES_FAS9C.map((m) => m.id),
);

export const DEFAULT_PLANERING_INPUT_MODE: PlaneringInputMode = 'task_quick';

export function isPlaneringInputMode(value: string | null | undefined): value is PlaneringInputMode {
  if (!value) return false;
  return PLANERING_INPUT_MODES.some((m) => m.id === value);
}

export function parsePlaneringInputMode(value: string | null | undefined): PlaneringInputMode {
  if (!value || !isPlaneringInputMode(value)) return DEFAULT_PLANERING_INPUT_MODE;
  if (!ROUTER_VISIBLE_FAS9C.has(value)) return DEFAULT_PLANERING_INPUT_MODE;
  return value;
}

export function getPlaneringInputModeMeta(mode: PlaneringInputMode): PlaneringInputModeMeta {
  const meta = PLANERING_INPUT_MODES.find((m) => m.id === mode);
  if (!meta) return PLANERING_INPUT_MODES[0];
  return meta;
}
