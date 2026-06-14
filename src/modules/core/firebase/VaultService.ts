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
import { db, saveVaultLog } from './firestore';
import { FIRESTORE_COLLECTIONS } from '../types/firestore';
import type { VaultLog } from '../types/firestore';

export interface VaultRecord {
  id: string;
  content: string;
  timestamp: Date;
  ownerId: string;
}

/** Legacy inkast/triage — `content`/`source` mappas till `truth`/`action` om saknas. */
export type VaultSaveRecordInput = {
  content?: string;
  source?: string;
} & Partial<Omit<VaultLog, 'userId' | 'ownerId' | 'createdAt'>>;

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

  const optionalKeys = [
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

  for (const key of optionalKeys) {
    const value = data[key];
    if (value !== undefined) {
      (payload as Record<string, unknown>)[key] = value;
    }
  }

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
    await saveVaultLog(entry.ownerId, {
      action: 'vault_record',
      truth,
      entryType: 'simple',
      isLocked: true,
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
    return saveVaultLog(userId, normalizeVaultSaveInput(data));
  }

  static async getVaultHistory(userId: string): Promise<any[]> {
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
      };
    });
  }

  static initializeVaultListener(userId: string, onUpdate: (records: any[]) => void): () => void {
    const ref = collection(db, this.COLLECTION_NAME);
    const q = query(
      ref,
      where('ownerId', '==', userId),
      orderBy('createdAt', 'desc'),
    );

    return onSnapshot(
      q,
      (snap) => {
        const records = snap.docs.map((d) => {
          const row = d.data();
          return {
            id: d.id,
            ...row,
            createdAt: row.createdAt?.toDate ? row.createdAt.toDate().toISOString() : row.createdAt,
          };
        });
        onUpdate(records);
      },
      (error) => {
        console.error('Vault listener error:', error);
      },
    );
  }
}
