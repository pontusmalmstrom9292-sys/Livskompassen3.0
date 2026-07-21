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
import { db } from '@/core/firebase/firestore';
import { assertOfflineWriteAllowed } from '@/core/firebase/offlineWritePolicy';
import { FIRESTORE_COLLECTIONS } from '@/core/types/firestore';
import { isProjectBlockType } from '../utils/projectBlockTypes';
import { assertProjectWriteAuth } from '../utils/projectWriteAuth';
import type { ProjectBlock, ProjectBlockType } from '../types';

type FirestoreProjectBlock = {
  projectId: string;
  type: ProjectBlockType;
  title: string;
  content?: string;
  storagePath?: string;
  imageUrl?: string;
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
    storagePath: data.storagePath,
    imageUrl: data.imageUrl,
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
    storagePath?: string;
    imageUrl?: string;
    order: number;
    planningTaskId?: string;
  },
): Promise<string> {
  assertOfflineWriteAllowed(FIRESTORE_COLLECTIONS.project_blocks);
  const { uid } = assertProjectWriteAuth(userId);
  if (!isProjectBlockType(input.type)) {
    throw new Error('Ogiltig blocktyp.');
  }
  const title = input.title.trim();
  if (!title) {
    throw new Error('Ge blocket en titel.');
  }
  const ref = collection(db, FIRESTORE_COLLECTIONS.project_blocks);
  const docRef = await addDoc(ref, {
    userId: uid,
    ownerId: uid,
    projectId: input.projectId,
    type: input.type,
    title,
    order: Math.trunc(input.order),
    ...(input.content ? { content: input.content.trim().slice(0, 4000) } : {}),
    ...(input.storagePath ? { storagePath: input.storagePath.slice(0, 512) } : {}),
    ...(input.imageUrl ? { imageUrl: input.imageUrl.slice(0, 2048) } : {}),
    ...(input.planningTaskId ? { planningTaskId: input.planningTaskId.slice(0, 128) } : {}),
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

import { httpsCallable } from 'firebase/functions';
import { functions } from '@/core/firebase/init';

export async function runProjectBlockOcr(projectId: string, blockId: string): Promise<string> {
  const callable = httpsCallable<{ projectId: string; blockId: string }, { success: boolean; text: string }>(
    functions,
    'analyzeProjectImage',
  );
  const result = await callable({ projectId, blockId });
  return result.data.text;
}
