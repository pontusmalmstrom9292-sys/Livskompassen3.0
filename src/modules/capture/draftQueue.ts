import type { SubmitInkastLiteResult } from '../inkast/api/inkastService';

const DB_NAME = 'livskompassen_capture_v1';
const STORE = 'drafts';
const DB_VERSION = 1;

export type DraftStatus = 'pending' | 'synced' | 'review' | 'failed';

export type CaptureDraft = {
  id: string;
  text: string;
  fileName?: string;
  status: DraftStatus;
  createdAt: number;
  updatedAt: number;
  sourceModule?: string;
  errorMessage?: string;
  syncResult?: SubmitInkastLiteResult;
};

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onerror = () => reject(req.error ?? new Error('IndexedDB open failed'));
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) {
        const store = db.createObjectStore(STORE, { keyPath: 'id' });
        store.createIndex('status', 'status', { unique: false });
        store.createIndex('updatedAt', 'updatedAt', { unique: false });
      }
    };
    req.onsuccess = () => resolve(req.result);
  });
}

function runTransaction<T>(
  mode: IDBTransactionMode,
  fn: (store: IDBObjectStore) => IDBRequest<T> | void,
): Promise<T | void> {
  return openDb().then(
    (db) =>
      new Promise((resolve, reject) => {
        const tx = db.transaction(STORE, mode);
        const store = tx.objectStore(STORE);
        const result = fn(store);
        tx.oncomplete = () => {
          db.close();
          if (result instanceof IDBRequest) {
            resolve(result.result);
          } else {
            resolve(undefined);
          }
        };
        tx.onerror = () => {
          db.close();
          reject(tx.error ?? new Error('IndexedDB transaction failed'));
        };
      }),
  );
}

export function createDraftId(): string {
  return `draft_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export async function saveDraft(draft: CaptureDraft): Promise<void> {
  await runTransaction('readwrite', (store) => store.put(draft));
}

export async function addPendingDraft(input: {
  text: string;
  fileName?: string;
  sourceModule?: string;
}): Promise<CaptureDraft> {
  const now = Date.now();
  const draft: CaptureDraft = {
    id: createDraftId(),
    text: input.text.trim(),
    fileName: input.fileName,
    status: 'pending',
    createdAt: now,
    updatedAt: now,
    sourceModule: input.sourceModule,
  };
  await saveDraft(draft);
  return draft;
}

export async function listDrafts(limit = 50): Promise<CaptureDraft[]> {
  const rows = (await runTransaction('readonly', (store) => store.getAll())) as
    | CaptureDraft[]
    | undefined;
  const all = rows ?? [];
  return all.sort((a, b) => b.updatedAt - a.updatedAt).slice(0, limit);
}

export async function listDraftsByStatus(status: DraftStatus): Promise<CaptureDraft[]> {
  const all = await listDrafts(200);
  return all.filter((d) => d.status === status);
}

export async function updateDraftStatus(
  id: string,
  patch: Partial<Pick<CaptureDraft, 'status' | 'syncResult' | 'errorMessage'>>,
): Promise<void> {
  const rows = (await runTransaction('readonly', (store) => store.get(id))) as
    | CaptureDraft
    | undefined;
  if (!rows) return;
  const next: CaptureDraft = {
    ...rows,
    ...patch,
    updatedAt: Date.now(),
  };
  await saveDraft(next);
}

export async function deleteDraft(id: string): Promise<void> {
  await runTransaction('readwrite', (store) => store.delete(id));
}

/** Rensa alla lokala capture-utkast (Device Clear). */
export async function clearAllDrafts(): Promise<void> {
  await runTransaction('readwrite', (store) => store.clear());
}
