/**
 * Offline write policy — minimal safe surface for Firestore persistence queue.
 * WORM / evidence collections require network so queued writes cannot surprise-sync later.
 */
export const OFFLINE_WRITE_ALLOWLIST = new Set<string>(['checkins']);

/** U3 append-only / evidence — never queue offline writes. */
export const OFFLINE_WRITE_WORM_COLLECTIONS = new Set<string>([
  'reality_vault',
  'children_logs',
  'journal',
  'vault',
  'kampspar',
  'kb_docs',
  'mabra_sessions',
  'transactions',
  'routines',
  'archival_analysis',
]);

export class OfflineWriteBlockedError extends Error {
  readonly collection: string;

  constructor(collection: string) {
    super(offlineWriteUserMessage(collection));
    this.name = 'OfflineWriteBlockedError';
    this.collection = collection;
  }
}

export function isBrowserOffline(): boolean {
  return typeof navigator !== 'undefined' && !navigator.onLine;
}

export function offlineWriteUserMessage(collection: string): string {
  if (OFFLINE_WRITE_WORM_COLLECTIONS.has(collection)) {
    return 'Bevis och Valv kräver nätverk — vänta tills du är online innan du sparar.';
  }
  return 'Den här åtgärden kräver nätverk just nu. Check-ins kan sparas offline.';
}

/** Throws when offline and collection is not on the allowlist. */
export function assertOfflineWriteAllowed(collection: string): void {
  if (!isBrowserOffline()) return;
  if (OFFLINE_WRITE_ALLOWLIST.has(collection)) return;
  throw new OfflineWriteBlockedError(collection);
}
