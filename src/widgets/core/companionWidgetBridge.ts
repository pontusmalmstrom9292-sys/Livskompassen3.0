/**
 * Push short status to Android home-screen widgets via native bridge.
 * Debounced — avoids chip flicker on rapid taps. No-op on web.
 *
 * Always writes global `last_action` (Record + fallback).
 * Optional `scope` also writes `last_action_${scope}` for that Companion chip only.
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
