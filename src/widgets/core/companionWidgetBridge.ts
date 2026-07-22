/**
 * Push short status to Android home-screen widgets via native bridge.
 * Debounced — avoids chip flicker on rapid taps. No-op on web.
 *
 * Always writes global `last_action` (Record + fallback).
 * Optional `scope` also writes `last_action_${scope}` for that Companion chip only.
 *
 * WIS: also pull native overlay queues (widget_queue_*) for background sync without opening UI.
 */

import { getLivskompassenNative } from '@/shared/utils/nativeSecureDownload';

const KEY_LAST_ACTION = 'last_action';
const DEBOUNCE_MS = 280;

/** Android Companion chip scopes (must match WidgetUpdateManager / WidgetViews). */
export type CompanionAndroidScope =
  | 'capture'
  | 'inbox'
  | 'note'
  | 'harbor'
  | 'compass'
  | 'child'
  | 'beacon'
  | 'journal'
  | 'anchor'
  | 'tasks';

/** SecurePrefs keys written by WidgetOverlayActivity / WidgetActionReceiver. */
export const NATIVE_WIDGET_QUEUE_KEYS = [
  'widget_queue_note',
  'widget_queue_inbox',
  'widget_queue_journal',
  'widget_queue_mood',
  'widget_queue_capture',
  'widget_draft_note',
  'widget_draft_intention',
  'widget_draft_child',
  'widget_draft_beacon',
] as const;

export type NativeWidgetQueueSnapshot = Partial<
  Record<(typeof NATIVE_WIDGET_QUEUE_KEYS)[number], string>
>;

let pendingTimer: ReturnType<typeof setTimeout> | null = null;
let pendingMessage: string | null = null;
let pendingScope: CompanionAndroidScope | undefined;
const lastSent: Record<string, string> = {};

function sendNow(message: string, scope?: CompanionAndroidScope): void {
  try {
    const native = getLivskompassenNative();
    const trimmed = message.trim().slice(0, 48);
    if (!trimmed) return;
    const keys = scope
      ? [KEY_LAST_ACTION, `${KEY_LAST_ACTION}_${scope}`]
      : [KEY_LAST_ACTION];
    for (const key of keys) {
      if (lastSent[key] === trimmed) continue;
      lastSent[key] = trimmed;
      native?.setWidgetData?.(key, trimmed);
    }
  } catch {
    /* bridge optional */
  }
}

export function pushCompanionWidgetStatus(
  message: string,
  scope?: CompanionAndroidScope,
): void {
  const trimmed = message.trim();
  if (!trimmed) return;
  pendingMessage = trimmed;
  pendingScope = scope;
  if (pendingTimer != null) return;
  pendingTimer = setTimeout(() => {
    pendingTimer = null;
    const next = pendingMessage;
    const nextScope = pendingScope;
    pendingMessage = null;
    pendingScope = undefined;
    if (next) sendNow(next, nextScope);
  }, DEBOUNCE_MS);
}

/** Flush pending status immediately (e.g. before navigation). */
export function flushCompanionWidgetStatus(): void {
  if (pendingTimer != null) {
    clearTimeout(pendingTimer);
    pendingTimer = null;
  }
  if (pendingMessage) {
    const next = pendingMessage;
    const nextScope = pendingScope;
    pendingMessage = null;
    pendingScope = undefined;
    sendNow(next, nextScope);
  }
}

/**
 * Pull native WIS drafts/queues written by overlay/receiver (background sync).
 * Returns empty object on web or when bridge lacks getWidgetData.
 */
export function pullNativeWidgetQueues(): NativeWidgetQueueSnapshot {
  const out: NativeWidgetQueueSnapshot = {};
  try {
    const native = getLivskompassenNative() as
      | (ReturnType<typeof getLivskompassenNative> & {
          getWidgetData?: (key: string) => string;
        })
      | null;
    const get = native?.getWidgetData;
    if (typeof get !== 'function') return out;
    for (const key of NATIVE_WIDGET_QUEUE_KEYS) {
      const value = get.call(native, key);
      if (typeof value === 'string' && value.trim()) {
        out[key] = value;
      }
    }
  } catch {
    /* bridge optional */
  }
  return out;
}

/** Clear a native queue key after web has enqueued it into WidgetCache/WidgetSync. */
export function clearNativeWidgetQueueKey(key: (typeof NATIVE_WIDGET_QUEUE_KEYS)[number]): void {
  try {
    getLivskompassenNative()?.setWidgetData?.(key, '');
  } catch {
    /* ignore */
  }
}
