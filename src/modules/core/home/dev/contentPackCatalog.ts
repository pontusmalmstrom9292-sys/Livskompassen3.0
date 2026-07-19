/**
 * Versionerad content-pack-katalog — KEEP i app-bundle (U6).
 * Öppen ämnesmodell via topicTags (inte låst till rehab-exempel).
 * Ingen runtime-AI, ingen Firestore-encyklopedi.
 */
import { DISCOVERY_BENTO_CATALOG } from '@/features/dailyLife/wellbeing/compasses/content/discoveryBentoCatalog';
import { PACK_EXTRA_BANK_IDS } from './devCategoryBankMap';
import type { ContentPack } from './contentPackTypes';

/** App-build-konstant — jämför mot evolution_hub.contentPackVersions. */
export const CONTENT_PACK_CATALOG_VERSION = 1;

function uniqueBankIds(ids: readonly string[]): string[] {
  return [...new Set(ids.filter(Boolean))];
}

/** P0 = union av Discovery KEEP (nuvarande Utvecklingskort-pool). */
const P0_CORE_BANK_IDS = uniqueBankIds(DISCOVERY_BENTO_CATALOG.flatMap((c) => [...c.bankIds]));

export const CONTENT_PACK_CATALOG: readonly ContentPack[] = [
  {
    id: 'pack_p0_core',
    version: 1,
    title_sv: 'Grundpack — mikrosteg',
    lead_sv: 'Blandade reflektions- och lekkort från MåBra KEEP.',
    topicTags: ['utveckling', 'reflektion', 'lek', 'vardag'],
    tier: 'P0',
    status: 'available',
    defaultUnlocked: true,
    bankIds: P0_CORE_BANK_IDS,
    discoveryCategoryHints: DISCOVERY_BENTO_CATALOG.map((c) => c.id),
  },
  {
    id: 'foralder_trygg',
    version: 1,
    title_sv: 'Förälder trygg',
    lead_sv: 'Extra mikrosteg när förälder-preset är aktivt.',
    topicTags: ['föräldraskap', 'ACT', 'trygghet'],
    tier: 'P0',
    status: 'available',
    bankIds: [...(PACK_EXTRA_BANK_IDS.foralder_trygg ?? [])],
    discoveryCategoryHints: ['varderingar', 'kanslor'],
  },
  {
    id: 'rehab_lag',
    version: 1,
    title_sv: 'Rehab lugn',
    lead_sv: 'Lugna landningskort — låg kapacitet.',
    topicTags: ['återhämtning', 'lugn', 'GAD'],
    tier: 'P0',
    status: 'available',
    bankIds: [...(PACK_EXTRA_BANK_IDS.rehab_lag ?? [])],
    discoveryCategoryHints: ['lugn', 'kropp'],
  },
  {
    id: 'pack_curiosity_seed',
    version: 1,
    title_sv: 'Kuriosa — frö',
    lead_sv: 'Små fakta att lära sig över tid — kommer i app-uppdatering.',
    topicTags: ['kuriosa', 'lära', 'öppet ämne'],
    tier: 'P1',
    status: 'coming',
    bankIds: [],
  },
  {
    id: 'pack_history_lite',
    version: 1,
    title_sv: 'Historia — lätt',
    lead_sv: 'Korta historiska mikrosteg — kommer i app-uppdatering.',
    topicTags: ['historia', 'lära', 'öppet ämne'],
    tier: 'P1',
    status: 'coming',
    bankIds: [],
  },
  {
    id: 'pack_geo_lite',
    version: 1,
    title_sv: 'Geografi — lätt',
    lead_sv: 'Platser och kartor i små steg — kommer i app-uppdatering.',
    topicTags: ['geografi', 'lära', 'öppet ämne'],
    tier: 'P1',
    status: 'coming',
    bankIds: [],
  },
] as const;

export function getContentPack(id: string): ContentPack | undefined {
  return CONTENT_PACK_CATALOG.find((p) => p.id === id);
}

/** Packs som ska räknas som upplåsta utan Hämta (defaultUnlocked). */
export function getDefaultUnlockedPackIds(): string[] {
  return CONTENT_PACK_CATALOG.filter((p) => p.defaultUnlocked).map((p) => p.id);
}

/** Effektiv unlock-lista: default + evolution_hub.unlockedPacks. */
export function resolveUnlockedPackIds(hubUnlocked: readonly string[] = []): string[] {
  return uniqueBankIds([...getDefaultUnlockedPackIds(), ...hubUnlocked]);
}

/** Packs användaren kan hämta (available + inte redan unlockade). */
export function listFetchablePacks(hubUnlocked: readonly string[] = []): ContentPack[] {
  const unlocked = new Set(resolveUnlockedPackIds(hubUnlocked));
  return CONTENT_PACK_CATALOG.filter(
    (p) => p.status === 'available' && !p.defaultUnlocked && !unlocked.has(p.id),
  );
}

/** Coming + redan hämtade (för tom-state / badge). */
export function listComingPacks(): ContentPack[] {
  return CONTENT_PACK_CATALOG.filter((p) => p.status === 'coming');
}

/** Alla bankIds från upplåsta packs. */
export function bankIdsFromUnlockedPacks(hubUnlocked: readonly string[] = []): string[] {
  const unlocked = new Set(resolveUnlockedPackIds(hubUnlocked));
  const ids: string[] = [];
  for (const pack of CONTENT_PACK_CATALOG) {
    if (!unlocked.has(pack.id)) continue;
    ids.push(...pack.bankIds);
  }
  return uniqueBankIds(ids);
}

/** Badge: pack.version nyare än sparad aktiverad version. */
export function packHasNewerVersion(
  pack: ContentPack,
  contentPackVersions: Record<string, number> | undefined,
): boolean {
  if (!contentPackVersions) return false;
  const activated = contentPackVersions[pack.id];
  if (typeof activated !== 'number') return false;
  return pack.version > activated;
}
