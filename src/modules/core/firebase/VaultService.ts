import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  where,
} from 'firebase/firestore';
import { db, saveVaultLog, assertArchitectureWrite } from './firestore';
import { FIRESTORE_COLLECTIONS } from '../types/firestore';
import type { VaultLog } from '../types/firestore';

export interface VaultRecord {
  id: string;
  content: string;
  timestamp: Date;
  ownerId: string;
}

/**
 * Shape returned by `getVaultHistory` / `initializeVaultListener`.
 * Carries all VaultLog fields (except userId) plus a string-normalised createdAt
 * and legacy display-only fields that some older entries may have.
 */
export type VaultHistoryEntry = Partial<Omit<VaultLog, 'userId' | 'createdAt'>> & {
  id: string;
  createdAt?: string;
  /** Legacy text field used by older entries. */
  content?: string;
  text?: string;
  observation?: string;
  label?: string;
  /** Raw Firestore timestamp before normalisation (used by some callers). */
  timestamp?: Date | string | { toDate?: () => Date };
  source?: string;
  confidence?: number;
};

/**
 * Normalises the date of a VaultHistoryEntry to a `Date` object.
 * Handles the three timestamp shapes that may appear in stored entries:
 * 1. `createdAt` — ISO string (normalised by getVaultHistory / initializeVaultListener)
 * 2. `timestamp` — legacy raw Firestore Timestamp (object with `.toDate()`)
 * 3. `timestamp` — plain Date or ISO string from older entries
 */
export function getVaultEntryDate(entry: VaultHistoryEntry): Date {
  if (entry.createdAt) {
    return new Date(entry.createdAt);
  }
  const ts = entry.timestamp;
  if (ts == null) return new Date();
  if (ts instanceof Date) return ts;
  if (typeof ts === 'object' && typeof ts.toDate === 'function') return ts.toDate();
  if (typeof ts === 'string') return new Date(ts);
  return new Date();
}

/** Legacy inkast/triage — `content`/`source` mappas till `truth`/`action` om saknas. */
export type VaultSaveRecordInput = {
  content?: string;
  source?: string;
} & Partial<Omit<VaultLog, 'userId' | 'ownerId' | 'createdAt'>>;

const VAULT_LOG_OPTIONAL_KEYS = [
  'sourceRef',
  'childrenImpact',
  'evidenceUrl',
  'biffUsed',
  'theirVersion',
  'myReality',
  'bodySignals',
  'shieldWhat',
  'shieldFeeling',
  'shieldBoundary',
  'pinned',
] as const;

const WORM_FORBIDDEN_KEYS = ['updatedAt', 'deletedAt', 'modifiedAt', 'revision'] as const;

function assertClientWormPayload(data: Record<string, unknown>, context: string): void {
  for (const key of WORM_FORBIDDEN_KEYS) {
    if (key in data) {
      throw new Error(`WORM violation (${context}): field "${key}" is not allowed on create.`);
    }
  }
}

function normalizeVaultSaveInput(
  data: VaultSaveRecordInput,
): Omit<VaultLog, 'userId' | 'createdAt'> {
  const truth = (data.truth ?? data.content ?? '').trim();
  if (!truth) {
    throw new Error('Valv-post kräver text.');
  }

  const sourceTag = (data.source ?? 'manual').trim().slice(0, 48) || 'manual';
  const action = (data.action ?? `inkast_${sourceTag}`).trim().slice(0, 200);
  if (!action) {
    throw new Error('Valv-post kräver action.');
  }

  const payload: Omit<VaultLog, 'userId' | 'createdAt'> = {
    action,
    truth,
    isLocked: true,
    entryType: data.entryType ?? 'simple',
  };

  if (data.category) {
    payload.category = data.category;
  } else if (data.source) {
    payload.category = sourceTag;
  }

  const optionalKeys = VAULT_LOG_OPTIONAL_KEYS;

  for (const key of optionalKeys) {
    const value = data[key];
    if (value !== undefined) {
      (payload as Record<string, unknown>)[key] = value;
    }
  }

  assertClientWormPayload(payload as Record<string, unknown>, 'VaultService.saveRecord');
  return payload;
}

export class VaultService {
  private static COLLECTION_NAME = FIRESTORE_COLLECTIONS.reality_vault;

  /**
   * Skapar WORM-post i reality_vault via saveVaultLog (offline-block + vault-gate).
   * Custom doc-id stöds inte — append-only addDoc.
   */
  static async saveVaultEntry(entry: VaultRecord): Promise<void> {
    const truth = entry.content?.trim();
    if (!truth) {
      throw new Error('Valv-post kräver text.');
    }
    await this.saveRecord(entry.ownerId, { 
      content: truth, 
      action: 'vault_record' 
    });
  }

  /**
   * Hämtar en befintlig post från vault-samlingen (legacy read-shape).
   */
  static async getVaultEntry(id: string): Promise<VaultRecord | null> {
    const docRef = doc(db, this.COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return null;
    }

    const data = docSnap.data();
    const content =
      typeof data.truth === 'string'
        ? data.truth
        : typeof data.content === 'string'
          ? data.content
          : '';
    const timestampRaw = data.createdAt ?? data.timestamp;
    const timestamp =
      timestampRaw && typeof timestampRaw === 'object' && 'toDate' in timestampRaw
        ? (timestampRaw as { toDate: () => Date }).toDate()
        : new Date(String(timestampRaw ?? Date.now()));

    return {
      id: docSnap.id,
      content,
      timestamp,
      ownerId: String(data.ownerId ?? ''),
    };
  }

  /**
   * Säker WORM-skrivning — delegerar till saveVaultLog:
   * offline-block, vault-gate/WebAuthn, kanoniskt action/truth-schema.
   */
  static async saveRecord(userId: string, data: VaultSaveRecordInput): Promise<string> {
    assertArchitectureWrite(this.COLLECTION_NAME, 'create');
    return saveVaultLog(userId, normalizeVaultSaveInput(data));
  }

  static async getVaultHistory(userId: string): Promise<VaultHistoryEntry[]> {
    const ref = collection(db, this.COLLECTION_NAME);
    const q = query(
      ref,
      where('ownerId', '==', userId),
      orderBy('createdAt', 'desc'),
    );

    const snap = await getDocs(q);
    return snap.docs.map((d) => {
      const row = d.data();
      return {
        id: d.id,
        ...row,
        createdAt: row.createdAt?.toDate ? row.createdAt.toDate().toISOString() : row.createdAt,
      } as VaultHistoryEntry;
    });
  }

  static initializeVaultListener(userId: string, onUpdate: (records: VaultHistoryEntry[]) => void): () => void {
    const ref = collection(db, this.COLLECTION_NAME);
    const q = query(
      ref,
      where('ownerId', '==', userId),
      orderBy('createdAt', 'desc'),
    );

    return onSnapshot(
      q,
      (snap) => {
        const records: VaultHistoryEntry[] = snap.docs.map((d) => {
          const row = d.data();
          return {
            id: d.id,
            ...row,
            createdAt: row.createdAt?.toDate ? row.createdAt.toDate().toISOString() : row.createdAt,
          } as VaultHistoryEntry;
        });
        onUpdate(records);
      },
      (error) => {
        console.error('Vault listener error:', error);
      },
    );
  }
}
