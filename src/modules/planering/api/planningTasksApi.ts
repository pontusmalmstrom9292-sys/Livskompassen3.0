import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
  where,
  type Unsubscribe,
} from 'firebase/firestore';
import { db } from '../../core/firebase/firestore';
import { assertOfflineWriteAllowed } from '../../core/firebase/offlineWritePolicy';
import { FIRESTORE_COLLECTIONS } from '../../core/types/firestore';
import type { PlanningTask, PlanningTaskSource, PlanningTaskStatus } from '../types';

type FirestorePlanningTask = {
  title: string;
  summary?: string;
  status: PlanningTaskStatus;
  dueAt?: string;
  source: PlanningTaskSource;
  sourceRef?: string;
  microStep?: string;
  projectId?: string;
  userId: string;
  ownerId: string;
  createdAt?: Timestamp | string;
};

function normalizeCreatedAt(value: unknown): string {
  if (value instanceof Timestamp) return value.toDate().toISOString();
  if (typeof value === 'string') return value;
  return '';
}

function mapDoc(id: string, data: FirestorePlanningTask): PlanningTask {
  return {
    id,
    title: data.title,
    summary: data.summary,
    status: data.status,
    dueAt: data.dueAt,
    source: data.source,
    sourceRef: data.sourceRef,
    microStep: data.microStep,
    projectId: data.projectId,
    createdAt: normalizeCreatedAt(data.createdAt),
  };
}

export function listenPlanningTasks(
  userId: string,
  onRows: (tasks: PlanningTask[]) => void,
): Unsubscribe {
  const ref = collection(db, FIRESTORE_COLLECTIONS.planning_tasks);
  const q = query(ref, where('ownerId', '==', userId));
  return onSnapshot(
    q,
    (snap) => {
      const rows = snap.docs.map((d) => mapDoc(d.id, d.data() as FirestorePlanningTask));
      rows.sort((a, b) => (b.createdAt ?? '').localeCompare(a.createdAt ?? ''));
      onRows(rows);
    },
    () => onRows([]),
  );
}

export async function createPlanningTask(
  userId: string,
  input: {
    title: string;
    status: PlanningTaskStatus;
    source: PlanningTaskSource;
    dueAt?: string;
    summary?: string;
    sourceRef?: string;
    projectId?: string;
  },
): Promise<string> {
  assertOfflineWriteAllowed(FIRESTORE_COLLECTIONS.planning_tasks);
  const ref = collection(db, FIRESTORE_COLLECTIONS.planning_tasks);
  const docRef = await addDoc(ref, {
    userId,
    ownerId: userId,
    title: input.title.trim(),
    status: input.status,
    source: input.source,
    ...(input.dueAt ? { dueAt: input.dueAt } : {}),
    ...(input.summary ? { summary: input.summary.trim() } : {}),
    ...(input.sourceRef ? { sourceRef: input.sourceRef } : {}),
    ...(input.projectId ? { projectId: input.projectId } : {}),
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updatePlanningTask(
  _userId: string,
  taskId: string,
  patch: { status?: PlanningTaskStatus; microStep?: string; dueAt?: string; summary?: string },
): Promise<void> {
  assertOfflineWriteAllowed(FIRESTORE_COLLECTIONS.planning_tasks);
  const ref = doc(db, FIRESTORE_COLLECTIONS.planning_tasks, taskId);
  const payload: Record<string, string | undefined> = {};
  if (patch.status) payload.status = patch.status;
  if (patch.microStep !== undefined) payload.microStep = patch.microStep;
  if (patch.dueAt !== undefined) payload.dueAt = patch.dueAt;
  if (patch.summary !== undefined) payload.summary = patch.summary;
  if (Object.keys(payload).length === 0) return;
  await updateDoc(ref, payload);
}
