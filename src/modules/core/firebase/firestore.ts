import {
  addDoc,
  collection,
  getFirestore,
  query,
  serverTimestamp,
  Timestamp,
  where,
  getDocs,
} from 'firebase/firestore';
import { app } from './init';
import type { CheckIn, VaultLog, KampsparEntryRow } from '../types/firestore';
import { FIRESTORE_COLLECTIONS } from '../types/firestore';

export const db = getFirestore(app);

type FirestorePayload = Record<string, unknown>;

const WORM_FORBIDDEN_KEYS = ['updatedAt', 'deletedAt', 'modifiedAt', 'revision'] as const;

/** WORM — append-only payloads must not carry mutation fields. */
function assertWormPayload(data: FirestorePayload, context: string): void {
  for (const key of WORM_FORBIDDEN_KEYS) {
    if (key in data) {
      throw new Error(`WORM violation (${context}): field "${key}" is not allowed on create.`);
    }
  }
}

function withUserId(userId: string, data: FirestorePayload): FirestorePayload {
  return { ...data, userId, ownerId: userId, createdAt: serverTimestamp() };
}

/** List queries must constrain ownerId to satisfy Firestore rules (isOwner). */
function ownerScopedQuery(ref: ReturnType<typeof collection>, ownerId: string) {
  return query(ref, where('ownerId', '==', ownerId));
}

function normalizeCreatedAt(value: unknown): string {
  if (value instanceof Timestamp) return value.toDate().toISOString();
  if (typeof value === 'string') return value;
  if (value == null) return '';
  return String(value);
}

function sortByCreatedAtDesc<T extends { createdAt?: string }>(rows: T[]): T[] {
  return [...rows].sort((a, b) => (b.createdAt ?? '').localeCompare(a.createdAt ?? ''));
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

export async function saveVaultLog(
  userId: string,
  log: Omit<VaultLog, 'userId' | 'createdAt'>
) {
  const payload = { ...log, isLocked: true } as FirestorePayload;
  assertWormPayload(payload, 'reality_vault');
  const ref = collection(db, FIRESTORE_COLLECTIONS.reality_vault);
  const docRef = await addDoc(ref, withUserId(userId, payload));
  return docRef.id;
}

export async function saveChildrenLog(
  userId: string,
  log: {
    childAlias: string;
    observation: string;
    childrenImpact?: string;
    category?: string;
    action?: string;
    signals?: { somn: number; angest: number; aptit: number };
  }
) {
  const ref = collection(db, 'children_logs');
  const action = log.action ?? 'livslogg';
  const payload: FirestorePayload = {
    childAlias: log.childAlias,
    action,
    category: log.category,
    childrenImpact: log.childrenImpact,
  };

  if (action === 'fysiologi') {
    payload.signals = log.signals;
    payload.observation = log.observation || undefined;
  } else {
    payload.observation = log.observation;
    payload.truth = log.observation;
  }

  const docRef = await addDoc(ref, withUserId(userId, payload));
  return docRef.id;
}

export async function saveMabraSession(
  userId: string,
  session: {
    exerciseType: 'breathing' | 'grounding';
    durationSeconds: number;
    hubSymptom?: string;
  }
) {
  const ref = collection(db, FIRESTORE_COLLECTIONS.mabra_sessions);
  const payload: FirestorePayload = {
    exerciseType: session.exerciseType,
    durationSeconds: session.durationSeconds,
  };
  if (session.hubSymptom) {
    payload.hubSymptom = session.hubSymptom;
  }
  assertWormPayload(payload, 'mabra_sessions');
  const docRef = await addDoc(ref, withUserId(userId, payload));
  return docRef.id;
}

export async function getVaultLogs(userId: string): Promise<(VaultLog & { id: string })[]> {
  const ref = collection(db, FIRESTORE_COLLECTIONS.reality_vault);
  const snap = await getDocs(ownerScopedQuery(ref, userId));
  return sortByCreatedAtDesc(
    snap.docs.map((d) => {
      const data = d.data();
      const { createdAt: _rawCreatedAt, ...rest } = data;
      return { id: d.id, ...(rest as VaultLog), createdAt: normalizeCreatedAt(_rawCreatedAt) };
    })
  );
}

export async function getChildrenLogs(userId: string) {
  const ref = collection(db, 'children_logs');
  const snap = await getDocs(ownerScopedQuery(ref, userId));
  return sortByCreatedAtDesc(
    snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
      createdAt: normalizeCreatedAt(d.data().createdAt),
    }))
  );
}

export async function getJournalEntries(userId: string) {
  const ref = collection(db, 'journal');
  const snap = await getDocs(ownerScopedQuery(ref, userId));
  return sortByCreatedAtDesc(
    snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
      createdAt: normalizeCreatedAt(d.data().createdAt),
    }))
  );
}

export async function getKampsparEntries(userId: string): Promise<KampsparEntryRow[]> {
  const ref = collection(db, FIRESTORE_COLLECTIONS.kampspar);
  const snap = await getDocs(ownerScopedQuery(ref, userId));
  return sortByCreatedAtDesc(
    snap.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        userId: String(data.userId ?? userId),
        title: String(data.title ?? ''),
        content: String(data.content ?? ''),
        category: data.category ?? null,
        source: data.source ?? undefined,
        eventDate: data.eventDate ?? null,
        embeddingDim: data.embeddingDim ?? null,
        createdAt: normalizeCreatedAt(data.createdAt),
      };
    })
  );
}
