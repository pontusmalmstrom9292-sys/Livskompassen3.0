import { doc, getDoc, serverTimestamp, setDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/modules/core/firebase/firestore';
import { assertOfflineWriteAllowed } from '@/modules/core/firebase/offlineWritePolicy';
import { FIRESTORE_COLLECTIONS } from '@/modules/core/types/firestore';
import type { ExploreQueueTask } from '../lib/exploreTaskPicker';

export type MabraExploreQueueDoc = {
  userId: string;
  ownerId: string;
  availableTasks: ExploreQueueTask[];
  completedTasks: string[];
  lastGenerated: Timestamp;
  updatedAt: Timestamp;
};

export type MabraExploreQueueRow = {
  availableTasks: ExploreQueueTask[];
  completedTasks: string[];
  lastGenerated: Date | null;
};

function parseQueueTask(raw: unknown): ExploreQueueTask | null {
  if (!raw || typeof raw !== 'object') return null;
  const row = raw as Record<string, unknown>;
  const id = typeof row.id === 'string' ? row.id : '';
  const titel = typeof row.titel === 'string' ? row.titel : '';
  const kategori = typeof row.kategori === 'string' ? row.kategori : '';
  const budgetgrans = typeof row.budgetgrans === 'number' ? row.budgetgrans : 0;
  const isSocial = row.isSocial === true;
  if (!id || !titel) return null;
  return {
    id,
    titel,
    kategori: kategori as ExploreQueueTask['kategori'],
    budgetgrans,
    isSocial,
  };
}

export async function getMabraExploreQueue(userId: string): Promise<MabraExploreQueueRow | null> {
  const ref = doc(db, FIRESTORE_COLLECTIONS.mabra_explore_queue, userId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  const data = snap.data();
  const availableTasks = Array.isArray(data.availableTasks)
    ? data.availableTasks.map(parseQueueTask).filter((t): t is ExploreQueueTask => t !== null)
    : [];
  const completedTasks = Array.isArray(data.completedTasks)
    ? data.completedTasks.filter((id): id is string => typeof id === 'string')
    : [];
  const lastGenerated =
    data.lastGenerated instanceof Timestamp ? data.lastGenerated.toDate() : null;
  return { availableTasks, completedTasks, lastGenerated };
}

export async function saveMabraExploreQueue(
  userId: string,
  payload: {
    availableTasks: ExploreQueueTask[];
    completedTasks: string[];
    mergeCompletedAppendOnly?: boolean;
  },
): Promise<void> {
  assertOfflineWriteAllowed(FIRESTORE_COLLECTIONS.mabra_explore_queue);
  const ref = doc(db, FIRESTORE_COLLECTIONS.mabra_explore_queue, userId);

  let completedTasks = payload.completedTasks;
  if (payload.mergeCompletedAppendOnly) {
    const existing = await getMabraExploreQueue(userId);
    const prior = existing?.completedTasks ?? [];
    const merged = [...prior];
    for (const id of payload.completedTasks) {
      if (!merged.includes(id)) merged.push(id);
    }
    completedTasks = merged;
  }

  const now = serverTimestamp();
  await setDoc(
    ref,
    {
      userId,
      ownerId: userId,
      availableTasks: payload.availableTasks,
      completedTasks,
      lastGenerated: now,
      updatedAt: now,
    },
    { merge: true },
  );
}
