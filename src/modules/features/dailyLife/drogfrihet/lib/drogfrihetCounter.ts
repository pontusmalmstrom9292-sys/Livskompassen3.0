const STORAGE_PREFIX = 'livskompassen_drogfrihet_start';
export const DROGFRIHET_COUNTER_EVENT = 'livskompassen:drogfrihet-counter-changed';

export type DrogfrihetCounterState = {
  startDateKey: string | null;
  dayCount: number;
  started: boolean;
};

function storageKey(uid?: string): string {
  return uid ? `${STORAGE_PREFIX}:${uid}` : `${STORAGE_PREFIX}:local`;
}

function localDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function parseDateKey(key: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(key);
  if (!m) return null;
  const date = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  return Number.isNaN(date.getTime()) ? null : date;
}

export function emitDrogfrihetCounterChanged(): void {
  window.dispatchEvent(new CustomEvent(DROGFRIHET_COUNTER_EVENT));
}

export function getDrogfrihetStartDateKey(uid?: string): string | null {
  try {
    return localStorage.getItem(storageKey(uid));
  } catch {
    return null;
  }
}

export function setDrogfrihetStartDateKey(dateKey: string, uid?: string): void {
  try {
    localStorage.setItem(storageKey(uid), dateKey);
    emitDrogfrihetCounterChanged();
  } catch {
    /* ignore */
  }
}

/** Nollställ: räkna från idag (lokal midnatt-datum). */
export function resetDrogfrihetCounter(uid?: string): void {
  setDrogfrihetStartDateKey(localDateKey(new Date()), uid);
}

export function clearDrogfrihetCounter(uid?: string): void {
  try {
    localStorage.removeItem(storageKey(uid));
    emitDrogfrihetCounterChanged();
  } catch {
    /* ignore */
  }
}

/** Inkluderar startdagen som dag 1. */
export function computeDrogfrihetDayCount(startDateKey: string, now = new Date()): number {
  const start = parseDateKey(startDateKey);
  if (!start) return 0;
  const todayKey = localDateKey(now);
  const today = parseDateKey(todayKey);
  if (!today) return 0;
  const msPerDay = 86400000;
  const diff = Math.floor((today.getTime() - start.getTime()) / msPerDay);
  return Math.max(1, diff + 1);
}

export function getDrogfrihetCounterState(uid?: string): DrogfrihetCounterState {
  const startDateKey = getDrogfrihetStartDateKey(uid);
  if (!startDateKey) {
    return { startDateKey: null, dayCount: 0, started: false };
  }
  return {
    startDateKey,
    dayCount: computeDrogfrihetDayCount(startDateKey),
    started: true,
  };
}
