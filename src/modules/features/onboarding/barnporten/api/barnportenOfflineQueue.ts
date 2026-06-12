import type { BarnportenLogKind } from './saveBarnportenLog';

const DB_NAME = 'livskompassen_barnporten_v1';
const STORE = 'pending_logs';
const DB_VERSION = 1;

export type PendingBarnportenLog = {
  id: string;
  userId: string;
  childAlias: string;
  observation: string;
  kind: BarnportenLogKind;
  contentType?: 'text' | 'voice' | 'mood' | 'step';
  urgent?: boolean;
  createdAt: number;
};

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onerror = () => reject(req.error ?? new Error('IndexedDB open failed'));
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: 'id' });
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
          if (result instanceof IDBRequest) resolve(result.result);
          else resolve(undefined);
        };
        tx.onerror = () => {
          db.close();
          reject(tx.error ?? new Error('IndexedDB transaction failed'));
        };
      }),
  );
}

function createId(): string {
  return `bp_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export async function enqueueBarnportenLog(
  entry: Omit<PendingBarnportenLog, 'id' | 'createdAt'>,
): Promise<PendingBarnportenLog> {
  const row: PendingBarnportenLog = {
    ...entry,
    id: createId(),
    createdAt: Date.now(),
  };
  await runTransaction('readwrite', (store) => store.put(row));
  return row;
}

export async function listPendingBarnportenLogs(userId: string): Promise<PendingBarnportenLog[]> {
  const all = ((await runTransaction<PendingBarnportenLog[]>('readonly', (store) => store.getAll())) ??
    []) as PendingBarnportenLog[];
  return all.filter((r) => r.userId === userId).sort((a, b) => a.createdAt - b.createdAt);
}

export async function removePendingBarnportenLog(id: string): Promise<void> {
  await runTransaction('readwrite', (store) => store.delete(id));
}

export async function pendingBarnportenCount(userId: string): Promise<number> {
  const rows = await listPendingBarnportenLogs(userId);
  return rows.length;
}

export async function clearAllPendingBarnportenLogs(): Promise<void> {
  await runTransaction('readwrite', (store) => store.clear());
}
