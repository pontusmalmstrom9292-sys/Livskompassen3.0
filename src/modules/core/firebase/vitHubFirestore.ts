import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from './firestore';
import { assertOfflineWriteAllowed } from './offlineWritePolicy';
import { FIRESTORE_COLLECTIONS } from '../types/firestore';
import type { VitEntry, VitEntryRow, VitHubDoc } from '../types/firestore';

type FirestorePayload = Record<string, unknown>;

const WORM_FORBIDDEN_KEYS = ['updatedAt', 'deletedAt', 'modifiedAt', 'revision'] as const;

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

function ownerScopedQuery(ref: ReturnType<typeof collection>, ownerId: string) {
  return query(ref, where('ownerId', '==', ownerId));
}

function normalizeCreatedAt(value: unknown): string {
  if (value && typeof value === 'object' && 'toDate' in value) {
    return (value as { toDate: () => Date }).toDate().toISOString();
  }
  if (typeof value === 'string') return value;
  return '';
}

function sortByCreatedAtDesc<T extends { createdAt?: string }>(rows: T[]): T[] {
  return [...rows].sort((a, b) => (b.createdAt ?? '').localeCompare(a.createdAt ?? ''));
}

function mapVitEntry(id: string, data: FirestorePayload, userId: string): VitEntryRow {
  return {
    id,
    userId: String(data.userId ?? userId),
    ownerId: String(data.ownerId ?? userId),
    projectId: String(data.projectId ?? ''),
    kind: data.kind as VitEntry['kind'],
    bankId: String(data.bankId ?? ''),
    content_class: data.content_class as VitEntry['content_class'],
    responseText: typeof data.responseText === 'string' ? data.responseText : undefined,
    cardDateKey: typeof data.cardDateKey === 'string' ? data.cardDateKey : undefined,
    createdAt: normalizeCreatedAt(data.createdAt),
  };
}

/** Skapar eller uppdaterar vit_hub — markerar aktivt projekt. */
export async function ensureVitHub(userId: string, projectId?: string): Promise<void> {
  assertOfflineWriteAllowed(FIRESTORE_COLLECTIONS.vit_hub);
  const ref = doc(db, FIRESTORE_COLLECTIONS.vit_hub, userId);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    await setDoc(ref, {
      userId,
      ownerId: userId,
      activeProjectIds: projectId ? [projectId] : [],
      updatedAt: serverTimestamp(),
    });
    return;
  }

  if (!projectId) return;

  const data = snap.data();
  const active = Array.isArray(data.activeProjectIds)
    ? data.activeProjectIds.filter((id): id is string => typeof id === 'string')
    : [];
  if (active.includes(projectId)) return;

  await updateDoc(ref, {
    activeProjectIds: [...active, projectId],
    updatedAt: serverTimestamp(),
  });
}

export async function getVitHub(userId: string): Promise<VitHubDoc | null> {
  const ref = doc(db, FIRESTORE_COLLECTIONS.vit_hub, userId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  const data = snap.data();
  return {
    userId: String(data.userId ?? userId),
    ownerId: String(data.ownerId ?? userId),
    activeProjectIds: Array.isArray(data.activeProjectIds)
      ? data.activeProjectIds.filter((id): id is string => typeof id === 'string')
      : undefined,
    updatedAt: data.updatedAt ? normalizeCreatedAt(data.updatedAt) : undefined,
  };
}

/** Append-only — sparar frågekort-svar i Vit-zonen. */
export async function saveVitEntry(
  userId: string,
  entry: Omit<VitEntry, 'userId' | 'ownerId' | 'createdAt'> & {
    zone?: 'mabra' | 'recovery';
    inputMode?: string;
  },
): Promise<string> {
  assertOfflineWriteAllowed(FIRESTORE_COLLECTIONS.vit_entries);
  const payload: FirestorePayload = {
    projectId: entry.projectId,
    kind: entry.kind,
    bankId: entry.bankId,
    content_class: entry.content_class,
  };
  if (entry.responseText?.trim()) {
    payload.responseText = entry.responseText.trim();
  }
  if (entry.cardDateKey) {
    payload.cardDateKey = entry.cardDateKey;
  }
  if (entry.zone) {
    payload.zone = entry.zone;
  }
  if (entry.inputMode) {
    payload.inputMode = entry.inputMode;
  }
  assertWormPayload(payload, 'vit_entries');
  const ref = collection(db, FIRESTORE_COLLECTIONS.vit_entries);
  const docRef = await addDoc(ref, withUserId(userId, payload));
  return docRef.id;
}

export async function listVitEntries(
  userId: string,
  options?: { projectId?: string; limit?: number },
): Promise<VitEntryRow[]> {
  const ref = collection(db, FIRESTORE_COLLECTIONS.vit_entries);
  const snap = await getDocs(ownerScopedQuery(ref, userId));
  let rows = sortByCreatedAtDesc(snap.docs.map((d) => mapVitEntry(d.id, d.data(), userId)));
  if (options?.projectId) {
    rows = rows.filter((row) => row.projectId === options.projectId);
  }
  return rows.slice(0, options?.limit ?? 50);
}
