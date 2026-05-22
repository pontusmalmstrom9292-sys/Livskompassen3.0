import {
  addDoc,
  collection,
  doc,
  getDoc,
  getFirestore,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
  where,
  getDocs,
  onSnapshot,
} from 'firebase/firestore';
import { app } from './init';
import type { CheckIn, VaultLog, KampsparEntryRow, MemoryAnchor } from '../types/firestore';
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

export type CheckInRow = CheckIn & { id: string };

export async function getRecentCheckIns(userId: string, limit = 20): Promise<CheckInRow[]> {
  const ref = collection(db, FIRESTORE_COLLECTIONS.checkins);
  const snap = await getDocs(ownerScopedQuery(ref, userId));
  return sortByCreatedAtDesc(
    snap.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        userId: String(data.userId ?? userId),
        questionId: data.questionId as string | undefined,
        questionText: data.questionText as string | undefined,
        optionSelected: data.optionSelected as string | undefined,
        taskCategory: data.taskCategory as string | undefined,
        taskNote: data.taskNote as string | undefined,
        taskText: data.taskText as string | undefined,
        taskCompleted: data.taskCompleted as boolean | undefined,
        createdAt: normalizeCreatedAt(data.createdAt),
      };
    })
  ).slice(0, limit);
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

  assertWormPayload(payload, 'children_logs');
  const ref = collection(db, FIRESTORE_COLLECTIONS.children_logs);
  const docRef = await addDoc(ref, withUserId(userId, payload));
  return docRef.id;
}

export async function saveMabraSession(
  userId: string,
  session: {
    exerciseType: 'breathing' | 'grounding' | 'reframing';
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

export async function getMabraProgress(userId: string): Promise<{ coreValues: string[] } | null> {
  const ref = doc(db, FIRESTORE_COLLECTIONS.mabra_progress, userId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  const data = snap.data();
  const coreValues = Array.isArray(data.coreValues)
    ? data.coreValues.filter((v): v is string => typeof v === 'string')
    : [];
  return { coreValues };
}

export async function saveMabraProgress(userId: string, coreValues: string[]) {
  const ref = doc(db, FIRESTORE_COLLECTIONS.mabra_progress, userId);
  await setDoc(
    ref,
    {
      userId,
      ownerId: userId,
      coreValues,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
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

export type MemoryAnchorRow = MemoryAnchor & { id: string };

export async function saveMemoryAnchor(userId: string, text: string) {
  const payload: FirestorePayload = { text: text.trim().slice(0, 280) };
  assertWormPayload(payload, 'memory_anchors');
  const ref = collection(db, FIRESTORE_COLLECTIONS.memory_anchors);
  const docRef = await addDoc(ref, withUserId(userId, payload));
  return docRef.id;
}

export async function getMemoryAnchors(userId: string): Promise<MemoryAnchorRow[]> {
  const ref = collection(db, FIRESTORE_COLLECTIONS.memory_anchors);
  const snap = await getDocs(ownerScopedQuery(ref, userId));
  return sortByCreatedAtDesc(
    snap.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        userId: String(data.userId ?? userId),
        ownerId: String(data.ownerId ?? userId),
        text: String(data.text ?? ''),
        createdAt: normalizeCreatedAt(data.createdAt),
      };
    }),
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

function mapKampsparDoc(
  d: { id: string; data: () => import('firebase/firestore').DocumentData },
  userId: string
): KampsparEntryRow {
  const data = d.data();
  return {
    id: d.id,
    userId: String(data.userId ?? userId),
    title: String(data.title ?? ''),
    content: String(data.content ?? ''),
    category: data.category ?? null,
    entryType: data.entryType ?? null,
    tags: Array.isArray(data.tags) ? data.tags.map(String) : undefined,
    source: data.source ?? undefined,
    eventDate: data.eventDate ?? null,
    embeddingDim: data.embeddingDim ?? null,
    createdAt: normalizeCreatedAt(data.createdAt),
  };
}

export async function getKampsparEntries(userId: string): Promise<KampsparEntryRow[]> {
  const ref = collection(db, FIRESTORE_COLLECTIONS.kampspar);
  const snap = await getDocs(ownerScopedQuery(ref, userId));
  return sortByCreatedAtDesc(snap.docs.map((d) => mapKampsparDoc(d, userId)));
}

/** G13 — live Tidshjulet: real-time kampspar listener (silo: kunskap only). */
export function subscribeKampsparEntries(
  userId: string,
  onData: (rows: KampsparEntryRow[]) => void,
  onError?: (err: Error) => void
): () => void {
  const ref = collection(db, FIRESTORE_COLLECTIONS.kampspar);
  return onSnapshot(
    ownerScopedQuery(ref, userId),
    (snap) => {
      const rows = sortByCreatedAtDesc(snap.docs.map((d) => mapKampsparDoc(d, userId)));
      onData(rows);
    },
    (err) => onError?.(err instanceof Error ? err : new Error(String(err)))
  );
}

export async function saveEconomyTransaction(
  userId: string,
  tx: { label: string; amountSek: number; category: 'veckopeng' | 'matlada' | 'vinst' | 'ovrigt' },
) {
  const payload: FirestorePayload = {
    label: tx.label,
    amountSek: tx.amountSek,
    category: tx.category,
  };
  assertWormPayload(payload, 'transactions');
  const ref = collection(db, FIRESTORE_COLLECTIONS.transactions);
  const docRef = await addDoc(ref, withUserId(userId, payload));
  return docRef.id;
}

export async function getEconomyTransactions(userId: string, limit = 30) {
  const ref = collection(db, FIRESTORE_COLLECTIONS.transactions);
  const snap = await getDocs(ownerScopedQuery(ref, userId));
  return sortByCreatedAtDesc(
    snap.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        label: String(data.label ?? ''),
        amountSek: Number(data.amountSek ?? 0),
        category: String(data.category ?? 'ovrigt'),
        createdAt: normalizeCreatedAt(data.createdAt),
      };
    }),
  ).slice(0, limit);
}

export async function getEconomyProfile(userId: string) {
  const ref = doc(db, FIRESTORE_COLLECTIONS.economy_profiles, userId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  const data = snap.data();
  return {
    weeklyBudgetSek: Number(data.weeklyBudgetSek ?? 0),
    mealBoxPresetSek: Number(data.mealBoxPresetSek ?? 85),
  };
}

export async function setEconomyProfile(
  userId: string,
  profile: { weeklyBudgetSek: number; mealBoxPresetSek: number },
) {
  const ref = doc(db, FIRESTORE_COLLECTIONS.economy_profiles, userId);
  await setDoc(
    ref,
    {
      userId,
      ownerId: userId,
      weeklyBudgetSek: profile.weeklyBudgetSek,
      mealBoxPresetSek: profile.mealBoxPresetSek,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
}
