/** Familjen hub-layouter — sandbox (FP-TI-S5). */

export type FamiljenHubLayoutId = 'barnfokus-fokus' | 'livslogg-grid' | 'hamn-kompakt';

export type FamiljenHubArchetype = 'lista' | 'grid' | 'fokus';

export type FamiljenHubLayout = {
  id: FamiljenHubLayoutId;
  label: string;
  archetype: FamiljenHubArchetype;
  defaultMode: string;
  lead: string;
};

export const FAMILIEN_HUB_LAYOUTS: FamiljenHubLayout[] = [
  {
    id: 'barnfokus-fokus',
    label: 'Barnfokus',
    archetype: 'fokus',
    defaultMode: 'barnfokus',
    lead: 'Dagens fråga — mitt i zonen',
  },
  {
    id: 'livslogg-grid',
    label: 'Livslogg grid',
    archetype: 'grid',
    defaultMode: 'livslogg_stund',
    lead: 'Stunder och observationer i rutnät',
  },
  {
    id: 'hamn-kompakt',
    label: 'Hamn kompakt',
    archetype: 'lista',
    defaultMode: 'inkast',
    lead: 'BIFF/Grey Rock — affärsmässig ton',
  },
];
