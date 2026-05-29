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
import { db } from '../../../core/firebase/firestore';
import { assertOfflineWriteAllowed } from '../../../core/firebase/offlineWritePolicy';
import { FIRESTORE_COLLECTIONS } from '../../../core/types/firestore';
import type { PlanningEmailRule, PlanningEmailRuleInput } from '../types/planningEmailRule';

type FirestorePlanningEmailRule = PlanningEmailRuleInput & {
  userId: string;
  ownerId: string;
  createdAt?: unknown;
};

function mapDoc(id: string, data: FirestorePlanningEmailRule): PlanningEmailRule {
  return {
    id,
    label: data.label,
    matchType: data.matchType,
    pattern: data.pattern,
    route: data.route,
    priority: data.priority,
    enabled: data.enabled,
  };
}

export function listenPlanningEmailRules(
  userId: string,
  onRows: (rules: PlanningEmailRule[]) => void,
): Unsubscribe {
  const ref = collection(db, FIRESTORE_COLLECTIONS.planning_email_rules);
  const q = query(ref, where('ownerId', '==', userId));
  return onSnapshot(
    q,
    (snap) => {
      const rows = snap.docs.map((d) => mapDoc(d.id, d.data() as FirestorePlanningEmailRule));
      rows.sort((a, b) => a.priority - b.priority || a.label.localeCompare(b.label));
      onRows(rows);
    },
    () => onRows([]),
  );
}

export async function createPlanningEmailRule(
  userId: string,
  input: PlanningEmailRuleInput,
): Promise<string> {
  assertOfflineWriteAllowed(FIRESTORE_COLLECTIONS.planning_email_rules);
  const ref = collection(db, FIRESTORE_COLLECTIONS.planning_email_rules);
  const docRef = await addDoc(ref, {
    userId,
    ownerId: userId,
    label: input.label.trim().slice(0, 80),
    matchType: input.matchType,
    pattern: input.pattern.trim().slice(0, 200),
    route: input.route,
    priority: Math.min(100, Math.max(1, Math.round(input.priority))),
    enabled: input.enabled,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updatePlanningEmailRule(
  _userId: string,
  ruleId: string,
  patch: Partial<PlanningEmailRuleInput>,
): Promise<void> {
  assertOfflineWriteAllowed(FIRESTORE_COLLECTIONS.planning_email_rules);
  const payload: Record<string, unknown> = {};
  if (patch.label !== undefined) payload.label = patch.label.trim().slice(0, 80);
  if (patch.matchType !== undefined) payload.matchType = patch.matchType;
  if (patch.pattern !== undefined) payload.pattern = patch.pattern.trim().slice(0, 200);
  if (patch.route !== undefined) payload.route = patch.route;
  if (patch.priority !== undefined) {
    payload.priority = Math.min(100, Math.max(1, Math.round(patch.priority)));
  }
  if (patch.enabled !== undefined) payload.enabled = patch.enabled;
  if (Object.keys(payload).length === 0) return;
  await updateDoc(doc(db, FIRESTORE_COLLECTIONS.planning_email_rules, ruleId), payload);
}

export async function deletePlanningEmailRule(_userId: string, ruleId: string): Promise<void> {
  assertOfflineWriteAllowed(FIRESTORE_COLLECTIONS.planning_email_rules);
  await deleteDoc(doc(db, FIRESTORE_COLLECTIONS.planning_email_rules, ruleId));
}
