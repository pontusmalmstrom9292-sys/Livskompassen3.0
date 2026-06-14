import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import { db } from '@/core/firebase/firestore';
import { FIRESTORE_COLLECTIONS, type CheckIn, type EvolutionHubDoc } from '@/core/types/firestore';
import {
  getLocalIsoDate,
  normalizeFocusPoints,
  USER_DAILY_FOCUS_COLLECTION,
} from '@/modules/morning/lib/focusPoints';
import type { PlanningTask } from '@/modules/features/admin/planning/types';
import type { EconomyCapacityLevel } from '@/features/dailyLife/wellbeing/economy/supermodule/capacityResolver';
import {
  detectGoalCandidates,
  resolveCapacityLevel,
  SIGNAL_WINDOW_DAYS,
  type FocusHistoryEntry,
  type GoalDetectionResult,
} from '../lib/goalDetection';

const LOW_MOOD_ENERGY_THRESHOLD = 4;

function isoDaysAgo(days: number, now = new Date()): string {
  const d = new Date(now);
  d.setDate(d.getDate() - days);
  return getLocalIsoDate(d);
}

function isWithinWindow(isoDate: string, windowDays: number, now = new Date()): boolean {
  const cutoff = isoDaysAgo(windowDays, now);
  return isoDate >= cutoff;
}

function parseCheckinScore(data: CheckIn): number | null {
  let total = 0;
  let fields = 0;
  if (typeof data.mood === 'number') {
    total += data.mood;
    fields += 1;
  }
  if (typeof data.energy === 'number') {
    total += data.energy;
    fields += 1;
  }
  if (fields === 0) return null;
  return total / fields;
}

function mapPlanningCompletionRate(tasks: PlanningTask[]): number {
  if (tasks.length === 0) return 1;
  const done = tasks.filter((task) => task.status === 'done').length;
  return done / tasks.length;
}

/** Läser `user_daily_focus` root + `history/` (read-only). */
export async function fetchFocusHistory(ownerId: string): Promise<FocusHistoryEntry[]> {
  const entries: FocusHistoryEntry[] = [];
  const today = getLocalIsoDate();

  const rootRef = doc(db, USER_DAILY_FOCUS_COLLECTION, ownerId);
  const rootSnap = await getDoc(rootRef);
  if (rootSnap.exists()) {
    const data = rootSnap.data();
    entries.push({
      date: today,
      points: normalizeFocusPoints(data.focusPoints),
    });
  }

  const historyRef = collection(db, USER_DAILY_FOCUS_COLLECTION, ownerId, 'history');
  const historySnap = await getDocs(historyRef);
  historySnap.forEach((docSnap) => {
    const data = docSnap.data();
    const date =
      typeof data.date === 'string' && data.date.trim()
        ? data.date.trim()
        : docSnap.id;
    entries.push({
      date,
      points: normalizeFocusPoints(data.focusPoints),
    });
  });

  const deduped = new Map<string, FocusHistoryEntry>();
  for (const entry of entries) {
    deduped.set(entry.date, entry);
  }
  return [...deduped.values()].sort((a, b) => a.date.localeCompare(b.date));
}

async function fetchLowMoodCheckinCount(ownerId: string): Promise<number> {
  const cutoffIso = new Date();
  cutoffIso.setDate(cutoffIso.getDate() - SIGNAL_WINDOW_DAYS);

  const q = query(
    collection(db, FIRESTORE_COLLECTIONS.checkins),
    where('userId', '==', ownerId),
    where('questionId', '==', 'mabra_checkin'),
    where('createdAt', '>=', cutoffIso.toISOString()),
  );

  const snap = await getDocs(q);
  let lowCount = 0;
  snap.forEach((docSnap) => {
    const score = parseCheckinScore(docSnap.data() as CheckIn);
    if (score !== null && score < LOW_MOOD_ENERGY_THRESHOLD) {
      lowCount += 1;
    }
  });
  return lowCount;
}

async function fetchMabraSessionCount7d(ownerId: string): Promise<number> {
  const cutoffIso = new Date();
  cutoffIso.setDate(cutoffIso.getDate() - SIGNAL_WINDOW_DAYS);

  const q = query(
    collection(db, FIRESTORE_COLLECTIONS.mabra_sessions),
    where('ownerId', '==', ownerId),
    where('createdAt', '>=', cutoffIso.toISOString()),
  );

  try {
    const snap = await getDocs(q);
    return snap.size;
  } catch {
    const fallbackQ = query(
      collection(db, FIRESTORE_COLLECTIONS.mabra_sessions),
      where('ownerId', '==', ownerId),
    );
    const snap = await getDocs(fallbackQ);
    let count = 0;
    snap.forEach((docSnap) => {
      const createdAt = docSnap.data().createdAt;
      if (typeof createdAt === 'string' && createdAt >= cutoffIso.toISOString()) {
        count += 1;
      }
    });
    return count;
  }
}

async function fetchPlanningTasks(ownerId: string): Promise<PlanningTask[]> {
  const q = query(
    collection(db, FIRESTORE_COLLECTIONS.planning_tasks),
    where('ownerId', '==', ownerId),
  );
  const snap = await getDocs(q);
  return snap.docs
    .map((docSnap) => {
      const data = docSnap.data();
      const title = typeof data.title === 'string' ? data.title.trim() : '';
      if (!title) return null;
      return {
        id: docSnap.id,
        title,
        status: data.status ?? 'todo',
        source: data.source ?? 'manual',
        createdAt: typeof data.createdAt === 'string' ? data.createdAt : '',
      } as PlanningTask;
    })
    .filter((row): row is PlanningTask => row !== null);
}

async function fetchEvolutionHub(ownerId: string): Promise<EvolutionHubDoc | null> {
  const ref = doc(db, FIRESTORE_COLLECTIONS.evolution_hub, ownerId);
  const snap = await getDoc(ref);
  return snap.exists() ? (snap.data() as EvolutionHubDoc) : null;
}

export type RunGoalDetectionInput = {
  ownerId: string;
  economyLevel: EconomyCapacityLevel;
};

/**
 * Samlar read-only signaler och kör deterministisk detektering (P5-A).
 * Skriver aldrig till Firestore.
 */
export async function runGoalDetection(
  input: RunGoalDetectionInput,
): Promise<GoalDetectionResult> {
  const { ownerId, economyLevel } = input;

  const [
    focusEntries,
    lowMoodCheckinCount,
    mabraSessionCount7d,
    planningTasks,
    evolutionDoc,
  ] = await Promise.all([
    fetchFocusHistory(ownerId),
    fetchLowMoodCheckinCount(ownerId),
    fetchMabraSessionCount7d(ownerId),
    fetchPlanningTasks(ownerId),
    fetchEvolutionHub(ownerId),
  ]);

  const recentTasks = planningTasks.filter((task) => {
    if (!task.createdAt) return true;
    const createdDay = task.createdAt.slice(0, 10);
    return isWithinWindow(createdDay, SIGNAL_WINDOW_DAYS);
  });

  const capacityLevel = resolveCapacityLevel(evolutionDoc, economyLevel);

  return detectGoalCandidates({
    focusEntries,
    lowMoodCheckinCount,
    mabraSessionCount7d,
    planningCompletionRate: mapPlanningCompletionRate(
      recentTasks.length > 0 ? recentTasks : planningTasks,
    ),
    capacityLevel,
  });
}
