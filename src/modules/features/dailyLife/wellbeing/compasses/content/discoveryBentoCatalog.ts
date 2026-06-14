import type { MabraProjectId } from '@/features/dailyLife/wellbeing/mabra/constants/mabraProjects';

export type DiscoveryCategoryId =
  | 'ha_kul'
  | 'lar_ny'
  | 'utveckling'
  | 'varderingar'
  | 'sjalvkansla'
  | 'kropp'
  | 'lek_paus'
  | 'kanslor'
  | 'lugn'
  | 'identitet'
  | 'nar_det_knar'
  | 'min_uppgift';

export type DiscoveryAccent =
  | 'gold'
  | 'amber'
  | 'slate'
  | 'rose-dim'
  | 'sea-dim'
  | 'bronze'
  | 'mist'
  | 'sand'
  | 'pearl'
  | 'copper'
  | 'ash'
  | 'moss';

export type DiscoveryBentoCategory = {
  id: DiscoveryCategoryId;
  label_sv: string;
  lead_sv: string;
  accent: DiscoveryAccent;
  projectId: MabraProjectId;
  bankIds: readonly string[];
};

/** Utvecklings-deck — 12 kategorier, KEEP bankIds (U6). */
export const DISCOVERY_BENTO_CATALOG: readonly DiscoveryBentoCategory[] = [
  {
    id: 'ha_kul',
    label_sv: 'Ha kul',
    lead_sv: 'Kravlös glädje — inget att prestera.',
    accent: 'amber',
    projectId: 'who_am_i',
    bankIds: ['DM-CARD-01', 'C-joy-01', 'C-joy-02', 'MB-REF-JOY-02', 'MB-PLAY-JOY-01'],
  },
  {
    id: 'lar_ny',
    label_sv: 'Lär något nytt',
    lead_sv: 'Ett litet steg i förståelse — inåtvändt.',
    accent: 'slate',
    projectId: 'learn_together',
    bankIds: ['MB-REF-02', 'C-kbt-03', 'DM-CARD-08', 'MB-REF-GEN-01'],
  },
  {
    id: 'utveckling',
    label_sv: 'Personlig utveckling',
    lead_sv: 'Mikromål utan prestation.',
    accent: 'gold',
    projectId: 'self_esteem',
    bankIds: ['C-goal-01', 'C-goal-02', 'MB-REF-ADHD-03', 'C-kbt-01'],
  },
  {
    id: 'varderingar',
    label_sv: 'Dina värderingar',
    lead_sv: 'ACT — vad är viktigt för dig idag?',
    accent: 'bronze',
    projectId: 'who_am_i',
    bankIds: ['MB-REF-ACT-01', 'MB-REF-ACT-02', 'MB-REF-01', 'MB-PLAY-02'],
  },
  {
    id: 'sjalvkansla',
    label_sv: 'Självkänsla',
    lead_sv: 'Styrkor utan att bevisa något.',
    accent: 'rose-dim',
    projectId: 'self_esteem',
    bankIds: ['C-identity-02', 'DM-CARD-04', 'MB-REF-MIRROR-02', 'C-kbt-03'],
  },
  {
    id: 'kropp',
    label_sv: 'Kropp & rörelse',
    lead_sv: 'Kroppen före huvudet — mjukt.',
    accent: 'sea-dim',
    projectId: 'who_am_i',
    bankIds: ['DM-PLAY-02', 'MB-REF-GAD-02', 'MB-PLAY-03', 'MB-REF-06'],
  },
  {
    id: 'lek_paus',
    label_sv: 'Lek & paus',
    lead_sv: 'Microlek — offline, ingen poäng.',
    accent: 'moss',
    projectId: 'emotional_memory',
    bankIds: ['DM-PLAY-01', 'DM-PLAY-03', 'MB-PLAY-01', 'MB-PLAY-05'],
  },
  {
    id: 'kanslor',
    label_sv: 'Känslor',
    lead_sv: 'Namnge utan att fixa.',
    accent: 'copper',
    projectId: 'emotional_memory',
    bankIds: ['C-feel-01', 'C-feel-02', 'DM-CARD-05', 'C-feel-04'],
  },
  {
    id: 'lugn',
    label_sv: 'Lugn & landning',
    lead_sv: 'Pausa nervsystemet — ett andetag.',
    accent: 'mist',
    projectId: 'emotional_memory',
    bankIds: ['MB-REF-GAD-05', 'MB-REF-05', 'C-rsd-02', 'MB-PLAY-03'],
  },
  {
    id: 'identitet',
    label_sv: 'Vem är jag',
    lead_sv: 'Identitet inåt — inte mot någon annan.',
    accent: 'sand',
    projectId: 'who_am_i',
    bankIds: ['C-identity-01', 'C-identity-03', 'DM-CARD-06', 'MB-REF-JOY-01'],
  },
  {
    id: 'nar_det_knar',
    label_sv: 'När det känns hårt',
    lead_sv: 'RSD-säkert — fakta, inte skuld.',
    accent: 'ash',
    projectId: 'self_esteem',
    bankIds: ['C-rsd-01', 'C-rsd-03', 'MB-REF-03', 'MB-REF-ADHD-02'],
  },
  {
    id: 'min_uppgift',
    label_sv: 'Rolig mini-uppgift',
    lead_sv: 'Ett lekfullt steg — max två minuter.',
    accent: 'pearl',
    projectId: 'who_am_i',
    bankIds: ['MB-PLAY-JOY-02', 'MB-PLAY-04', 'MB-PLAY-MIRROR-01', 'DM-PLAY-03'],
  },
] as const;

export const DISCOVERY_CATEGORY_IDS: readonly DiscoveryCategoryId[] =
  DISCOVERY_BENTO_CATALOG.map((c) => c.id);

export function getDiscoveryCategory(id: DiscoveryCategoryId): DiscoveryBentoCategory | undefined {
  return DISCOVERY_BENTO_CATALOG.find((c) => c.id === id);
}

export function isDiscoveryCategoryId(value: string): value is DiscoveryCategoryId {
  return (DISCOVERY_CATEGORY_IDS as readonly string[]).includes(value);
}
