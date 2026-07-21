/**
 * WidgetCache — local-first storage for Companion OS (WIDGET_BIBLE 3.4 / UX Law 10).
 * Memory Map for 0 ms UI reads; IndexedDB for crash-safe durability.
 * Never blocks UI on network.
 */

const DB_NAME = 'livskompassen_companion_widgets_v1';
const STORE_STATE = 'widget_state';
const STORE_QUEUE = 'sync_queue';
const DB_VERSION = 1;
const MEMORY_KEY_PREFIX = 'cw:';

export type WidgetCacheScope = 'state' | 'queue';

export type WidgetCachedRecord<T = unknown> = {
  key: string;
  value: T;
  updatedAt: number;
  /** Soft TTL; expired entries remain until overwritten (offline safety). */
  expiresAt?: number;
};

export type WidgetSyncQueueItem = {
  id: string;
  createdAt: number;
  /** Routing tag — bible 4.3 */
  type: string;
  source: string;
  payload: unknown;
  attempts: number;
  lastError?: string;
};

type CacheListener = (key: string) => void;

const memory = new Map<string, WidgetCachedRecord>();
const listeners = new Set<CacheListener>();

let dbPromise: Promise<IDBDatabase> | null = null;
let hydratePromise: Promise<void> | null = null;

function memKey(key: string): string {
  return `${MEMORY_KEY_PREFIX}${key}`;
}

function openDb(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise;
  if (typeof indexedDB === 'undefined') {
    return Promise.reject(new Error('IndexedDB unavailable'));
  }
  dbPromise = new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onerror = () => {
      dbPromise = null;
      reject(req.error ?? new Error('WidgetCache IndexedDB open failed'));
    };
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_STATE)) {
        db.createObjectStore(STORE_STATE, { keyPath: 'key' });
      }
      if (!db.objectStoreNames.contains(STORE_QUEUE)) {
        db.createObjectStore(STORE_QUEUE, { keyPath: 'id' });
      }
    };
    req.onsuccess = () => resolve(req.result);
  });
  return dbPromise;
}

function runStore<T>(
  storeName: string,
  mode: IDBTransactionMode,
  fn: (store: IDBObjectStore) => IDBRequest<T> | void,
): Promise<T | void> {
  return openDb().then(
    (db) =>
      new Promise((resolve, reject) => {
        const tx = db.transaction(storeName, mode);
        const store = tx.objectStore(storeName);
        const result = fn(store);
        tx.oncomplete = () => {
          if (result instanceof IDBRequest) resolve(result.result);
          else resolve(undefined);
        };
        tx.onerror = () => reject(tx.error ?? new Error('WidgetCache transaction failed'));
      }),
  );
}

function notify(key: string): void {
  listeners.forEach((fn) => {
    try {
      fn(key);
    } catch {
      /* listeners must not break cache */
    }
  });
}

function createId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return `cw_${crypto.randomUUID()}`;
  }
  return `cw_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

/**
 * Hydrate memory from IndexedDB once. Safe to call repeatedly.
 * UI may read before hydrate completes — returns undefined until ready.
 */
export function hydrateWidgetCache(): Promise<void> {
  if (hydratePromise) return hydratePromise;
  hydratePromise = (async () => {
    try {
      const rows = (await runStore<WidgetCachedRecord[]>(STORE_STATE, 'readonly', (store) =>
        store.getAll(),
      )) as WidgetCachedRecord[] | void;
      if (!rows) return;
      for (const row of rows) {
        memory.set(memKey(row.key), row);
      }
    } catch {
      /* offline / private mode — memory-only still works for session */
      hydratePromise = null;
    }
  })();
  return hydratePromise;
}

/** Synchronous 0 ms read from memory mirror. */
export function getCached<T = unknown>(key: string): T | undefined {
  const row = memory.get(memKey(key));
  if (!row) return undefined;
  return row.value as T;
}

export function getCachedRecord<T = unknown>(key: string): WidgetCachedRecord<T> | undefined {
  return memory.get(memKey(key)) as WidgetCachedRecord<T> | undefined;
}

/**
 * Write-through: memory first (UI immediate), then durable store.
 * Never awaits network.
 */
export async function setCached<T>(
  key: string,
  value: T,
  opts?: { expiresAt?: number },
): Promise<WidgetCachedRecord<T>> {
  const record: WidgetCachedRecord<T> = {
    key,
    value,
    updatedAt: Date.now(),
    expiresAt: opts?.expiresAt,
  };
  memory.set(memKey(key), record as WidgetCachedRecord);
  notify(key);
  try {
    await runStore(STORE_STATE, 'readwrite', (store) => store.put(record));
  } catch {
    /* memory already updated — durable write retried on next set */
  }
  return record;
}

export async function removeCached(key: string): Promise<void> {
  memory.delete(memKey(key));
  notify(key);
  try {
    await runStore(STORE_STATE, 'readwrite', (store) => store.delete(key));
  } catch {
    /* ignore */
  }
}

export function subscribeWidgetCache(listener: CacheListener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Enqueue offline action — crash-safe (bible 3.4). */
export async function enqueueSyncItem(
  input: Omit<WidgetSyncQueueItem, 'id' | 'createdAt' | 'attempts'>,
): Promise<WidgetSyncQueueItem> {
  const item: WidgetSyncQueueItem = {
    ...input,
    id: createId(),
    createdAt: Date.now(),
    attempts: 0,
  };
  try {
    await runStore(STORE_QUEUE, 'readwrite', (store) => store.put(item));
  } catch {
    /* fall through — still expose item for in-session flush */
  }
  memory.set(memKey(`queue:${item.id}`), {
    key: `queue:${item.id}`,
    value: item,
    updatedAt: item.createdAt,
  });
  notify(`queue:${item.id}`);
  return item;
}

export async function listSyncQueue(): Promise<WidgetSyncQueueItem[]> {
  try {
    const rows = (await runStore<WidgetSyncQueueItem[]>(STORE_QUEUE, 'readonly', (store) =>
      store.getAll(),
    )) as WidgetSyncQueueItem[] | void;
    if (rows && rows.length > 0) {
      return rows.slice().sort((a, b) => a.createdAt - b.createdAt);
    }
  } catch {
    /* memory fallback */
  }
  const fromMemory: WidgetSyncQueueItem[] = [];
  memory.forEach((row, k) => {
    if (k.startsWith(`${MEMORY_KEY_PREFIX}queue:`)) {
      fromMemory.push(row.value as WidgetSyncQueueItem);
    }
  });
  return fromMemory.sort((a, b) => a.createdAt - b.createdAt);
}

export async function removeSyncItem(id: string): Promise<void> {
  memory.delete(memKey(`queue:${id}`));
  notify(`queue:${id}`);
  try {
    await runStore(STORE_QUEUE, 'readwrite', (store) => store.delete(id));
  } catch {
    /* ignore */
  }
}

export async function markSyncAttempt(id: string, error?: string): Promise<void> {
  const items = await listSyncQueue();
  const found = items.find((i) => i.id === id);
  if (!found) return;
  const next: WidgetSyncQueueItem = {
    ...found,
    attempts: found.attempts + 1,
    lastError: error,
  };
  memory.set(memKey(`queue:${id}`), {
    key: `queue:${id}`,
    value: next,
    updatedAt: Date.now(),
  });
  try {
    await runStore(STORE_QUEUE, 'readwrite', (store) => store.put(next));
  } catch {
    /* ignore */
  }
}

/** Zero Footprint helper — clear session memory (does not wipe durable queue). */
export function clearWidgetCacheMemory(): void {
  memory.clear();
}
