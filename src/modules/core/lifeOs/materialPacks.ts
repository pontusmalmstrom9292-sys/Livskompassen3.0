/**
 * MaterialPack (Fas C) — kuraterade genvägar per hub + preset. U6: inga nya FACT/RAG.
 * Kanon: docs/design/LIFE-OS-KOPPLINGAR-KOMIHAG.md
 * Fas 3: lokala overrides via materialPackApi (per användare, localStorage).
 */

import type { LifeHubPresetId } from './lifeHubPresets';
import { materialEnabled, getLifeHubPreset, type LifeHubMaterialKey } from './lifeHubPresets';
import { getMaterialPackOverride } from './materialPackApi';
import type { ModuleLinkTarget } from './moduleLink';

export type MaterialPackHub = 'familjen' | 'mabra' | 'hamn';

export type MaterialShortcut = {
  label: string;
  target: ModuleLinkTarget;
  /** Referens till bank (dokumentation — ingen auto-RAG). */
  bankRef?: string;
};

type PackRow = {
  presetIds: LifeHubPresetId[];
  materialKey: LifeHubMaterialKey;
  hub: MaterialPackHub;
  shortcuts: MaterialShortcut[];
};

const PACK_ROWS: PackRow[] = [
  {
    presetIds: ['foralder_trygg'],
    materialKey: 'familjen_hub_hint',
    hub: 'familjen',
    shortcuts: [
      {
        label: 'Barnfokus',
        target: { module: 'familjen', tab: 'reflektion' },
        bankRef: 'panel:barnfokus',
      },
      {
        label: 'Planering',
        target: { module: 'planering', tab: 'handling' },
      },
      {
        label: 'Projekt',
        target: { module: 'projekt' },
      },
      {
        label: 'Projektregler',
        target: { module: 'projekt', subpath: 'regler' },
      },
    ],
  },
  {
    presetIds: ['rehab_lag'],
    materialKey: 'mabra_hub_hint',
    hub: 'mabra',
    shortcuts: [
      {
        label: 'Andning 4-7-8',
        target: { module: 'mabra' },
        bankRef: 'PLAY:G7',
      },
      {
        label: 'Akut — låg stimulus',
        target: { module: 'mabra', hub: 'panic_rsd' },
        bankRef: 'REFLECTION:C-rsd-01',
      },
      {
        label: 'Dagbok',
        target: { module: 'dagbok', from: 'mabra', energy: 'low' },
      },
    ],
  },
  {
    presetIds: ['foralder_trygg'],
    materialKey: 'hamn_hub_hint',
    hub: 'hamn',
    shortcuts: [
      {
        label: 'BIFF / Grey Rock',
        target: { module: 'hamn', tab: 'biff' },
      },
      {
        label: 'Speglar',
        target: { module: 'dagbok', tab: 'speglar' },
      },
    ],
  },
];

function defaultMaterialShortcuts(
  presetId: LifeHubPresetId,
  hub: MaterialPackHub,
): MaterialShortcut[] {
  const preset = getLifeHubPreset(presetId);
  const row = PACK_ROWS.find(
    (r) => r.hub === hub && r.presetIds.includes(presetId) && materialEnabled(preset, r.materialKey),
  );
  return row?.shortcuts ?? [];
}

/** Standardgenvägar (utan lokala overrides). */
export function getDefaultMaterialShortcuts(
  presetId: LifeHubPresetId,
  hub: MaterialPackHub,
): MaterialShortcut[] {
  return defaultMaterialShortcuts(presetId, hub);
}

/** Genvägar för hub — lokala overrides vinner om sparade. */
export function getMaterialShortcuts(
  presetId: LifeHubPresetId,
  hub: MaterialPackHub,
  userId?: string,
): MaterialShortcut[] {
  const override = getMaterialPackOverride(userId, presetId, hub);
  if (override) return override;
  return defaultMaterialShortcuts(presetId, hub);
}

/** Hubbar som har MaterialPack för given preset (default eller override). */
export function materialPackHubsForPreset(
  presetId: LifeHubPresetId,
  userId?: string,
): MaterialPackHub[] {
  const hubs: MaterialPackHub[] = ['familjen', 'mabra', 'hamn'];
  return hubs.filter((hub) => {
    if (userId && getMaterialPackOverride(userId, presetId, hub)?.length) return true;
    return defaultMaterialShortcuts(presetId, hub).length > 0;
  });
}
