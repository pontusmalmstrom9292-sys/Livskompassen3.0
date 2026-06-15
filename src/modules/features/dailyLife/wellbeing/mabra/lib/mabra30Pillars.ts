import type { MabraHubCategory } from '../mabraHubRegistry';

export type Mabra30PillarId =
  | 'k1_personal'
  | 'k2_fitness'
  | 'k3_nutrition'
  | 'k4_education'
  | 'k5_goals'
  | 'k6_explore'
  | 'k7_identity'
  | 'k8_recovery';

export type MabraModulChoice =
  | { kind: 'category'; category: MabraHubCategory }
  | { kind: 'daglig_mix' }
  | {
      kind: 'tool';
      tool: 'goals' | 'education' | 'explore_weekly' | 'self_quiz' | 'recovery';
    }
  | { kind: 'external_route'; path: string };

export type Mabra30Pillar = {
  id: Mabra30PillarId;
  title: string;
  lead: string;
  tone: 'emerald' | 'gold' | 'lavender' | 'indigo';
  choice: MabraModulChoice;
  previewLines: string[];
  /** M3.0-C — pelare utan full backend än */
  disabled?: boolean;
};

/** MåBra 3.0 L0 — åtta pelare (M3.0-B). Wire befintliga routes; Kat 2/3 disabled tills M3.0-C. */
export const MABRA_30_PILLARS: Mabra30Pillar[] = [
  {
    id: 'k1_personal',
    title: 'Personlig utveckling',
    lead: 'Daglig mix — kort och micro-lek utan streak.',
    tone: 'lavender',
    choice: { kind: 'daglig_mix' },
    previewLines: ['Frågekort + micro-lek', '~5 min', 'ingen streak'],
  },
  {
    id: 'k2_fitness',
    title: 'Rörelse & kropp',
    lead: 'Fitness — planeras i M3.0-C.',
    tone: 'emerald',
    choice: { kind: 'category', category: 'akut' },
    previewLines: ['Kommer snart', 'Kapacitetsstyrt'],
    disabled: true,
  },
  {
    id: 'k3_nutrition',
    title: 'Näring & vätska',
    lead: 'Näring — planeras i M3.0-C.',
    tone: 'emerald',
    choice: { kind: 'tool', tool: 'self_quiz' },
    previewLines: ['Kommer snart', 'Ingen kaloriräkning'],
    disabled: true,
  },
  {
    id: 'k4_education',
    title: 'Utbildning',
    lead: 'FACT-kapitel och kopplad övning.',
    tone: 'lavender',
    choice: { kind: 'tool', tool: 'education' },
    previewLines: ['Mikroinlärning', 'Statisk FACT'],
  },
  {
    id: 'k5_goals',
    title: 'Målsättning',
    lead: 'Ett mål i taget — du bekräftar.',
    tone: 'gold',
    choice: { kind: 'tool', tool: 'goals' },
    previewLines: ['Morgonkompass-koppling', 'Bekräfta själv'],
  },
  {
    id: 'k6_explore',
    title: 'Prova nya saker',
    lead: 'Veckoutmaning — låg tröskel, inget XP.',
    tone: 'indigo',
    choice: { kind: 'tool', tool: 'explore_weekly' },
    previewLines: ['Veckoförslag', 'Skip-kö senare'],
  },
  {
    id: 'k7_identity',
    title: 'Kärnidentitet',
    lead: 'Vit — projekt och värderingar, separat från Valv.',
    tone: 'gold',
    choice: { kind: 'category', category: 'projekt' },
    previewLines: ['Självkänsla', 'Vem är jag?'],
  },
  {
    id: 'k8_recovery',
    title: 'Återhämtning',
    lead: 'Recovery-verktyg och drogfrihet.',
    tone: 'emerald',
    choice: { kind: 'tool', tool: 'recovery' },
    previewLines: ['12-steg', 'Dagräknare via Familjen'],
  },
];
