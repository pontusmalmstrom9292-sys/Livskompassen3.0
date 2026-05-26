import {
  addDoc,
  collection,
  onSnapshot,
  query,
  serverTimestamp,
  Timestamp,
  where,
  type Unsubscribe,
} from 'firebase/firestore';
import { db } from '../../core/firebase/firestore';
import { FIRESTORE_COLLECTIONS } from '../../core/types/firestore';
import type { ProjectBlock, ProjectBlockType } from '../types';

type FirestoreProjectBlock = {
  projectId: string;
  type: ProjectBlockType;
  title: string;
  content?: string;
  order: number;
  planningTaskId?: string;
  userId: string;
  ownerId: string;
  createdAt?: Timestamp | string;
};

function normalizeTime(value: unknown): string {
  if (value instanceof Timestamp) return value.toDate().toISOString();
  if (typeof value === 'string') return value;
  return '';
}

function mapBlock(id: string, data: FirestoreProjectBlock): ProjectBlock {
  return {
    id,
    projectId: data.projectId,
    type: data.type,
    title: data.title,
    content: data.content,
    order: data.order,
    planningTaskId: data.planningTaskId,
    createdAt: normalizeTime(data.createdAt),
  };
}

export function listenProjectBlocks(
  userId: string,
  projectId: string,
  onRows: (blocks: ProjectBlock[]) => void,
): Unsubscribe {
  const ref = collection(db, FIRESTORE_COLLECTIONS.project_blocks);
  const q = query(ref, where('ownerId', '==', userId), where('projectId', '==', projectId));
  return onSnapshot(
    q,
    (snap) => {
      const rows = snap.docs.map((d) => mapBlock(d.id, d.data() as FirestoreProjectBlock));
      rows.sort((a, b) => a.order - b.order);
      onRows(rows);
    },
    () => onRows([]),
  );
}

export async function createProjectBlock(
  userId: string,
  input: {
    projectId: string;
    type: ProjectBlockType;
    title: string;
    content?: string;
    order: number;
    planningTaskId?: string;
  },
): Promise<string> {
  const ref = collection(db, FIRESTORE_COLLECTIONS.project_blocks);
  const docRef = await addDoc(ref, {
    userId,
    ownerId: userId,
    projectId: input.projectId,
    type: input.type,
    title: input.title.trim(),
    order: input.order,
    ...(input.content ? { content: input.content.trim() } : {}),
    ...(input.planningTaskId ? { planningTaskId: input.planningTaskId } : {}),
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}
