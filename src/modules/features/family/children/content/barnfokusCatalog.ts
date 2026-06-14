/**
 * Barnfokus — KEEP-rader från Barnen-PLAY-BANK (BP-PLAY-*).
 * Child → FamiljenBarnfokusDelegate; parent → ParentReminderFooter prompt.
 * Ingen Valv-promote, ingen cross-RAG.
 */
export type BarnfokusCatalogLens =
  | 'gladje'
  | 'kunskap'
  | 'knas'
  | 'lara_kanna'
  | 'utveckling'
  | 'valv_safe';

export type BarnfokusCatalogEntry = {
  bankId: string;
  legacy_id: string;
  audience: 'child' | 'parent';
  lens: BarnfokusCatalogLens;
  content_class: 'PLAY';
  source_tier: 'product_copy';
  status: 'KEEP';
  text_sv: string;
  hint_sv?: string;
  /** Kunskap FACT-bro (våg 20 barn_hcf) — deterministisk, ingen RAG i Barnen. */
  knowledgeFactId?: string;
  source?: 'builtin' | 'valv_curated';
};

/** Förälderprompt — BP-PLAY-01..05 (observation om {ChildAlias}). */
export const BARNFOKUS_CATALOG_PARENT: readonly BarnfokusCatalogEntry[] = [
  {
    bankId: 'BP-PLAY-01',
    legacy_id: 'p1',
    audience: 'parent',
    lens: 'gladje',
    content_class: 'PLAY',
    source_tier: 'product_copy',
    status: 'KEEP',
    text_sv: 'Vad var roligast med {ChildAlias} idag — en sak?',
  },
  {
    bankId: 'BP-PLAY-02',
    legacy_id: 'p2',
    audience: 'parent',
    lens: 'knas',
    content_class: 'PLAY',
    source_tier: 'product_copy',
    status: 'KEEP',
    text_sv: 'Berätta ett knasigt ögonblick — kort som en gåta.',
  },
  {
    bankId: 'BP-PLAY-03',
    legacy_id: 'p3',
    audience: 'parent',
    lens: 'lara_kanna',
    content_class: 'PLAY',
    source_tier: 'product_copy',
    status: 'KEEP',
    text_sv: 'En ny sak du lärde dig om {ChildAlias} denna vecka.',
  },
  {
    bankId: 'BP-PLAY-04',
    legacy_id: 'p4',
    audience: 'parent',
    lens: 'utveckling',
    content_class: 'PLAY',
    source_tier: 'product_copy',
    status: 'KEEP',
    text_sv: 'Vad blev {ChildAlias} bättre på — utan betyg?',
  },
  {
    bankId: 'BP-PLAY-05',
    legacy_id: 'p5',
    audience: 'parent',
    lens: 'valv_safe',
    content_class: 'PLAY',
    source_tier: 'product_copy',
    status: 'KEEP',
    text_sv: 'En trygg stund hemma — vad hände?',
  },
  {
    bankId: 'BP-PLAY-22',
    legacy_id: 'p6',
    audience: 'parent',
    lens: 'lara_kanna',
    content_class: 'PLAY',
    source_tier: 'product_copy',
    status: 'KEEP',
    text_sv: 'Fick {ChildAlias} vara barn idag — eller kändes något för tungt?',
    hint_sv: 'Parentification: barn ska inte bära vuxnas ansvar.',
    knowledgeFactId: 'kunskap-fact-bh-002',
  },
  {
    bankId: 'BP-PLAY-23',
    legacy_id: 'p7',
    audience: 'parent',
    lens: 'utveckling',
    content_class: 'PLAY',
    source_tier: 'product_copy',
    status: 'KEEP',
    text_sv: 'Något {ChildAlias} sa som du vill minnas ordagrant — utan tolkning?',
    hint_sv: 'Validera upplevelsen; spara neutralt i Barnen-logg.',
    knowledgeFactId: 'kunskap-fact-bh-003',
  },
  {
    bankId: 'BP-PLAY-24',
    legacy_id: 'p8',
    audience: 'parent',
    lens: 'valv_safe',
    content_class: 'PLAY',
    source_tier: 'product_copy',
    status: 'KEEP',
    text_sv: 'Behövde {ChildAlias} välja sida eller dölja känslor idag?',
    hint_sv: 'Lojalitetsfrihet: det är okej att älska båda föräldrar.',
    knowledgeFactId: 'kunskap-fact-bh-001',
  },
] as const;

/** Barnfrågor — BP-PLAY-06..21 ↔ legacy_id g1..v2 */
export const BARNFOKUS_CATALOG_CHILD: readonly BarnfokusCatalogEntry[] = [
  {
    bankId: 'BP-PLAY-06',
    legacy_id: 'g1',
    audience: 'child',
    lens: 'gladje',
    content_class: 'PLAY',
    source_tier: 'product_copy',
    status: 'KEEP',
    text_sv: 'Vad fick dig att skratta idag?',
  },
  {
    bankId: 'BP-PLAY-07',
    legacy_id: 'g2',
    audience: 'child',
    lens: 'gladje',
    content_class: 'PLAY',
    source_tier: 'product_copy',
    status: 'KEEP',
    text_sv: 'Vad var det bästa med din dag?',
  },
  {
    bankId: 'BP-PLAY-08',
    legacy_id: 'g3',
    audience: 'child',
    lens: 'gladje',
    content_class: 'PLAY',
    source_tier: 'product_copy',
    status: 'KEEP',
    text_sv: 'Vem eller vad var extra rolig idag?',
  },
  {
    bankId: 'BP-PLAY-09',
    legacy_id: 'k1',
    audience: 'child',
    lens: 'kunskap',
    content_class: 'PLAY',
    source_tier: 'product_copy',
    status: 'KEEP',
    text_sv: 'Vet du var regnbågar kommer ifrån?',
    hint_sv: 'Gissa — vi googlar inte i kväll.',
  },
  {
    bankId: 'BP-PLAY-10',
    legacy_id: 'k2',
    audience: 'child',
    lens: 'kunskap',
    content_class: 'PLAY',
    source_tier: 'product_copy',
    status: 'KEEP',
    text_sv: 'Vilket djur tror du sover mest på jorden?',
  },
  {
    bankId: 'BP-PLAY-11',
    legacy_id: 'k3',
    audience: 'child',
    lens: 'kunskap',
    content_class: 'PLAY',
    source_tier: 'product_copy',
    status: 'KEEP',
    text_sv: 'Hur många ben har en spindel? (Gissa!)',
  },
  {
    bankId: 'BP-PLAY-12',
    legacy_id: 'n1',
    audience: 'child',
    lens: 'knas',
    content_class: 'PLAY',
    source_tier: 'product_copy',
    status: 'KEEP',
    text_sv: 'Om du fick en superkraft i kväll — vilken?',
  },
  {
    bankId: 'BP-PLAY-13',
    legacy_id: 'n2',
    audience: 'child',
    lens: 'knas',
    content_class: 'PLAY',
    source_tier: 'product_copy',
    status: 'KEEP',
    text_sv: 'Om dagen var en film — vilken genre?',
  },
  {
    bankId: 'BP-PLAY-14',
    legacy_id: 'n3',
    audience: 'child',
    lens: 'knas',
    content_class: 'PLAY',
    source_tier: 'product_copy',
    status: 'KEEP',
    text_sv: 'Vilket ljud skulle din mage göra om den kunde prata?',
  },
  {
    bankId: 'BP-PLAY-15',
    legacy_id: 'l1',
    audience: 'child',
    lens: 'lara_kanna',
    content_class: 'PLAY',
    source_tier: 'product_copy',
    status: 'KEEP',
    text_sv: 'Vad gör dig stolt (stort eller litet)?',
  },
  {
    bankId: 'BP-PLAY-16',
    legacy_id: 'l2',
    audience: 'child',
    lens: 'lara_kanna',
    content_class: 'PLAY',
    source_tier: 'product_copy',
    status: 'KEEP',
    text_sv: 'Vad vill du göra imorgon som låter kul?',
  },
  {
    bankId: 'BP-PLAY-17',
    legacy_id: 'l3',
    audience: 'child',
    lens: 'lara_kanna',
    content_class: 'PLAY',
    source_tier: 'product_copy',
    status: 'KEEP',
    text_sv: 'Vilket ord eller ljud fastnade i huvudet idag?',
  },
  {
    bankId: 'BP-PLAY-18',
    legacy_id: 'u1',
    audience: 'child',
    lens: 'utveckling',
    content_class: 'PLAY',
    source_tier: 'product_copy',
    status: 'KEEP',
    text_sv: 'Vad vågade du idag som kändes lite svårt?',
  },
  {
    bankId: 'BP-PLAY-19',
    legacy_id: 'u2',
    audience: 'child',
    lens: 'utveckling',
    content_class: 'PLAY',
    source_tier: 'product_copy',
    status: 'KEEP',
    text_sv: 'Vad vill du bli bättre på — och vad är ett litet steg?',
  },
  {
    bankId: 'BP-PLAY-20',
    legacy_id: 'v1',
    audience: 'child',
    lens: 'valv_safe',
    content_class: 'PLAY',
    source_tier: 'product_copy',
    status: 'KEEP',
    text_sv: 'Om du kunde fråga universum en sak — vad?',
    source: 'valv_curated',
  },
  {
    bankId: 'BP-PLAY-21',
    legacy_id: 'v2',
    audience: 'child',
    lens: 'valv_safe',
    content_class: 'PLAY',
    source_tier: 'product_copy',
    status: 'KEEP',
    text_sv: 'Vad är det finaste du sett i naturen?',
    source: 'valv_curated',
  },
] as const;

const CATALOG_BY_LEGACY_ID = new Map(
  BARNFOKUS_CATALOG_CHILD.map((row) => [row.legacy_id, row]),
);

export function barnfokusCatalogEntryForLegacyId(
  legacyId: string,
): BarnfokusCatalogEntry | undefined {
  return CATALOG_BY_LEGACY_ID.get(legacyId);
}

/** Roterande förälderprompt (bank-only UI — ej children_logs). */
export function barnfokusParentPromptForToday(
  childAlias: string,
  date = new Date(),
): BarnfokusCatalogEntry {
  const start = new Date(date.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((date.getTime() - start.getTime()) / 86_400_000);
  const row = BARNFOKUS_CATALOG_PARENT[dayOfYear % BARNFOKUS_CATALOG_PARENT.length]!;
  return {
    ...row,
    text_sv: row.text_sv.replace(/\{ChildAlias\}/g, childAlias),
  };
}
