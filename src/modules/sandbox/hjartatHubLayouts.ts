/** Hjärtat hub-layouter — sandbox (FP-TI-S3). */

export type HjartatHubLayoutId =
  | 'spegel-orbit'
  | 'reflektion-studio'
  | 'minnes-galleri'
  | 'lugn-triad';

export type HjartatHubArchetype = 'lista' | 'grid' | 'fokus';

export type HjartatHubLayout = {
  id: HjartatHubLayoutId;
  label: string;
  archetype: HjartatHubArchetype;
  defaultMode: string;
  lead: string;
  capacityOnly?: boolean;
};

export const HJARTAT_HUB_LAYOUTS: HjartatHubLayout[] = [
  {
    id: 'spegel-orbit',
    label: 'Spegel-orbit',
    archetype: 'fokus',
    defaultMode: 'quick_mirror',
    lead: 'Spegling i centrum — övrigt i djupring',
  },
  {
    id: 'reflektion-studio',
    label: 'Reflektion studio',
    archetype: 'lista',
    defaultMode: 'reflektion',
    lead: 'Steg för steg, låg arousal',
  },
  {
    id: 'minnes-galleri',
    label: 'Minnes-galleri',
    archetype: 'grid',
    defaultMode: 'arkiv',
    lead: 'Taktilt djup på journal-kort',
  },
  {
    id: 'lugn-triad',
    label: 'Lugn triad',
    archetype: 'fokus',
    defaultMode: 'reflektion',
    lead: 'Kapacitet 1 — tre val totalt',
    capacityOnly: true,
  },
];

export function resolveHjartatLayout(
  layoutId: HjartatHubLayoutId,
  lowCapacity: boolean,
): HjartatHubLayout {
  if (lowCapacity) {
    return HJARTAT_HUB_LAYOUTS.find((l) => l.id === 'lugn-triad')!;
  }
  return HJARTAT_HUB_LAYOUTS.find((l) => l.id === layoutId) ?? HJARTAT_HUB_LAYOUTS[1];
}
