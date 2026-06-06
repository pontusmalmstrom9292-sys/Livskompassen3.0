/**
 * Life Hub presets — exempelprofiler som styr extra material per route (Fas A).
 * Kanon: docs/design/LIFE-OS-KOPPLINGAR-KOMIHAG.md
 */
import { NAV_PATHS } from '@/core/navigation/navTruth';

export type LifeHubPresetId =
  | 'foralder_trygg'
  | 'rehab_lag'
  | 'vardag_arbete'
  | 'minimal';

export type LifeHubMaterialKey =
  | 'home_inkast'
  | 'home_stamp'
  | 'home_adaptive_cards'
  | 'home_snabbval'
  | 'home_hero_checkin'
  | 'planering_routines'
  | 'familjen_hub_hint'
  | 'mabra_hub_hint'
  | 'hamn_hub_hint';

export type LifeHubPreset = {
  id: LifeHubPresetId;
  label: string;
  lead: string;
  materials: Record<LifeHubMaterialKey, boolean>;
};

const ALL_TRUE: Record<LifeHubMaterialKey, boolean> = {
  home_inkast: true,
  home_stamp: false,
  home_adaptive_cards: true,
  home_snabbval: true,
  home_hero_checkin: true,
  planering_routines: true,
  familjen_hub_hint: true,
  mabra_hub_hint: true,
  hamn_hub_hint: true,
};

export const LIFE_HUB_PRESETS: LifeHubPreset[] = [
  {
    id: 'foralder_trygg',
    label: 'Förälder — trygg hamn',
    lead: 'Familjen, Hamn och planering i fokus.',
    materials: {
      ...ALL_TRUE,
      mabra_hub_hint: false,
    },
  },
  {
    id: 'rehab_lag',
    label: 'Rehab — låg stimulus',
    lead: 'MåBra, Kompasser och dagbok — mindre brus.',
    materials: {
      home_inkast: false,
      home_stamp: false,
      home_adaptive_cards: true,
      home_snabbval: true,
      home_hero_checkin: true,
      planering_routines: false,
      familjen_hub_hint: false,
      mabra_hub_hint: true,
      hamn_hub_hint: false,
    },
  },
  {
    id: 'vardag_arbete',
    label: 'Vardag & arbete',
    lead: 'Planering, stämpel och inkast.',
    materials: {
      home_inkast: true,
      home_stamp: false,
      home_adaptive_cards: false,
      home_snabbval: true,
      home_hero_checkin: true,
      planering_routines: true,
      familjen_hub_hint: false,
      mabra_hub_hint: false,
      hamn_hub_hint: false,
    },
  },
  {
    id: 'minimal',
    label: 'Minimal',
    lead: 'Bara det nödvändiga på Hem.',
    materials: {
      home_inkast: false,
      home_stamp: false,
      home_adaptive_cards: false,
      home_snabbval: true,
      home_hero_checkin: true,
      planering_routines: false,
      familjen_hub_hint: false,
      mabra_hub_hint: false,
      hamn_hub_hint: false,
    },
  },
];

export const DEFAULT_LIFE_HUB_PRESET_ID: LifeHubPresetId = 'foralder_trygg';

const PRESET_MAP = new Map(LIFE_HUB_PRESETS.map((p) => [p.id, p]));

export function getLifeHubPreset(id: LifeHubPresetId): LifeHubPreset {
  return PRESET_MAP.get(id) ?? PRESET_MAP.get(DEFAULT_LIFE_HUB_PRESET_ID)!;
}

export function isLifeHubPresetId(raw: string | null | undefined): raw is LifeHubPresetId {
  return raw === 'foralder_trygg' || raw === 'rehab_lag' || raw === 'vardag_arbete' || raw === 'minimal';
}

export function materialEnabled(
  preset: LifeHubPreset,
  key: LifeHubMaterialKey,
): boolean {
  return preset.materials[key] ?? false;
}

/** Filtrera adaptiva kort efter preset (låg stimulus = färre + mjukare mål). */
export function filterAdaptiveCardsForPreset<T extends { id: string; to: string }>(
  cards: T[],
  presetId: LifeHubPresetId,
): T[] {
  if (presetId === 'minimal') return [];
  if (presetId === 'vardag_arbete') {
    return cards.filter((c) => c.to === '/planering' || c.id.includes('task'));
  }
  if (presetId === 'rehab_lag') {
    return cards.filter(
      (c) =>
        c.to === '/mabra' ||
        c.to === NAV_PATHS.HJARTAT ||
        c.to.startsWith('/vardagen'),
    );
  }
  return cards;
}
