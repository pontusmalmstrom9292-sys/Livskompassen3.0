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
import { db } from '@/core/firebase/firestore';
import { assertOfflineWriteAllowed } from '@/core/firebase/offlineWritePolicy';
import { FIRESTORE_COLLECTIONS } from '@/core/types/firestore';
import { assertProjectWriteAuth } from '../utils/projectWriteAuth';
import type { Project, ProjectBlockType, ProjectStatus } from '../types';

type FirestoreProject = {
  title: string;
  status: ProjectStatus;
  primaryBlockType?: ProjectBlockType;
  userId: string;
  ownerId: string;
  createdAt?: Timestamp | string;
  updatedAt?: Timestamp | string;
};

function normalizeTime(value: unknown): string {
  if (value instanceof Timestamp) return value.toDate().toISOString();
  if (typeof value === 'string') return value;
  return '';
}

function mapProject(id: string, data: FirestoreProject): Project {
  return {
    id,
    title: data.title,
    status: data.status,
    primaryBlockType: data.primaryBlockType,
    createdAt: normalizeTime(data.createdAt),
    updatedAt: normalizeTime(data.updatedAt),
  };
}

export function listenProjects(
  userId: string,
  status: ProjectStatus,
  onRows: (projects: Project[]) => void,
): Unsubscribe {
  const ref = collection(db, FIRESTORE_COLLECTIONS.projects);
  const q = query(ref, where('ownerId', '==', userId));
  return onSnapshot(
    q,
    (snap) => {
      const rows = snap.docs
        .map((d) => mapProject(d.id, d.data() as FirestoreProject))
        .filter((p) => p.status === status);
      rows.sort((a, b) => (b.updatedAt ?? b.createdAt ?? '').localeCompare(a.updatedAt ?? a.createdAt ?? ''));
      onRows(rows);
    },
    () => onRows([]),
  );
}

export function listenAllProjects(
  userId: string,
  onRows: (projects: Project[]) => void,
): Unsubscribe {
  const ref = collection(db, FIRESTORE_COLLECTIONS.projects);
  const q = query(ref, where('ownerId', '==', userId));
  return onSnapshot(
    q,
    (snap) => {
      const rows = snap.docs.map((d) => mapProject(d.id, d.data() as FirestoreProject));
      rows.sort((a, b) => (b.updatedAt ?? b.createdAt ?? '').localeCompare(a.updatedAt ?? a.createdAt ?? ''));
      onRows(rows);
    },
    () => onRows([]),
  );
}

export async function createProject(
  userId: string,
  input: { title: string; primaryBlockType?: ProjectBlockType; status?: ProjectStatus },
): Promise<string> {
  assertOfflineWriteAllowed(FIRESTORE_COLLECTIONS.projects);
  const { uid } = assertProjectWriteAuth(userId);
  const title = input.title.trim();
  if (!title) {
    throw new Error('Ge projektet ett namn.');
  }
  const status = input.status ?? 'active';
  const ref = collection(db, FIRESTORE_COLLECTIONS.projects);
  const docRef = await addDoc(ref, {
    userId: uid,
    ownerId: uid,
    title,
    status,
    ...(input.primaryBlockType ? { primaryBlockType: input.primaryBlockType } : {}),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateProjectTitle(_userId: string, projectId: string, title: string): Promise<void> {
  assertOfflineWriteAllowed(FIRESTORE_COLLECTIONS.projects);
  const ref = doc(db, FIRESTORE_COLLECTIONS.projects, projectId);
  await updateDoc(ref, {
    title: title.trim(),
    updatedAt: serverTimestamp(),
  });
}

export async function updateProjectStatus(
  _userId: string,
  projectId: string,
  status: ProjectStatus,
): Promise<void> {
  assertOfflineWriteAllowed(FIRESTORE_COLLECTIONS.projects);
  const ref = doc(db, FIRESTORE_COLLECTIONS.projects, projectId);
  await updateDoc(ref, {
    status,
    updatedAt: serverTimestamp(),
  });
}
