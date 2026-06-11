/**
 * Barnfokus — KEEP-rader från Barnen-PLAY-BANK (BP-PLAY-*).
 * Child audience only; ingen Valv-promote, ingen cross-RAG.
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
  source?: 'builtin' | 'valv_curated';
};

/** Fas 6 wire — BP-PLAY-06..10 ↔ legacy_id g1, g2, k1, k2, n1 */
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
    bankId: 'BP-PLAY-09',
    legacy_id: 'k2',
    audience: 'child',
    lens: 'kunskap',
    content_class: 'PLAY',
    source_tier: 'product_copy',
    status: 'KEEP',
    text_sv: 'Vilket djur tror du sover mest på jorden?',
  },
  {
    bankId: 'BP-PLAY-10',
    legacy_id: 'n1',
    audience: 'child',
    lens: 'knas',
    content_class: 'PLAY',
    source_tier: 'product_copy',
    status: 'KEEP',
    text_sv: 'Om du fick en superkraft i kväll — vilken?',
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
