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
import type { InboxCategorizationRule, InboxCategorizationRuleInput } from '../types/inboxRule';

type FirestoreInboxRule = InboxCategorizationRuleInput & {
  userId: string;
  ownerId: string;
  createdAt?: unknown;
};

function mapDoc(id: string, data: FirestoreInboxRule): InboxCategorizationRule {
  return {
    id,
    label: data.label,
    matchType: data.matchType,
    pattern: data.pattern,
    targetTags: data.targetTags || [],
    targetCategory: data.targetCategory || '',
    targetRouting: data.targetRouting || '',
    priority: data.priority,
    enabled: data.enabled,
  };
}

export function listenInboxRules(
  userId: string,
  onRows: (rules: InboxCategorizationRule[]) => void,
): Unsubscribe {
  const ref = collection(db, FIRESTORE_COLLECTIONS.inbox_rules);
  const q = query(ref, where('ownerId', '==', userId));
  return onSnapshot(
    q,
    (snap) => {
      const rows = snap.docs.map((d) => mapDoc(d.id, d.data() as FirestoreInboxRule));
      rows.sort((a, b) => a.priority - b.priority || a.label.localeCompare(b.label));
      onRows(rows);
    },
    () => onRows([]),
  );
}

export async function createInboxRule(
  userId: string,
  input: InboxCategorizationRuleInput,
): Promise<string> {
  assertOfflineWriteAllowed(FIRESTORE_COLLECTIONS.inbox_rules);
  const ref = collection(db, FIRESTORE_COLLECTIONS.inbox_rules);
  const docRef = await addDoc(ref, {
    userId,
    ownerId: userId,
    label: input.label.trim().slice(0, 80),
    matchType: input.matchType,
    pattern: input.pattern.trim().slice(0, 200),
    targetTags: input.targetTags.map(t => t.trim().slice(0, 48)).filter(Boolean),
    targetCategory: input.targetCategory.trim().slice(0, 48),
    targetRouting: input.targetRouting,
    priority: Math.min(100, Math.max(1, Math.round(input.priority))),
    enabled: input.enabled,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateInboxRule(
  _userId: string,
  ruleId: string,
  patch: Partial<InboxCategorizationRuleInput>,
): Promise<void> {
  assertOfflineWriteAllowed(FIRESTORE_COLLECTIONS.inbox_rules);
  const payload: Record<string, unknown> = {};
  if (patch.label !== undefined) payload.label = patch.label.trim().slice(0, 80);
  if (patch.matchType !== undefined) payload.matchType = patch.matchType;
  if (patch.pattern !== undefined) payload.pattern = patch.pattern.trim().slice(0, 200);
  if (patch.targetTags !== undefined) {
    payload.targetTags = patch.targetTags.map(t => t.trim().slice(0, 48)).filter(Boolean);
  }
  if (patch.targetCategory !== undefined) {
    payload.targetCategory = patch.targetCategory.trim().slice(0, 48);
  }
  if (patch.targetRouting !== undefined) payload.targetRouting = patch.targetRouting;
  if (patch.priority !== undefined) {
    payload.priority = Math.min(100, Math.max(1, Math.round(patch.priority)));
  }
  if (patch.enabled !== undefined) payload.enabled = patch.enabled;
  if (Object.keys(payload).length === 0) return;
  await updateDoc(doc(db, FIRESTORE_COLLECTIONS.inbox_rules, ruleId), payload);
}

export async function deleteInboxRule(_userId: string, ruleId: string): Promise<void> {
  assertOfflineWriteAllowed(FIRESTORE_COLLECTIONS.inbox_rules);
  await deleteDoc(doc(db, FIRESTORE_COLLECTIONS.inbox_rules, ruleId));
}
