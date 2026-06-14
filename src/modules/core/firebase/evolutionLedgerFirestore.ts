import { addDoc, collection, getDocs, query, serverTimestamp, where } from 'firebase/firestore';
import { db } from './firestore';
import { assertOfflineWriteAllowed } from './offlineWritePolicy';
import { FIRESTORE_COLLECTIONS } from '../types/firestore';
import type { DiscoveryCategoryId } from '@/features/dailyLife/wellbeing/compasses/content/discoveryBentoCatalog';

export type EvolutionLedgerType =
  | 'milestone_unlocked'
  | 'capacity_increased'
  | 'child_age_milestone'
  | 'pillar_rebalance';

export type EvolutionPillar =
  | 'kognitiv'
  | 'emotionell'
  | 'vardag'
  | 'relationell'
  | 'valv'
  | 'system';

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
