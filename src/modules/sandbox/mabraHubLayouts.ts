/** Mabra hub-layouter — sandbox (FP-TI-S4). */

export type MabraHubLayoutId = 'checkin-fokus' | 'kort-grid' | 'reflektion-lista' | 'paralys-panel';

export type MabraHubArchetype = 'lista' | 'grid' | 'fokus';

export type MabraHubLayout = {
  id: MabraHubLayoutId;
  label: string;
  archetype: MabraHubArchetype;
  defaultMode: string;
  lead: string;
  capacityOnly?: boolean;
};

export const MABRA_HUB_LAYOUTS: MabraHubLayout[] = [
  {
    id: 'checkin-fokus',
    label: 'Check-in fokus',
    archetype: 'fokus',
    defaultMode: 'checkin',
    lead: 'Ett mikrosteg — humör och energi',
  },
  {
    id: 'kort-grid',
    label: 'Kort-grid',
    archetype: 'grid',
    defaultMode: 'vit_card',
    lead: 'Frågekort och reflektion i rutnät',
  },
  {
    id: 'reflektion-lista',
    label: 'Reflektion lista',
    archetype: 'lista',
    defaultMode: 'reflection_tool',
    lead: 'Vertikal lista — låg arousal',
  },
  {
    id: 'paralys-panel',
    label: 'Paralys-panel',
    archetype: 'fokus',
    defaultMode: 'checkin',
    lead: 'Låg kapacitet — ett steg i taget',
    capacityOnly: true,
  },
];

export function resolveMabraLayout(
  layoutId: MabraHubLayoutId,
  lowCapacity: boolean,
): MabraHubLayout {
  if (lowCapacity) {
    return MABRA_HUB_LAYOUTS.find((l) => l.id === 'paralys-panel')!;
  }
  return MABRA_HUB_LAYOUTS.find((l) => l.id === layoutId) ?? MABRA_HUB_LAYOUTS[0];
}
