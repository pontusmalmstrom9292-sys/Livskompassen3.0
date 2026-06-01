import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  updateDoc,
  where,
  type Unsubscribe,
} from 'firebase/firestore';
import { db } from '@/core/firebase/firestore';
import { assertOfflineWriteAllowed } from '@/core/firebase/offlineWritePolicy';
import { FIRESTORE_COLLECTIONS } from '@/core/types/firestore';
import type { ProjectRule, ProjectRuleInput } from '../types/projectRule';

type FirestoreProjectRule = ProjectRuleInput & {
  userId: string;
  ownerId: string;
  createdAt?: unknown;
};

function mapDoc(id: string, data: FirestoreProjectRule): ProjectRule {
  return {
    id,
    label: data.label,
    matchPattern: data.matchPattern,
    action: data.action,
    targetProjectId: data.targetProjectId,
    enabled: data.enabled,
  };
}

export function listenProjectRules(userId: string, onRows: (rules: ProjectRule[]) => void): Unsubscribe {
  const ref = collection(db, FIRESTORE_COLLECTIONS.project_rules);
  const q = query(ref, where('ownerId', '==', userId));
  return onSnapshot(
    q,
    (snap) => {
      const rows = snap.docs.map((d) => mapDoc(d.id, d.data() as FirestoreProjectRule));
      rows.sort((a, b) => a.label.localeCompare(b.label));
      onRows(rows);
    },
    () => onRows([]),
  );
}

export async function createProjectRule(userId: string, input: ProjectRuleInput): Promise<string> {
  assertOfflineWriteAllowed(FIRESTORE_COLLECTIONS.project_rules);
  const ref = collection(db, FIRESTORE_COLLECTIONS.project_rules);
  const payload: Record<string, unknown> = {
    userId,
    ownerId: userId,
    label: input.label.trim().slice(0, 80),
    matchPattern: input.matchPattern.trim().slice(0, 200),
    action: input.action,
    enabled: input.enabled,
    createdAt: serverTimestamp(),
  };
  const tid = input.targetProjectId?.trim();
  if (tid) payload.targetProjectId = tid.slice(0, 128);
  const docRef = await addDoc(ref, payload);
  return docRef.id;
}

export async function updateProjectRule(
  _userId: string,
  ruleId: string,
  patch: Partial<ProjectRuleInput>,
): Promise<void> {
  assertOfflineWriteAllowed(FIRESTORE_COLLECTIONS.project_rules);
  const payload: Record<string, unknown> = {};
  if (patch.label !== undefined) payload.label = patch.label.trim().slice(0, 80);
  if (patch.matchPattern !== undefined) payload.matchPattern = patch.matchPattern.trim().slice(0, 200);
  if (patch.action !== undefined) payload.action = patch.action;
  if (patch.enabled !== undefined) payload.enabled = patch.enabled;
  if (patch.targetProjectId !== undefined) {
    const tid = patch.targetProjectId?.trim();
    payload.targetProjectId = tid ? tid.slice(0, 128) : null;
  }
  if (Object.keys(payload).length === 0) return;
  await updateDoc(doc(db, FIRESTORE_COLLECTIONS.project_rules, ruleId), payload);
}

export async function deleteProjectRule(_userId: string, ruleId: string): Promise<void> {
  assertOfflineWriteAllowed(FIRESTORE_COLLECTIONS.project_rules);
  await deleteDoc(doc(db, FIRESTORE_COLLECTIONS.project_rules, ruleId));
}
