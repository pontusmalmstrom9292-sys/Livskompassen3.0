import { MABRA_EXTENDED_PLAYS } from './mabraExtendedPlays';

export type ExploreKategori =
  | 'budget_low'
  | 'social_safe'
  | 'solo'
  | 'energy_low'
  | 'play'
  | 'micro';

export type ExploreFilter = 'budget_low' | 'social_safe' | 'solo' | 'energy_low';

export type ExploreTaskMeta = {
  /** Firestore-safe id — MB-PLAY-* eller explore-* */
  id: string;
  titel: string;
  kategori: ExploreKategori;
  budgetgrans: number;
  isSocial: boolean;
  rule_sv: string;
};

/** G*-bankIds → explore-* (firestore.rules regex). */
export function toExploreTaskId(bankId: string): string {
  if (/^MB-PLAY-[A-Z0-9-]+$/.test(bankId)) return bankId;
  const slug = bankId.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  return `explore-${slug}`;
}

const KATEGORI_BY_BANK: Record<string, ExploreKategori> = {
  'G2-kropp-bingo': 'solo',
  'G3-varde-idag': 'solo',
  'G4-milt-svar': 'energy_low',
  'G5-ljud-jakt': 'energy_low',
  'G6-gladje-mini': 'solo',
  'G7-andning-runda': 'energy_low',
  'MB-PLAY-05': 'budget_low',
  'MB-PLAY-06': 'budget_low',
  'MB-PLAY-GAD-01': 'energy_low',
  'MB-PLAY-08': 'solo',
  'MB-PLAY-JOY-01': 'solo',
  'MB-PLAY-JOY-02': 'budget_low',
  'MB-PLAY-MIRROR-01': 'solo',
  'MB-PLAY-MIRROR-02': 'solo',
};

const BUDGET_BY_KATEGORI: Record<ExploreKategori, number> = {
  budget_low: 0,
  energy_low: 0,
  solo: 1,
  social_safe: 2,
  play: 1,
  micro: 1,
};

const SOCIAL_BANK_IDS = new Set<string>([
  'MB-PLAY-JOY-01',
  'MB-PLAY-MIRROR-02',
  'G6-gladje-mini',
]);

function resolveKategori(bankId: string): ExploreKategori {
  return KATEGORI_BY_BANK[bankId] ?? 'play';
}

/** Kuraterad pool — deterministisk rotation, ingen LLM. */
export const EXPLORE_TASK_POOL: readonly ExploreTaskMeta[] = MABRA_EXTENDED_PLAYS.map((play) => {
  const kategori = resolveKategori(play.bankId);
  return {
    id: toExploreTaskId(play.bankId),
    titel: play.title_sv,
    kategori,
    budgetgrans: BUDGET_BY_KATEGORI[kategori],
    isSocial: SOCIAL_BANK_IDS.has(play.bankId),
    rule_sv: play.rule_sv,
  };
});
