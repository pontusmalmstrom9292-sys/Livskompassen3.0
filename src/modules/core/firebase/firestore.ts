import {
  addDoc,
  collection,
  getFirestore,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  where,
  getDocs,
} from 'firebase/firestore';
import { app } from './init';
import type { CheckIn, VaultLog } from '../types/firestore';
import { FIRESTORE_COLLECTIONS } from '../types/firestore';

export const db = getFirestore(app);

type FirestorePayload = Record<string, unknown>;

function withUserId(userId: string, data: FirestorePayload): FirestorePayload {
  return { ...data, userId, ownerId: userId, createdAt: serverTimestamp() };
}

export async function saveCheckIn(userId: string, checkIn: Omit<CheckIn, 'userId' | 'createdAt'>) {
  const ref = collection(db, FIRESTORE_COLLECTIONS.checkins);
  const docRef = await addDoc(ref, withUserId(userId, { ...checkIn }));
  return docRef.id;
}

export async function saveJournalEntry(
  userId: string,
  entry: { mood: string; text: string }
) {
  const ref = collection(db, 'journal');
  const docRef = await addDoc(ref, withUserId(userId, entry));
  return docRef.id;
}

export async function saveVaultLog(userId: string, log: Omit<VaultLog, 'userId' | 'createdAt'>) {
  const ref = collection(db, FIRESTORE_COLLECTIONS.reality_vault);
  const docRef = await addDoc(ref, withUserId(userId, { ...log, isLocked: true }));
  return docRef.id;
}

export async function saveChildrenLog(
  userId: string,
  log: {
    childAlias: string;
    observation: string;
    childrenImpact?: string;
    category?: string;
  }
) {
  const ref = collection(db, 'children_logs');
  const docRef = await addDoc(
    ref,
    withUserId(userId, {
      ...log,
      action: 'livslogg',
      truth: log.observation,
    })
  );
  return docRef.id;
}

export async function getVaultLogs(userId: string): Promise<(VaultLog & { id: string })[]> {
  const ref = collection(db, FIRESTORE_COLLECTIONS.reality_vault);
  const q = query(ref, where('userId', '==', userId), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => {
    const data = d.data();
    const createdAt =
      data.createdAt instanceof Timestamp
        ? data.createdAt.toDate().toISOString()
        : String(data.createdAt ?? '');
    return { id: d.id, ...(data as VaultLog), createdAt };
  });
}

export async function getChildrenLogs(userId: string) {
  const ref = collection(db, 'children_logs');
  const q = query(ref, where('userId', '==', userId), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
    createdAt:
      d.data().createdAt instanceof Timestamp
        ? d.data().createdAt.toDate().toISOString()
        : String(d.data().createdAt ?? ''),
  }));
}

export async function getJournalEntries(userId: string) {
  const ref = collection(db, 'journal');
  const q = query(ref, where('userId', '==', userId), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
    createdAt:
      d.data().createdAt instanceof Timestamp
        ? d.data().createdAt.toDate().toISOString()
        : String(d.data().createdAt ?? ''),
  }));
}
