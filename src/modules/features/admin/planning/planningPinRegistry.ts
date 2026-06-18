import { CHILD_ALIASES } from '@/features/family/children/constants';

/** Var i appen modulen visas. */
export type PlaneringPinTargetId =
  | 'hem.brass.below-grid'
  | 'familjen.barnfokus'
  | 'familjen.livslogg'
  | 'familjen.hamn'
  | 'valv.logga'
  | 'valv.kunskapsbank'
  | 'vardagen.ekonomi'
  | 'hjartat.dagbok'
  | 'mabra.hub';

export type PlaneringPinLayoutId = 'elongated' | 'tile' | 'card' | 'compact';

export type PlaneringPinContextKind = 'child' | false;

export type PlaneringPinTargetDef = {
  id: PlaneringPinTargetId;
  group: string;
  label: string;
  lead: string;
  contextKind: PlaneringPinContextKind;
};

export const PLANNING_PIN_TARGETS: PlaneringPinTargetDef[] = [
  {
    id: 'hem.brass.below-grid',
    group: 'Hem',
    label: 'Under rutnätet',
    lead: 'Stor ankare-layout — under steg och snabbstart.',
    contextKind: false,
  },
  {
    id: 'familjen.barnfokus',
    group: 'Familjen',
    label: 'Under Barnfokus',
    lead: 'Visas under dagens fråga — välj barn.',
    contextKind: 'child',
  },
  {
    id: 'familjen.livslogg',
    group: 'Familjen',
    label: 'Livslogg',
    lead: 'Under barnobservationer.',
    contextKind: false,
  },
  {
    id: 'familjen.hamn',
    group: 'Familjen',
    label: 'Trygg Hamn',
    lead: 'BIFF-zonen — kort stöd vid sidan av.',
    contextKind: false,
  },
  {
    id: 'valv.logga',
    group: 'Valvet',
    label: 'Arkiv / logga',
    lead: 'Under bevis och tidslinje.',
    contextKind: false,
  },
  {
    id: 'valv.kunskapsbank',
    group: 'Valvet',
    label: 'Kunskapsbank',
    lead: 'Bredvid fakta och seed.',
    contextKind: false,
  },
  {
    id: 'vardagen.ekonomi',
    group: 'Vardagen',
    label: 'Ekonomi',
    lead: 'Översikt eller budget-flik.',
    contextKind: false,
  },
  {
    id: 'hjartat.dagbok',
    group: 'Hjärtat',
    label: 'Dagbok',
    lead: 'Reflektion och dagbok.',
    contextKind: false,
  },
  {
    id: 'mabra.hub',
    group: 'MåBra',
    label: 'MåBra-start',
    lead: 'Under verktygsväljaren.',
    contextKind: false,
  },
];

export const PLANNING_PIN_LAYOUTS: {
  id: PlaneringPinLayoutId;
  label: string;
  lead: string;
}[] = [
  { id: 'elongated', label: 'Avlång', lead: 'Som Hamn/MåBra — en rad, expandera.' },
  { id: 'tile', label: 'Fyrkant', lead: 'Kompakt kort i rutnät.' },
  { id: 'card', label: 'Större kort', lead: 'Mer yta för text och lista.' },
  { id: 'compact', label: 'Smal remsa', lead: 'Horisontell punktlista.' },
];

export const PLANNING_PIN_CHILD_OPTIONS = [...CHILD_ALIASES];

export function getPlaneringPinTarget(id: string): PlaneringPinTargetDef | undefined {
  return PLANNING_PIN_TARGETS.find((t) => t.id === id);
}

export function planeringPinTargetLabel(
  targetId: string,
  contextKey?: string,
): string {
  const def = getPlaneringPinTarget(targetId);
  if (!def) return targetId;
  if (contextKey) return `${def.label} · ${contextKey}`;
  return def.label;
}
