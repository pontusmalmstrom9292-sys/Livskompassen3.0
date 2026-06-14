import type { MabraProjectId } from '../constants/mabraProjects';

/** Canonical input modes for MabraInputSuperModule (full union — Fas 6A exposes subset). */
export type MabraInputMode =
  | 'checkin'
  | 'vit_card'
  | 'vit_chat'
  | 'vit_memory'
  | 'emotional_memory'
  | 'reflection_tool'
  | 'exercise_note'
  | 'dagbok_bridge'
  | 'inkast';

export type MabraInputModeMeta = {
  id: MabraInputMode;
  label: string;
  description: string;
  requiresProjectId?: boolean;
  defaultProjectId?: MabraProjectId;
};

/** All modes — used for URL parsing and future phases. */
export const MABRA_INPUT_MODES: MabraInputModeMeta[] = [
  { id: 'checkin', label: 'Check-in', description: 'Humör och energi' },
  {
    id: 'emotional_memory',
    label: 'Känslominne',
    description: 'Spara hur det kändes',
    requiresProjectId: true,
    defaultProjectId: 'emotional_memory',
  },
  {
    id: 'vit_card',
    label: 'Frågekort',
    description: 'Vit reflektion',
    requiresProjectId: true,
    defaultProjectId: 'self_esteem',
  },
  {
    id: 'vit_chat',
    label: 'Lär tillsammans',
    description: 'Chatt med coach',
    requiresProjectId: true,
    defaultProjectId: 'learn_together',
  },
  {
    id: 'vit_memory',
    label: 'Känslominne (Vit)',
    description: 'Vit-minnesanteckning',
    requiresProjectId: true,
    defaultProjectId: 'self_esteem',
  },
  { id: 'reflection_tool', label: 'Reflektion', description: 'Reflektionskort' },
  { id: 'exercise_note', label: 'Anteckning', description: 'Efter övning' },
  { id: 'dagbok_bridge', label: 'Spara till dagbok', description: 'Bro till Hjärtat' },
  { id: 'inkast', label: 'Inkast', description: 'Granska innan spar' },
];

/** Fas 6A — first three modes (superseded by FAS6B for router UI). */
export const MABRA_INPUT_MODES_FAS6A: MabraInputModeMeta[] = MABRA_INPUT_MODES.filter((mode) =>
  (['checkin', 'emotional_memory', 'vit_card'] as MabraInputMode[]).includes(mode.id),
);

/** Fas 6B — check-in + alla vit_* + känslominne WORM (max 5 synliga, ingen Mer… än). */
export const MABRA_INPUT_MODES_FAS6B: MabraInputModeMeta[] = MABRA_INPUT_MODES.filter((mode) =>
  (['checkin', 'emotional_memory', 'vit_card', 'vit_chat', 'vit_memory'] as MabraInputMode[]).includes(
    mode.id,
  ),
);

/** Fas 6B — primära lägen (max 5 synliga i växlaren). */
export const MABRA_INPUT_MODES_PRIMARY: MabraInputModeMeta[] = MABRA_INPUT_MODES_FAS6B;

/** Fas 6C — RAM/localStorage-lägen under "Mer…". */
export const MABRA_INPUT_MODES_MORE: MabraInputModeMeta[] = MABRA_INPUT_MODES.filter((mode) =>
  (['reflection_tool', 'exercise_note'] as MabraInputMode[]).includes(mode.id),
);

/** Fas 6D — dagbok-bro + inkast (HITL) under "Mer…". */
export const MABRA_INPUT_MODES_FAS6D: MabraInputModeMeta[] = MABRA_INPUT_MODES.filter((mode) =>
  (['dagbok_bridge', 'inkast'] as MabraInputMode[]).includes(mode.id),
);

/** All "Mer…" lägen (6C + 6D). */
export const MABRA_INPUT_MODES_MORE_ALL: MabraInputModeMeta[] = [
  ...MABRA_INPUT_MODES_MORE,
  ...MABRA_INPUT_MODES_FAS6D,
];

export const DEFAULT_MABRA_INPUT_MODE: MabraInputMode = 'checkin';

const ROUTER_VISIBLE_MODE_IDS = new Set<MabraInputMode>([
  ...MABRA_INPUT_MODES_PRIMARY.map((m) => m.id),
  ...MABRA_INPUT_MODES_MORE_ALL.map((m) => m.id),
]);

export const VIT_INPUT_MODES: MabraInputMode[] = ['vit_card', 'vit_chat', 'vit_memory'];

export function isMabraInputMode(value: string | null | undefined): value is MabraInputMode {
  if (!value) return false;
  return MABRA_INPUT_MODES.some((mode) => mode.id === value);
}

/** Parse URL `inputMode` — unknown or future-phase modes fall back to default. */
export function parseMabraInputMode(value: string | null | undefined): MabraInputMode {
  if (!value || !isMabraInputMode(value)) return DEFAULT_MABRA_INPUT_MODE;
  if (!ROUTER_VISIBLE_MODE_IDS.has(value)) return DEFAULT_MABRA_INPUT_MODE;
  return value;
}

/**
 * D1 — `emotional_memory`-projekt använder WORM-samlingen `emotional_memory`,
 * inte `vit_entries.kind=memory`.
 */
export function shouldUseEmotionalMemoryDelegate(
  mode: MabraInputMode,
  projectId: MabraProjectId | undefined,
): boolean {
  if (mode === 'emotional_memory') return true;
  if (mode === 'vit_memory' && projectId === 'emotional_memory') return true;
  return false;
}

export function resolveProjectIdForMode(
  mode: MabraInputMode,
  projectId?: MabraProjectId,
): MabraProjectId | undefined {
  const meta = MABRA_INPUT_MODES.find((m) => m.id === mode);
  if (!meta?.requiresProjectId) return undefined;
  return projectId ?? meta.defaultProjectId;
}

export function getMabraInputModeMeta(mode: MabraInputMode): MabraInputModeMeta {
  return MABRA_INPUT_MODES.find((m) => m.id === mode) ?? MABRA_INPUT_MODES[0];
}
