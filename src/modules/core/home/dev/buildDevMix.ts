/**
 * Mix-motor — spontan 6→12–16 DevMixCards.
 * Exkludera completed bankIds; nedvikta mättade källor; inkludera packs + custom.
 * Ingen LLM, ingen RAG.
 */
import { resolveDiscoveryBankCard } from '@/features/dailyLife/wellbeing/compasses/lib/discoveryBankResolver';
import type { MabraProjectId } from '@/features/dailyLife/wellbeing/mabra/constants/mabraProjects';
import type { HomeSignalSnapshot } from './homeSignalSnapshot';
import {
  bankIdsFromUnlockedPacks,
  getContentPack,
  resolveUnlockedPackIds,
} from './contentPackCatalog';
import type { CustomCategory, DevMixCard } from './contentPackTypes';
import {
  DEV_MIX_TARGET_DEFAULT,
  DEV_MIX_TARGET_LOW_CAPACITY,
  DEV_MIX_TARGET_MAX,
} from './contentPackTypes';
import { localDateKey } from './pickDevCard';

function fnv1a(input: string): number {
  let hash = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

type MixCandidate = {
  source: 'pack' | 'custom';
  categoryKey: string;
  packId?: string;
  bankId: string;
  body_sv: string;
  title_sv?: string;
  content_class: 'REFLECTION' | 'PLAY';
  projectId: MabraProjectId;
  weight: number;
};

function excludeSetOf(
  excludeIds: ReadonlySet<string> | readonly string[] | undefined,
): Set<string> {
  if (!excludeIds) return new Set();
  return excludeIds instanceof Set ? excludeIds : new Set(excludeIds);
}

/** Klar-kvot → vikt (clamp 0.15 så källa inte dör förrän exhausted). */
export function saturationWeight(completed: number, total: number): number {
  if (total <= 0) return 0;
  const sat = Math.min(1, Math.max(0, completed / total));
  return Math.max(0.15, 1 - sat);
}

function signalBoost(categoryKey: string, signals: HomeSignalSnapshot): number {
  let boost = 1;
  if (signals.lowCapacity) {
    if (['lugn', 'kropp', 'vila', 'trygghet', 'narvaro'].some((k) => categoryKey.includes(k))) {
      boost += 0.5;
    }
  }
  if (signals.journalExistsToday && categoryKey.includes('sjalvkansla')) boost += 0.2;
  if (signals.presetId === 'foralder_trygg' && categoryKey.includes('relation')) boost += 0.3;
  return boost;
}

function buildPackCandidates(
  hubUnlocked: readonly string[],
  exclude: Set<string>,
  signals: HomeSignalSnapshot,
): MixCandidate[] {
  const unlocked = resolveUnlockedPackIds(hubUnlocked);
  const out: MixCandidate[] = [];

  for (const packId of unlocked) {
    const pack = getContentPack(packId);
    if (!pack || pack.bankIds.length === 0) continue;

    const total = pack.bankIds.length;
    let completed = 0;
    for (const id of pack.bankIds) {
      if (exclude.has(id)) completed += 1;
    }
    const base = saturationWeight(completed, total) * signalBoost(packId, signals);

    for (const bankId of pack.bankIds) {
      if (exclude.has(bankId)) continue;
      const card = resolveDiscoveryBankCard(bankId);
      if (!card) continue;
      const hint = pack.discoveryCategoryHints?.[0] ?? pack.topicTags[0] ?? packId;
      out.push({
        source: 'pack',
        categoryKey: hint,
        packId,
        bankId,
        body_sv: card.body_sv,
        title_sv: card.title_sv ?? pack.title_sv,
        content_class: card.content_class,
        projectId: 'who_am_i',
        weight: base,
      });
    }
  }

  return out;
}

function buildCustomCandidates(
  customs: readonly CustomCategory[],
  exclude: Set<string>,
  signals: HomeSignalSnapshot,
): MixCandidate[] {
  const out: MixCandidate[] = [];

  for (const cat of customs) {
    // Kopplad pack: pool från pack-bankIds
    if (cat.linkedPackId) {
      const pack = getContentPack(cat.linkedPackId);
      if (pack) {
        const total = pack.bankIds.length;
        let completed = 0;
        for (const id of pack.bankIds) {
          if (exclude.has(id)) completed += 1;
        }
        const base =
          saturationWeight(completed, total) * 0.8 * signalBoost(cat.id, signals);
        for (const bankId of pack.bankIds) {
          if (exclude.has(bankId)) continue;
          const card = resolveDiscoveryBankCard(bankId);
          if (!card) continue;
          out.push({
            source: 'custom',
            categoryKey: cat.id,
            packId: pack.id,
            bankId,
            body_sv: card.body_sv,
            title_sv: cat.name_sv,
            content_class: card.content_class,
            projectId: 'learn_together',
            weight: base,
          });
        }
      }
    }

    const total = cat.steps.length;
    let completed = 0;
    for (const step of cat.steps) {
      if (exclude.has(step.bankId)) completed += 1;
    }
    const base = saturationWeight(completed, Math.max(1, total)) * 0.85 * signalBoost(cat.id, signals);

    for (const step of cat.steps) {
      if (exclude.has(step.bankId)) continue;
      const body = step.body_sv.trim();
      if (!body) continue;
      out.push({
        source: 'custom',
        categoryKey: cat.id,
        bankId: step.bankId,
        body_sv: body,
        title_sv: cat.name_sv,
        content_class: 'REFLECTION',
        projectId: 'learn_together',
        weight: base,
      });
    }
  }

  return out;
}

/**
 * Bygg spontan mix. Deterministisk per dag+uid+slot.
 * Undviker duplicate bankIds i samma mix.
 */
export function buildDevMix(options: {
  uid?: string;
  date?: Date;
  hubUnlockedPacks?: readonly string[];
  customCategories?: readonly CustomCategory[];
  excludeIds?: ReadonlySet<string> | readonly string[];
  signals: HomeSignalSnapshot;
  targetCount?: number;
}): DevMixCard[] {
  const dateKey = localDateKey(options.date);
  const uid = options.uid ?? 'anon';
  const exclude = excludeSetOf(options.excludeIds);
  const hubUnlocked = options.hubUnlockedPacks ?? [];
  const customs = options.customCategories ?? [];

  let target =
    options.targetCount ??
    (options.signals.lowCapacity ? DEV_MIX_TARGET_LOW_CAPACITY : DEV_MIX_TARGET_DEFAULT);
  target = Math.min(DEV_MIX_TARGET_MAX, Math.max(1, target));

  const candidates = [
    ...buildPackCandidates(hubUnlocked, exclude, options.signals),
    ...buildCustomCandidates(customs, exclude, options.signals),
  ];

  if (candidates.length === 0) return [];

  // Weighted shuffle via FNV order + weight buckets
  const scored = candidates.map((c, i) => {
    const seed = `${dateKey}|${uid}|dev_mix|${c.bankId}|${i}`;
    const jitter = (fnv1a(seed) % 1000) / 1000;
    return { c, score: c.weight * 10 + jitter };
  });
  scored.sort((a, b) => b.score - a.score);

  const used = new Set<string>();
  const mix: DevMixCard[] = [];

  for (const { c } of scored) {
    if (mix.length >= target) break;
    if (used.has(c.bankId)) continue;
    used.add(c.bankId);
    mix.push({
      slotKey: `${dateKey}_${mix.length}_${c.bankId}`,
      source: c.source,
      categoryKey: c.categoryKey,
      packId: c.packId,
      bankId: c.bankId,
      title_sv: c.title_sv,
      body_sv: c.body_sv,
      content_class: c.content_class,
      projectId: c.projectId,
    });
  }

  return mix;
}

/** Refill en slot efter Klar — ny kandidat som inte finns i currentMix. */
export function refillDevMixSlot(options: {
  uid?: string;
  date?: Date;
  hubUnlockedPacks?: readonly string[];
  customCategories?: readonly CustomCategory[];
  excludeIds?: ReadonlySet<string> | readonly string[];
  signals: HomeSignalSnapshot;
  currentMix: readonly DevMixCard[];
  slotIndex: number;
}): DevMixCard | null {
  const exclude = excludeSetOf(options.excludeIds);
  const present = new Set(options.currentMix.map((m) => m.bankId));
  for (const id of present) exclude.add(id);

  const next = buildDevMix({
    ...options,
    excludeIds: exclude,
    targetCount: 1,
  });
  const card = next[0];
  if (!card) return null;
  return {
    ...card,
    slotKey: options.currentMix[options.slotIndex]?.slotKey ?? card.slotKey,
  };
}

/** Exponerad helper för smoke / tester. */
export function countAvailableBankIds(
  hubUnlocked: readonly string[],
  excludeIds: ReadonlySet<string> | readonly string[],
): number {
  const exclude = excludeSetOf(excludeIds);
  return bankIdsFromUnlockedPacks(hubUnlocked).filter(
    (id) => !exclude.has(id) && Boolean(resolveDiscoveryBankCard(id)),
  ).length;
}
