/** @locked MOD-FAM-DROG — låst modul; unlock via docs/evaluations/*-unlock-MOD-FAM-DROG.md */
/** Lokal notis-/fönster-preferens — ingen push-spam. Opt-in. */

export type NotificationPrefsLocal = {
  optIn: boolean;
  quietStartHour: number;
  quietEndHour: number;
  cravingWindows: Array<{ startHour: number; endHour: number }>;
};

const KEY = 'livskompassen_df_notif_prefs:';

const DEFAULTS: NotificationPrefsLocal = {
  optIn: false,
  quietStartHour: 22,
  quietEndHour: 7,
  cravingWindows: [{ startHour: 17, endHour: 19 }],
};

function k(uid?: string) {
  return `${KEY}${uid || 'local'}`;
}

export function loadNotifPrefs(uid?: string): NotificationPrefsLocal {
  try {
    const raw = localStorage.getItem(k(uid));
    if (!raw) return { ...DEFAULTS, cravingWindows: [...DEFAULTS.cravingWindows] };
    const p = JSON.parse(raw) as Partial<NotificationPrefsLocal>;
    return {
      optIn: Boolean(p.optIn),
      quietStartHour: Number(p.quietStartHour ?? 22),
      quietEndHour: Number(p.quietEndHour ?? 7),
      cravingWindows: Array.isArray(p.cravingWindows)
        ? p.cravingWindows.slice(0, 3).map((w) => ({
            startHour: Number(w.startHour),
            endHour: Number(w.endHour),
          }))
        : [...DEFAULTS.cravingWindows],
    };
  } catch {
    return { ...DEFAULTS, cravingWindows: [...DEFAULTS.cravingWindows] };
  }
}

export function saveNotifPrefs(prefs: NotificationPrefsLocal, uid?: string): void {
  localStorage.setItem(k(uid), JSON.stringify(prefs));
}

export function isInQuietHours(prefs: NotificationPrefsLocal, hour = new Date().getHours()): boolean {
  const { quietStartHour: s, quietEndHour: e } = prefs;
  if (s === e) return false;
  if (s < e) return hour >= s && hour < e;
  return hour >= s || hour < e;
}

export function isInCravingWindow(prefs: NotificationPrefsLocal, hour = new Date().getHours()): boolean {
  if (!prefs.optIn) return false;
  if (isInQuietHours(prefs, hour)) return false;
  return prefs.cravingWindows.some((w) => {
    if (w.startHour <= w.endHour) return hour >= w.startHour && hour < w.endHour;
    return hour >= w.startHour || hour < w.endHour;
  });
}

export function pickNotisForNow(
  bank: ReadonlyArray<{ text_sv: string }>,
  seed = new Date().toISOString().slice(0, 10),
): string {
  if (!bank.length) return 'Ett ankare finns här.';
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return bank[h % bank.length]!.text_sv;
}
