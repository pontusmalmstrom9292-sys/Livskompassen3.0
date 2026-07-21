/** @locked MOD-FAM-DROG — låst modul; unlock via docs/evaluations/*-unlock-MOD-FAM-DROG.md */
import { httpsCallable } from 'firebase/functions';
import { functions } from '@/core/firebase/init';
import type { NotificationPrefsLocal } from '../lib/notifPrefsLocal';

type SyncResult = { ok: true; buddyCode: string };
type NudgeResult = { ok: boolean; reason?: string };

const syncCallable = httpsCallable<
  {
    fcmToken?: string;
    optIn: boolean;
    quietStartHour: number;
    quietEndHour: number;
    cravingWindows: NotificationPrefsLocal['cravingWindows'];
  },
  SyncResult
>(functions, 'syncDrogfrihetPushPrefs');

const nudgeCallable = httpsCallable<Record<string, never>, NudgeResult>(functions, 'sendDrogfrihetNudge');
const linkCallable = httpsCallable<{ code: string }, { ok: true; buddyUid: string }>(
  functions,
  'linkDrogfrihetBuddy',
);
const pingCallable = httpsCallable<Record<string, never>, NudgeResult>(functions, 'pingDrogfrihetBuddy');

export type NativeDfBridge = {
  getDrogfrihetFcmToken?: () => string;
  scheduleDrogfrihetNudges?: (
    optIn: boolean,
    quietStart: number,
    quietEnd: number,
    craveStart: number,
    craveEnd: number,
  ) => void;
  triggerPremiumNotification?: (title: string, message: string, type: string) => void;
};

export function getNativeDfBridge(): NativeDfBridge | null {
  if (typeof window === 'undefined') return null;
  return ((window as unknown as { LivskompassenNative?: NativeDfBridge }).LivskompassenNative ??
    null) as NativeDfBridge | null;
}

export async function readNativeFcmToken(): Promise<string> {
  const native = getNativeDfBridge();
  try {
    const t = native?.getDrogfrihetFcmToken?.();
    return typeof t === 'string' ? t.trim() : '';
  } catch {
    return '';
  }
}

export function scheduleNativeNudges(prefs: NotificationPrefsLocal): void {
  const native = getNativeDfBridge();
  const w = prefs.cravingWindows[0] ?? { startHour: 17, endHour: 19 };
  try {
    native?.scheduleDrogfrihetNudges?.(
      prefs.optIn,
      prefs.quietStartHour,
      prefs.quietEndHour,
      w.startHour,
      w.endHour,
    );
  } catch {
    /* web / missing bridge */
  }
}

export async function syncDrogfrihetPushPrefs(
  prefs: NotificationPrefsLocal,
  fcmToken?: string,
): Promise<SyncResult> {
  const token = fcmToken ?? (await readNativeFcmToken());
  const res = await syncCallable({
    fcmToken: token || undefined,
    optIn: prefs.optIn,
    quietStartHour: prefs.quietStartHour,
    quietEndHour: prefs.quietEndHour,
    cravingWindows: prefs.cravingWindows,
  });
  return res.data;
}

export async function sendDrogfrihetNudge(): Promise<NudgeResult> {
  const res = await nudgeCallable({});
  return res.data;
}

export async function linkDrogfrihetBuddy(code: string): Promise<{ ok: true; buddyUid: string }> {
  const res = await linkCallable({ code });
  return res.data;
}

export async function pingDrogfrihetBuddy(): Promise<NudgeResult> {
  const res = await pingCallable({});
  return res.data;
}
