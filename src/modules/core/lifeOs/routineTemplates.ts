import type { LifeHubPresetId } from './lifeHubPresets';
import type { ModuleLinkTarget } from './moduleLink';

export type RoutineTaskStep = {
  kind: 'task';
  title: string;
  summary?: string;
};

export type RoutineNavigateStep = {
  kind: 'navigate';
  label: string;
  target: ModuleLinkTarget;
};

export type RoutineStep = RoutineTaskStep | RoutineNavigateStep;

export type RoutineTemplate = {
  id: string;
  title: string;
  lead: string;
  /** Tom = visas för alla presets. */
  presetIds?: LifeHubPresetId[];
  steps: RoutineStep[];
};

export const ROUTINE_TEMPLATES: RoutineTemplate[] = [
  {
    id: 'kvall_foralder',
    title: 'Kväll — förälder',
    lead: 'Ett steg i Familjen, sedan lugn andning.',
    presetIds: ['foralder_trygg'],
    steps: [
      { kind: 'task', title: 'Kväll — barn/minnesrad', summary: 'Från Life OS-rutin' },
      {
        kind: 'navigate',
        label: 'Barnfokus',
        target: { module: 'familjen', tab: 'reflektion' },
      },
      {
        kind: 'navigate',
        label: '4-7-8 andning',
        target: { module: 'mabra' },
      },
    ],
  },
  {
    id: 'morgon_rehab',
    title: 'Morgon — låg stimulus',
    lead: 'Kompass, sedan MåBra. Inget måste bli klart.',
    presetIds: ['rehab_lag'],
    steps: [
      {
        kind: 'navigate',
        label: 'Morgonkompass',
        target: { module: 'kompasser' },
      },
      {
        kind: 'navigate',
        label: 'MåBra',
        target: { module: 'mabra' },
      },
      {
        kind: 'navigate',
        label: 'Dagbok (valfritt humör)',
        target: { module: 'dagbok', from: 'mabra', energy: 'low' },
      },
    ],
  },
  {
    id: 'vardag_handling',
    title: 'Vardag — ett handlingsteg',
    lead: 'Skapar uppgift i kanban och öppnar Handling.',
    presetIds: ['vardag_arbete', 'foralder_trygg', 'minimal'],
    steps: [
      { kind: 'task', title: 'Dagens ett steg', summary: 'Life OS-rutin' },
      {
        kind: 'navigate',
        label: 'Handling',
        target: { module: 'planering', tab: 'handling' },
      },
    ],
  },
];

export function routinesForPreset(presetId: LifeHubPresetId): RoutineTemplate[] {
  return ROUTINE_TEMPLATES.filter(
    (r) => !r.presetIds || r.presetIds.length === 0 || r.presetIds.includes(presetId),
  );
}
