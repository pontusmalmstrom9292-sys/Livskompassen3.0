import {
  addDoc,
  collection,
  getDocs,
  query,
  serverTimestamp,
  where,
} from 'firebase/firestore';
import { FIRESTORE_COLLECTIONS } from '../types/firestore';
import type {
  EmotionalMemoryEntry,
  EmotionalMemoryRow,
  EmotionalMemoryType,
} from '../types/firestore';
import { assertArchitectureWrite, db } from './firestore';
import { assertOfflineWriteAllowed } from './offlineWritePolicy';

type FirestorePayload = Record<string, unknown>;

const WORM_FORBIDDEN_KEYS = ['updatedAt', 'deletedAt', 'modifiedAt', 'revision'] as const;

const VALID_MEMORY_TYPES = new Set<EmotionalMemoryType>([
  'identity',
  'feeling',
  'reflection',
  'freeform',
]);

/** Must match firestore.rules → isValidEmotionalMemoryCreate → wormKeysOnly. */
export const EMOTIONAL_MEMORY_WORM_KEYS = [
  'userId',
  'ownerId',
  'createdAt',
  'memoryType',
  'content',
  'intensity',
] as const;

function isEmotionalMemoryType(value: unknown): value is EmotionalMemoryType {
  return typeof value === 'string' && VALID_MEMORY_TYPES.has(value as EmotionalMemoryType);
}

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

function mapEmotionalMemory(id: string, data: FirestorePayload, userId: string): EmotionalMemoryRow {
  const memoryType = isEmotionalMemoryType(data.memoryType) ? data.memoryType : 'freeform';
  return {
    id,
    userId: String(data.userId ?? userId),
    ownerId: String(data.ownerId ?? userId),
    memoryType,
    content: String(data.content ?? ''),
    intensity: typeof data.intensity === 'number' ? data.intensity : 0,
    createdAt: normalizeCreatedAt(data.createdAt),
  };
}

function clampIntensity(value: number): number {
  return Math.min(10, Math.max(1, Math.round(value)));
}

/** Append-only — sparar känslominne (WORM). */
export async function saveEmotionalMemory(
  userId: string,
  entry: Omit<EmotionalMemoryEntry, 'userId' | 'ownerId' | 'createdAt'>,
): Promise<string> {
  assertOfflineWriteAllowed(FIRESTORE_COLLECTIONS.emotional_memory);

  const content = entry.content.trim();
  if (!content) {
    throw new Error('Emotional memory content must not be empty.');
  }
  if (!VALID_MEMORY_TYPES.has(entry.memoryType)) {
    throw new Error(`Invalid memoryType: ${entry.memoryType}`);
  }

  const payload: FirestorePayload = {
    memoryType: entry.memoryType,
    content,
    intensity: clampIntensity(entry.intensity),
  };

  assertWormPayload(payload, FIRESTORE_COLLECTIONS.emotional_memory);
  assertArchitectureWrite(FIRESTORE_COLLECTIONS.emotional_memory, 'create');

  const ref = collection(db, FIRESTORE_COLLECTIONS.emotional_memory);
  const docRef = await addDoc(ref, withUserId(userId, payload));
  return docRef.id;
}

export async function listEmotionalMemories(
  userId: string,
  options?: { memoryType?: EmotionalMemoryType; limit?: number },
): Promise<EmotionalMemoryRow[]> {
  const ref = collection(db, FIRESTORE_COLLECTIONS.emotional_memory);
  const snap = await getDocs(ownerScopedQuery(ref, userId));
  let rows = sortByCreatedAtDesc(snap.docs.map((d) => mapEmotionalMemory(d.id, d.data(), userId)));

  if (options?.memoryType) {
    rows = rows.filter((row) => row.memoryType === options.memoryType);
  }

  return rows.slice(0, options?.limit ?? 50);
}
