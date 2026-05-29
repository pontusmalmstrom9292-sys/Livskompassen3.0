import type { ModuleLinkTarget } from './moduleLink';

export type MaterialTargetPreset = {
  label: string;
  target: ModuleLinkTarget;
};

/** Fördefinierade mål i MaterialPack-editorn — inga nya moduler utan kod. */
export const MATERIAL_TARGET_PRESETS: MaterialTargetPreset[] = [
  { label: 'Barnfokus (Familjen)', target: { module: 'familjen', tab: 'reflektion' } },
  { label: 'Familjen · loggar', target: { module: 'familjen', tab: 'loggar' } },
  { label: 'Planering · Handling', target: { module: 'planering', tab: 'handling' } },
  { label: 'Planering · Fokus', target: { module: 'planering', tab: 'fokus' } },
  { label: 'Planering · Inkorg', target: { module: 'planering', tab: 'inkorg' } },
  { label: 'Projekt', target: { module: 'projekt' } },
  { label: 'Projekt · ny', target: { module: 'projekt', subpath: 'ny' } },
  { label: 'Projektregler', target: { module: 'projekt', subpath: 'regler' } },
  { label: 'MåBra', target: { module: 'mabra' } },
  { label: 'MåBra · akut', target: { module: 'mabra', hub: 'panic_rsd' } },
  { label: 'Dagbok', target: { module: 'dagbok' } },
  { label: 'Dagbok · Speglar', target: { module: 'dagbok', tab: 'speglar' } },
  { label: 'Dagbok · låg energi', target: { module: 'dagbok', from: 'mabra', energy: 'low' } },
  { label: 'Hamn · BIFF', target: { module: 'hamn', tab: 'biff' } },
  { label: 'Kompasser', target: { module: 'kompasser' } },
  { label: 'Hem', target: { module: 'hem' } },
];

export function targetToKey(target: ModuleLinkTarget): string {
  return JSON.stringify(target);
}

export function findTargetPreset(target: ModuleLinkTarget): MaterialTargetPreset | undefined {
  const key = targetToKey(target);
  return MATERIAL_TARGET_PRESETS.find((p) => targetToKey(p.target) === key);
}

export function defaultTargetPreset(): MaterialTargetPreset {
  return MATERIAL_TARGET_PRESETS[0]!;
}
