import { addDoc, collection, doc, getDocs, query, serverTimestamp, setDoc, where } from 'firebase/firestore';
import { db } from './firestore';
import { assertOfflineWriteAllowed } from './offlineWritePolicy';
import { FIRESTORE_COLLECTIONS } from '../types/firestore';
import type { DiscoveryCategoryId } from '@/features/dailyLife/wellbeing/compasses/content/discoveryBentoCatalog';
import type { EvolutionHubDoc, EvolutionPillar } from '../types/firestore';
import {
  collectLedgerEntriesFromHubDiff,
  ledgerEntryDedupKey,
  ledgerEntryDedupKeyFromStored,
  type EvolutionLedgerType,
} from '../../../../shared/evolution/evolutionHubLedgerSync';

export type { EvolutionLedgerType };

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

async function loadExistingDedupKeys(userId: string): Promise<Set<string>> {
  const ref = collection(db, FIRESTORE_COLLECTIONS.evolution_ledger);
  const snap = await getDocs(query(ref, where('ownerId', '==', userId)));
  const keys = new Set<string>();
  snap.docs.forEach((docSnap) => {
    keys.add(ledgerEntryDedupKeyFromStored(docSnap.data() as Record<string, unknown>));
  });
  return keys;
}

async function appendEvolutionLedgerEntry(
  input: Parameters<typeof ledgerEntryDedupKey>[0] & { userId: string; rationale: string },
  existingKeys: Set<string>,
): Promise<void> {
  const key = ledgerEntryDedupKey(input);
  if (existingKeys.has(key)) return;

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
  existingKeys.add(key);
}

/** Dual-write när evolution_hub pillar-nivå ökar. */
export async function recordPillarCapacityIncreases(
  userId: string,
  prev: EvolutionHubDoc | null,
  next: EvolutionHubDoc,
): Promise<void> {
  await syncEvolutionHubToLedger(userId, prev, next);
}

/** Dual-write när ny feature-flag låses upp i evolution_hub. */
export async function recordFeatureUnlocks(
  userId: string,
  prev: EvolutionHubDoc | null,
  next: EvolutionHubDoc,
): Promise<void> {
  await syncEvolutionHubToLedger(userId, prev, next);
}

/** Dual-write vid barnets ålderssegment-byte. */
export async function recordChildAgeMilestones(
  userId: string,
  prev: EvolutionHubDoc | null,
  next: EvolutionHubDoc,
): Promise<void> {
  await syncEvolutionHubToLedger(userId, prev, next);
}

/** Dual-write när barnportenLevel (root) ökar. */
export async function recordBarnportenLevelIncrease(
  userId: string,
  prev: EvolutionHubDoc | null,
  next: EvolutionHubDoc,
): Promise<void> {
  await syncEvolutionHubToLedger(userId, prev, next);
}

/** Dual-write när nytt material-pack låses upp. */
export async function recordUnlockedPackChanges(
  userId: string,
  prev: EvolutionHubDoc | null,
  next: EvolutionHubDoc,
): Promise<void> {
  await syncEvolutionHubToLedger(userId, prev, next);
}

/** Jämför prev/next evolution_hub och append-only logga förändringar. */
export async function syncEvolutionHubToLedger(
  userId: string,
  prev: EvolutionHubDoc | null,
  next: EvolutionHubDoc,
): Promise<void> {
  if (!prev) return;
  const entries = collectLedgerEntriesFromHubDiff(userId, prev, next);
  if (entries.length === 0) return;

  const existingKeys = await loadExistingDedupKeys(userId);
  for (const entry of entries) {
    await appendEvolutionLedgerEntry(entry, existingKeys);
  }
}

/**
 * Kanonisk merge-skrivning till evolution_hub.
 * Dual-write: client (useEvolutionSync) + server (`onEvolutionHubWrite`) med dedup.
 */
export async function mergeEvolutionHub(
  userId: string,
  patch: Record<string, unknown>,
): Promise<void> {
  const hubRef = doc(db, FIRESTORE_COLLECTIONS.evolution_hub, userId);
  await setDoc(
    hubRef,
    {
      ...patch,
      userId,
      ownerId: userId,
      updatedAt: new Date().toISOString(),
    },
    { merge: true },
  );
}
