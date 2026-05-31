import {
  addDoc,
  collection,
  onSnapshot,
  query,
  serverTimestamp,
  where,
  type Unsubscribe,
} from 'firebase/firestore';
import { db } from '../firebase/firestore';
import { assertOfflineWriteAllowed } from '../firebase/offlineWritePolicy';
import { FIRESTORE_COLLECTIONS } from '../types/firestore';
import type { LifeHubPresetId } from './lifeHubPresets';
import type { RoutineStep, RoutineTemplate } from './routineTemplates';

type FirestoreRoutineTemplate = {
  userId: string;
  ownerId: string;
  templateId: string;
  title: string;
  lead: string;
  presetIds?: string[];
  steps: RoutineStep[];
  createdAt?: unknown;
};

function mapDoc(id: string, data: FirestoreRoutineTemplate): RoutineTemplate {
  return {
    id: data.templateId || id,
    title: data.title,
    lead: data.lead,
    presetIds: data.presetIds as LifeHubPresetId[] | undefined,
    steps: data.steps ?? [],
  };
}

export function listenRoutineTemplates(
  userId: string,
  onRows: (templates: RoutineTemplate[]) => void,
): Unsubscribe {
  const ref = collection(db, FIRESTORE_COLLECTIONS.routine_templates);
  const q = query(ref, where('ownerId', '==', userId));
  return onSnapshot(
    q,
    (snap) => {
      const rows = snap.docs.map((d) => mapDoc(d.id, d.data() as FirestoreRoutineTemplate));
      rows.sort((a, b) => a.title.localeCompare(b.title));
      onRows(rows);
    },
    () => onRows([]),
  );
}

export async function seedRoutineTemplate(userId: string, template: RoutineTemplate): Promise<void> {
  assertOfflineWriteAllowed(FIRESTORE_COLLECTIONS.routine_templates);
  const ref = collection(db, FIRESTORE_COLLECTIONS.routine_templates);
  await addDoc(ref, {
    userId,
    ownerId: userId,
    templateId: template.id,
    title: template.title.slice(0, 80),
    lead: template.lead.slice(0, 200),
    presetIds: template.presetIds ?? [],
    steps: template.steps.slice(0, 12),
    createdAt: serverTimestamp(),
  });
}
