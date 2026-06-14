import type { ChildAlias, LivsloggCategory } from '@/features/family/children/constants';

const DB_NAME = 'livskompassen_action_dashboard_v1';
const STORE = 'pending_actions';
const DB_VERSION = 1;

export type PendingVaultReflection = {
  kind: 'vault_reflection';
  text: string;
};

export type PendingChildLog = {
  kind: 'child_log';
  childAlias: ChildAlias;
  category: LivsloggCategory;
  observation: string;
  contentType?: 'text' | 'voice' | 'image';
  photoMimeType?: string;
  photoFileName?: string;
  photoData?: ArrayBuffer;
};

export type PendingVaultRecording = {
  kind: 'vault_recording';
  transcript: string;
  recordedAtIso: string;
  durationSeconds?: number;
  audioMimeType: string;
  audioFileName: string;
  audioData: ArrayBuffer;
};

type PendingActionDashboardBase = {
  id: string;
  userId: string;
  createdAt: number;
};

export type PendingActionDashboardItem =
  | (PendingActionDashboardBase & PendingVaultReflection)
  | (PendingActionDashboardBase & PendingChildLog)
  | (PendingActionDashboardBase & PendingVaultRecording);

export type PendingActionDashboardEnqueue =
  | ({ userId: string } & PendingVaultReflection)
  | ({ userId: string } & PendingChildLog)
  | ({ userId: string } & PendingVaultRecording);

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
  return `ad_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export async function enqueueActionDashboardItem(
  entry: PendingActionDashboardEnqueue,
): Promise<PendingActionDashboardItem> {
  const row: PendingActionDashboardItem = {
    ...entry,
    id: createId(),
    createdAt: Date.now(),
  };
  await runTransaction('readwrite', (store) => store.put(row));
  return row;
}

export async function listPendingActionDashboardItems(
  userId: string,
): Promise<PendingActionDashboardItem[]> {
  const all = ((await runTransaction<PendingActionDashboardItem[]>('readonly', (store) =>
    store.getAll(),
  )) ?? []) as PendingActionDashboardItem[];
  return all.filter((r) => r.userId === userId).sort((a, b) => a.createdAt - b.createdAt);
}

export async function removePendingActionDashboardItem(id: string): Promise<void> {
  await runTransaction('readwrite', (store) => store.delete(id));
}

export async function pendingActionDashboardCount(userId: string): Promise<number> {
  const rows = await listPendingActionDashboardItems(userId);
  return rows.length;
}

export async function clearAllPendingActionDashboardItems(): Promise<void> {
  await runTransaction('readwrite', (store) => store.clear());
}

export async function clearPendingActionDashboardItemsForUser(userId: string): Promise<void> {
  const rows = await listPendingActionDashboardItems(userId);
  await Promise.all(rows.map((row) => removePendingActionDashboardItem(row.id)));
}
