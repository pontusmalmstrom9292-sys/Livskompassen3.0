import { addDoc, collection, getDocs, query, serverTimestamp, where } from 'firebase/firestore';
import { db } from './firestore';
import { assertOfflineWriteAllowed } from './offlineWritePolicy';
import { FIRESTORE_COLLECTIONS } from '../types/firestore';
import type { DiscoveryCategoryId } from '@/features/dailyLife/wellbeing/compasses/content/discoveryBentoCatalog';
import type { EvolutionHubDoc, EvolutionPillar } from '../types/firestore';

export type EvolutionLedgerType =
  | 'milestone_unlocked'
  | 'capacity_increased'
  | 'child_age_milestone'
  | 'pillar_rebalance';

const MILESTONE_CACHE_PREFIX = 'lk:discovery_milestone:';

function milestoneCacheKey(userId: string, categoryId: DiscoveryCategoryId): string {
  return `${MILESTONE_CACHE_PREFIX}${userId}:${categoryId}`;
}

function readMilestoneCache(userId: string, categoryId: DiscoveryCategoryId): boolean {
  if (typeof localStorage === 'undefined') return false;
  return localStorage.getItem(milestoneCacheKey(userId, categoryId)) === '1';
}

function writeMilestoneCache(userId: string, categoryId: DiscoveryCategoryId): void {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(milestoneCacheKey(userId, categoryId), '1');
}

async function hasDiscoveryMilestoneInLedger(
  userId: string,
  categoryId: DiscoveryCategoryId,
): Promise<boolean> {
  const ref = collection(db, FIRESTORE_COLLECTIONS.evolution_ledger);
  const snap = await getDocs(query(ref, where('ownerId', '==', userId)));
  return snap.docs.some((docSnap) => {
    const data = docSnap.data();
    const meta = data.metadata;
    if (!meta || typeof meta !== 'object') return false;
    return (
      meta.source === 'kompass_discovery' &&
      meta.categoryId === categoryId
    );
  });
}

/** Append-only milestone — första spar per deck-kategori. Ingen streak/XP. */
export async function recordDiscoveryMilestoneIfNew(
  userId: string,
  categoryId: DiscoveryCategoryId,
  firstBankId: string,
): Promise<boolean> {
  if (readMilestoneCache(userId, categoryId)) return false;

  assertOfflineWriteAllowed(FIRESTORE_COLLECTIONS.evolution_ledger);

  const exists = await hasDiscoveryMilestoneInLedger(userId, categoryId);
  if (exists) {
    writeMilestoneCache(userId, categoryId);
    return false;
  }

  const ref = collection(db, FIRESTORE_COLLECTIONS.evolution_ledger);
  await addDoc(ref, {
    userId,
    ownerId: userId,
    createdAt: serverTimestamp(),
    type: 'milestone_unlocked' satisfies EvolutionLedgerType,
    pillar: 'kognitiv' satisfies EvolutionPillar,
    levelBefore: 0,
    levelAfter: 1,
    rationale: 'Första sparade reflektion i kompass-deck',
    metadata: {
      source: 'kompass_discovery',
      categoryId,
      firstBankId,
    },
  });

  writeMilestoneCache(userId, categoryId);
  return true;
}

type LedgerWriteInput = {
  userId: string;
  type: EvolutionLedgerType;
  pillar: EvolutionPillar;
  levelBefore: number;
  levelAfter: number;
  rationale: string;
  metadata: Record<string, unknown>;
};

async function appendEvolutionLedgerEntry(input: LedgerWriteInput): Promise<void> {
  assertOfflineWriteAllowed(FIRESTORE_COLLECTIONS.evolution_ledger);
  const ref = collection(db, FIRESTORE_COLLECTIONS.evolution_ledger);
  await addDoc(ref, {
    userId: input.userId,
    ownerId: input.userId,
    createdAt: serverTimestamp(),
    type: input.type,
    pillar: input.pillar,
    levelBefore: input.levelBefore,
    levelAfter: input.levelAfter,
    rationale: input.rationale,
    metadata: input.metadata,
  });
}

const HUB_PILLAR_KEYS = ['kognitiv', 'emotionell', 'vardag', 'relationell', 'valv'] as const satisfies readonly EvolutionPillar[];

/** Dual-write när evolution_hub pillar-nivå ökar. */
export async function recordPillarCapacityIncreases(
  userId: string,
  prev: EvolutionHubDoc | null,
  next: EvolutionHubDoc,
): Promise<void> {
  if (!prev?.pillars) return;
  for (const pillar of HUB_PILLAR_KEYS) {
    const before = prev.pillars[pillar]?.level ?? 0;
    const after = next.pillars[pillar]?.level ?? 0;
    if (after > before) {
      await appendEvolutionLedgerEntry({
        userId,
        type: 'capacity_increased',
        pillar,
        levelBefore: before,
        levelAfter: after,
        rationale: `Kapacitet ökad i pelare ${pillar}`,
        metadata: { source: 'evolution_hub', pillar },
      });
    }
  }
}

/** Dual-write när ny feature-flag låses upp i evolution_hub. */
export async function recordFeatureUnlocks(
  userId: string,
  prev: EvolutionHubDoc | null,
  next: EvolutionHubDoc,
): Promise<void> {
  const before = new Set(prev?.unlockedFeatureFlags ?? []);
  const after = next.unlockedFeatureFlags ?? [];
  for (const flag of after) {
    if (before.has(flag)) continue;
    await appendEvolutionLedgerEntry({
      userId,
      type: 'milestone_unlocked',
      pillar: 'system',
      levelBefore: before.size,
      levelAfter: after.length,
      rationale: `Feature-flag upplåst: ${flag}`,
      metadata: { source: 'evolution_hub', flag },
    });
  }
}

/** Dual-write vid barnets ålderssegment-byte. */
export async function recordChildAgeMilestones(
  userId: string,
  prev: EvolutionHubDoc | null,
  next: EvolutionHubDoc,
): Promise<void> {
  const prevChildren = prev?.childrenAgeState;
  const nextChildren = next.childrenAgeState;
  if (!prevChildren || !nextChildren) return;
  for (const alias of Object.keys(nextChildren) as Array<keyof typeof nextChildren>) {
    const before = prevChildren[alias]?.currentBracket;
    const after = nextChildren[alias]?.currentBracket;
    if (!after || before === after) continue;
    await appendEvolutionLedgerEntry({
      userId,
      type: 'child_age_milestone',
      pillar: 'relationell',
      levelBefore: 0,
      levelAfter: 1,
      rationale: `Barn ${alias} byte till segment ${after}`,
      metadata: { source: 'evolution_hub', childAlias: alias, bracket: after },
    });
  }
}

/** Jämför prev/next evolution_hub och append-only logga förändringar. */
export async function syncEvolutionHubToLedger(
  userId: string,
  prev: EvolutionHubDoc | null,
  next: EvolutionHubDoc,
): Promise<void> {
  await recordPillarCapacityIncreases(userId, prev, next);
  await recordFeatureUnlocks(userId, prev, next);
  await recordChildAgeMilestones(userId, prev, next);
}
