/**
 * Shared post-capture UX — queue already done; flush + status copy.
 */

import {
  pushCompanionWidgetStatus,
  type CompanionAndroidScope,
} from './companionWidgetBridge';
import { flushWidgetSyncQueue } from './WidgetSync';

export type CaptureStatusSetter = (msg: string | null) => void;

/**
 * After queueWidgetSync: show offline/uploading, then ok/queued.
 * Also nudges Android home chips via last_action (+ scoped key when set).
 */
export function finishCompanionCapture(
  setStatus: CaptureStatusSetter,
  okMsg: string,
  opts?: { clearMs?: number; androidScope?: CompanionAndroidScope },
): void {
  const clearMs = opts?.clearMs ?? 1600;
  const scope = opts?.androidScope;
  const online = typeof navigator === 'undefined' || navigator.onLine !== false;
  setStatus(online ? 'Laddar upp…' : 'Sparat lokalt');
  if (!online) pushCompanionWidgetStatus('Sparat lokalt', scope);
  void flushWidgetSyncQueue().then((r) => {
    let final = okMsg;
    if (r.flushed > 0) final = okMsg;
    else if (r.failed > 0) final = 'Köat — försöker igen';
    else if (!online) final = 'Sparat lokalt';
    setStatus(final);
    pushCompanionWidgetStatus(final, scope);
    window.setTimeout(() => setStatus(null), clearMs);
  });
}
