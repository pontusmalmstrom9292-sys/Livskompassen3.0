/**
 * WidgetSync — offline queue flush (WIDGET_BIBLE 3.4 / 3.6).
 * NO continuous background services. Flush only on:
 * - online event
 * - document became visible
 * - after enqueue (single idle tick)
 * Never polls on an interval.
 */

import {
  enqueueSyncItem,
  hydrateWidgetCache,
  listSyncQueue,
  markSyncAttempt,
  removeSyncItem,
  type WidgetSyncQueueItem,
} from './WidgetCache';
import {
  clearNativeWidgetQueueKey,
  NATIVE_WIDGET_QUEUE_KEYS,
  pullNativeWidgetQueues,
} from './companionWidgetBridge';

export type WidgetSyncTransport = (item: WidgetSyncQueueItem) => Promise<void>;

export type WidgetSyncStatus = {
  pending: number;
  lastFlushAt: number | null;
  lastError: string | null;
  flushing: boolean;
};

type StatusListener = (status: WidgetSyncStatus) => void;

const statusListeners = new Set<StatusListener>();

let transport: WidgetSyncTransport | null = null;
let flushing = false;
let lastFlushAt: number | null = null;
let lastError: string | null = null;
let flushScheduled = false;
let listenersBound = false;

function getStatus(pending: number): WidgetSyncStatus {
  return {
    pending,
    lastFlushAt,
    lastError,
    flushing,
  };
}

async function emitStatus(): Promise<void> {
  const pending = (await listSyncQueue()).length;
  const snapshot = getStatus(pending);
  statusListeners.forEach((fn) => {
    try {
      fn(snapshot);
    } catch {
      /* ignore */
    }
  });
}

function isOnline(): boolean {
  if (typeof navigator === 'undefined') return true;
  return navigator.onLine !== false;
}

/**
 * Register the single transport (e.g. Firestore callable / Inkast writer).
 * Replacing transport is allowed; only one active at a time.
 */
export function setWidgetSyncTransport(next: WidgetSyncTransport | null): void {
  transport = next;
}

export function subscribeWidgetSyncStatus(listener: StatusListener): () => void {
  statusListeners.add(listener);
  void emitStatus();
  return () => statusListeners.delete(listener);
}

/**
 * Enqueue capture/action for later sync — bible 4.3 tags.
 * Schedules at most one idle flush; never starts a background loop.
 */
export async function queueWidgetSync(input: {
  type: string;
  source: string;
  payload: unknown;
}): Promise<WidgetSyncQueueItem> {
  await hydrateWidgetCache();
  const item = await enqueueSyncItem({
    type: input.type,
    source: input.source,
    payload: input.payload,
  });
  scheduleFlush();
  void emitStatus();
  return item;
}

function scheduleFlush(): void {
  if (flushScheduled) return;
  flushScheduled = true;

  const run = () => {
    flushScheduled = false;
    void flushWidgetSyncQueue();
  };

  if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
    (
      window as Window & {
        requestIdleCallback: (cb: () => void, opts?: { timeout: number }) => number;
      }
    ).requestIdleCallback(run, { timeout: 2500 });
    return;
  }

  if (typeof queueMicrotask === 'function') {
    queueMicrotask(run);
    return;
  }

  setTimeout(run, 0);
}

/**
 * Process durable queue once. Safe to call often; concurrent calls coalesce.
 * Skips entirely when offline or when no transport is registered.
 * Also pulls native WIS overlay queues into the durable queue (background sync).
 */
export async function flushWidgetSyncQueue(): Promise<{ flushed: number; failed: number }> {
  if (flushing) return { flushed: 0, failed: 0 };

  await ingestNativeWidgetQueues();

  if (!transport) return { flushed: 0, failed: 0 };
  if (!isOnline()) return { flushed: 0, failed: 0 };

  flushing = true;
  void emitStatus();

  let flushed = 0;
  let failed = 0;

  try {
    await hydrateWidgetCache();
    const items = await listSyncQueue();
    for (const item of items) {
      if (!isOnline() || !transport) break;
      try {
        await transport(item);
        await removeSyncItem(item.id);
        flushed += 1;
      } catch (err) {
        failed += 1;
        lastError = err instanceof Error ? err.message : 'sync_failed';
        await markSyncAttempt(item.id, lastError);
      }
    }
    lastFlushAt = Date.now();
    if (failed === 0) lastError = null;
  } finally {
    flushing = false;
    void emitStatus();
  }

  return { flushed, failed };
}

/** Move native SecurePrefs WIS drafts into IndexedDB sync queue (no UI). */
async function ingestNativeWidgetQueues(): Promise<void> {
  const snapshot = pullNativeWidgetQueues();
  for (const key of NATIVE_WIDGET_QUEUE_KEYS) {
    const raw = snapshot[key];
    if (!raw || !raw.trim()) continue;
    const type = key.replace(/^widget_(queue|draft)_/, 'native_');
    await enqueueSyncItem({
      type,
      source: 'android_wis',
      payload: { key, raw },
    });
    clearNativeWidgetQueueKey(key);
  }
}

/**
 * Bind OS events once — online + visibility. No timers while idle.
 * Call from WidgetFramework bootstrap.
 */
export function bindWidgetSyncLifecycle(): () => void {
  if (typeof window === 'undefined') return () => undefined;
  if (listenersBound) return () => undefined;
  listenersBound = true;

  const onOnline = () => scheduleFlush();
  const onVisibility = () => {
    if (document.visibilityState === 'visible') scheduleFlush();
  };

  window.addEventListener('online', onOnline);
  document.addEventListener('visibilitychange', onVisibility);

  return () => {
    window.removeEventListener('online', onOnline);
    document.removeEventListener('visibilitychange', onVisibility);
    listenersBound = false;
  };
}

export function getWidgetSyncSnapshot(): Promise<WidgetSyncStatus> {
  return listSyncQueue().then((q) => getStatus(q.length));
}
