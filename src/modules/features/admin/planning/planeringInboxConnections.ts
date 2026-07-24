/** Lokala kopplingspreferenser — OAuth/sync aktiveras i senare fas (G10 / PLANERINGSSIDA P2). */

export type PlaneringInboxProvider = 'gmail' | 'google_calendar';

export type PlaneringConnectionPhase = 'disconnected' | 'prepared';

export type PlaneringProviderConnection = {
  provider: PlaneringInboxProvider;
  phase: PlaneringConnectionPhase;
  /** Visas när användaren förberett koppling (t.ex. inloggad Google-adress). */
  accountHint?: string;
  updatedAt?: string;
};

export type PlaneringInboxConnectionsState = Record<
  PlaneringInboxProvider,
  PlaneringProviderConnection
>;

const STORAGE_KEY = 'livskompassen_planering_inbox_connections_v1';

const DEFAULT_STATE: PlaneringInboxConnectionsState = {
  gmail: { provider: 'gmail', phase: 'disconnected' },
  google_calendar: { provider: 'google_calendar', phase: 'disconnected' },
};

export const PLANERING_INBOX_PROVIDER_META: Record<
  PlaneringInboxProvider,
  { title: string; lead: string; syncNote: string }
> = {
  gmail: {
    title: 'Gmail',
    lead: 'Mejl som ska bli uppgifter eller Hamn — inte automatiskt i Valv.',
    syncNote: 'Läser inkorg (read-only) när synk är live.',
  },
  google_calendar: {
    title: 'Google Kalender',
    lead: 'Möten och hämtningar i samma vy som mejl.',
    syncNote: 'Läser händelser (read-only) när synk är live.',
  },
};

function parseStored(raw: string | null): PlaneringInboxConnectionsState {
  if (!raw) return DEFAULT_STATE;
  try {
    const data = JSON.parse(raw) as Partial<PlaneringInboxConnectionsState>;
    return {
      gmail: { ...DEFAULT_STATE.gmail, ...data.gmail },
      google_calendar: { ...DEFAULT_STATE.google_calendar, ...data.google_calendar },
    };
  } catch {
    return DEFAULT_STATE;
  }
}

/** Stable ref for useSyncExternalStore — never return a fresh object from getSnapshot. */
let snapshotCache: PlaneringInboxConnectionsState | null = null;

export function readPlaneringInboxConnections(): PlaneringInboxConnectionsState {
  if (snapshotCache) return snapshotCache;
  try {
    snapshotCache = parseStored(localStorage.getItem(STORAGE_KEY));
  } catch {
    snapshotCache = DEFAULT_STATE;
  }
  return snapshotCache;
}

export function writePlaneringInboxConnections(
  next: PlaneringInboxConnectionsState,
): void {
  snapshotCache = next;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* ignore quota */
  }
}

export function preparePlaneringInboxConnection(
  provider: PlaneringInboxProvider,
  accountHint: string,
): PlaneringInboxConnectionsState {
  const current = readPlaneringInboxConnections();
  const next: PlaneringInboxConnectionsState = {
    ...current,
    [provider]: {
      provider,
      phase: 'prepared',
      accountHint: accountHint.trim() || undefined,
      updatedAt: new Date().toISOString(),
    },
  };
  writePlaneringInboxConnections(next);
  return next;
}

export function disconnectPlaneringInboxProvider(
  provider: PlaneringInboxProvider,
): PlaneringInboxConnectionsState {
  const next: PlaneringInboxConnectionsState = {
    ...readPlaneringInboxConnections(),
    [provider]: { provider, phase: 'disconnected' },
  };
  writePlaneringInboxConnections(next);
  return next;
}
