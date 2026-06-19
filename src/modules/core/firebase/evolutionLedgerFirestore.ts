import { getFunctions, httpsCallable } from 'firebase/functions';
import { app } from './init';
import type { DiscoveryCategoryId } from '@/features/dailyLife/wellbeing/compasses/content/discoveryBentoCatalog';
import type { EvolutionHubDoc } from '../types/firestore';

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

/** Append-only milestone — server-only via recordDiscoveryMilestone callable (P0.1). */
export async function recordDiscoveryMilestoneIfNew(
  userId: string,
  categoryId: DiscoveryCategoryId,
  firstBankId: string,
): Promise<boolean> {
  if (readMilestoneCache(userId, categoryId)) return false;

  const fn = httpsCallable<
    { categoryId: string; firstBankId: string },
    { recorded: boolean }
  >(getFunctions(app, 'europe-west1'), 'recordDiscoveryMilestone');

  const result = await fn({ categoryId, firstBankId });
  if (result.data.recorded) {
    writeMilestoneCache(userId, categoryId);
  }
  return result.data.recorded;
}

/** Server-only — client dual-write borttagen (P2.4). */
export async function syncEvolutionHubToLedger(
  _userId: string,
  _prev: EvolutionHubDoc | null,
  _next: EvolutionHubDoc,
): Promise<void> {
  /* no-op: onEvolutionHubWrite + Admin SDK */
}

export async function recordPillarCapacityIncreases(
  userId: string,
  prev: EvolutionHubDoc | null,
  next: EvolutionHubDoc,
): Promise<void> {
  await syncEvolutionHubToLedger(userId, prev, next);
}

export async function recordFeatureUnlocks(
  userId: string,
  prev: EvolutionHubDoc | null,
  next: EvolutionHubDoc,
): Promise<void> {
  await syncEvolutionHubToLedger(userId, prev, next);
}

export async function recordChildAgeMilestones(
  userId: string,
  prev: EvolutionHubDoc | null,
  next: EvolutionHubDoc,
): Promise<void> {
  await syncEvolutionHubToLedger(userId, prev, next);
}

export async function recordBarnportenLevelIncrease(
  userId: string,
  prev: EvolutionHubDoc | null,
  next: EvolutionHubDoc,
): Promise<void> {
  await syncEvolutionHubToLedger(userId, prev, next);
}

export async function recordUnlockedPackChanges(
  userId: string,
  prev: EvolutionHubDoc | null,
  next: EvolutionHubDoc,
): Promise<void> {
  await syncEvolutionHubToLedger(userId, prev, next);
}

/** Kanonisk merge-skrivning till evolution_hub (ledger via server trigger). */
export async function mergeEvolutionHub(
  userId: string,
  patch: Record<string, unknown>,
): Promise<void> {
  const { doc, setDoc } = await import('firebase/firestore');
  const { db } = await import('./firestore');
  const { FIRESTORE_COLLECTIONS } = await import('../types/firestore');
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
