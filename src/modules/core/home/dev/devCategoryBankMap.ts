/**
 * Bridge: HemV3 kategori-skal → Discovery KEEP-pool (U6).
 * Ingen AI-författning; bankIds från DISCOVERY_BENTO_CATALOG.
 */
import {
  getDiscoveryCategory,
  type DiscoveryCategoryId,
} from '@/features/dailyLife/wellbeing/compasses/content/discoveryBentoCatalog';
import {
  HEM_V3_DEVELOPMENT_CARDS,
  type HemV3DevCard,
} from '../hemV3DevelopmentCards';
import type { MabraProjectId } from '@/features/dailyLife/wellbeing/mabra/constants/mabraProjects';

/** HemV3 id → Discovery category (vit_entries.categoryId måste vara Discovery-id). */
export const HEM_V3_TO_DISCOVERY: Readonly<Record<string, DiscoveryCategoryId>> = {
  sjalvkansla: 'sjalvkansla',
  trygghet: 'lugn',
  narvaro: 'kropp',
  granser: 'nar_det_knar',
  rsd: 'nar_det_knar',
  vila: 'lugn',
  'lar-dig': 'lar_ny',
  quiz: 'utveckling',
  'prova-nytt': 'ha_kul',
  kropp: 'kropp',
  relation: 'kanslor',
  logistik: 'min_uppgift',
};

/** Extra bankIds när unlockedPacks innehåller pack-id (Fas 5 hooks). */
export const PACK_EXTRA_BANK_IDS: Readonly<Record<string, readonly string[]>> = {
  foralder_trygg: ['MB-REF-ACT-01', 'MB-REF-ACT-02', 'C-feel-04'],
  rehab_lag: ['MB-REF-GAD-05', 'MB-REF-05', 'C-rsd-02'],
};

export type DevCategoryResolved = HemV3DevCard & {
  discoveryCategoryId: DiscoveryCategoryId;
  projectId: MabraProjectId;
  bankIds: readonly string[];
};

export function resolveDevCategory(
  card: HemV3DevCard,
  unlockedPacks: readonly string[] = [],
): DevCategoryResolved | null {
  const discoveryCategoryId = HEM_V3_TO_DISCOVERY[card.id];
  if (!discoveryCategoryId) return null;
  const discovery = getDiscoveryCategory(discoveryCategoryId);
  if (!discovery) return null;

  const extra: string[] = [];
  for (const pack of unlockedPacks) {
    const ids = PACK_EXTRA_BANK_IDS[pack];
    if (ids) extra.push(...ids);
  }

  const bankIds = [...new Set([...discovery.bankIds, ...extra])];
  return {
    ...card,
    discoveryCategoryId,
    projectId: discovery.projectId,
    bankIds,
  };
}

export function resolveAllDevCategories(
  unlockedPacks: readonly string[] = [],
): DevCategoryResolved[] {
  const out: DevCategoryResolved[] = [];
  for (const card of HEM_V3_DEVELOPMENT_CARDS) {
    const resolved = resolveDevCategory(card, unlockedPacks);
    if (resolved) out.push(resolved);
  }
  return out;
}
