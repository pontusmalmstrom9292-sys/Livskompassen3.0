/**
 * Offline Firestore write policy — persistence köar till IndexedDB och synkar när nät finns.
 *
 * - **Tillåtet:** vardagsdata (dagbok, planering, projekt, MåBra, ekonomi/tid) som får ligga i SDK-kön.
 * - **Blockerat:** Valv + barnloggar (evidens/WORM-känsligt — ingen tyst kö innan server validerat).
 *
 * Server-regler i `firestore.rules` gäller vid commit; misslyckade writes loggas av SDK.
 */
import { FIRESTORE_COLLECTIONS } from '../types/firestore';

const C = FIRESTORE_COLLECTIONS;

/**
 * Collections whose client writes may queue offline and sync when `navigator.onLine` + Firestore.
 * Håll listan i synk med alla `assertOfflineWriteAllowed`-anrop i repo.
 */
export const OFFLINE_WRITE_ALLOWLIST = new Set<string>([
  C.checkins,
  C.journal,
  C.planning_tasks,
  C.planning_email_rules,
  C.project_rules,
  C.routine_templates,
  C.projects,
  C.project_blocks,
  C.mabra_sessions,
  C.mabra_progress,
  C.economy_profiles,
  C.transactions,
  C.time_entries,
  C.economy_ledger,
  C.economy_fixed_bills,
  C.budget_savings,
  C.user_widgets,
]);

/** Evidence paths — måste inte köas offline (produkt + integritet). */
export const OFFLINE_WRITE_BLOCKED_COLLECTIONS = new Set<string>([
  C.reality_vault,
  C.children_logs,
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
  if (OFFLINE_WRITE_BLOCKED_COLLECTIONS.has(collection)) {
    return 'Valv och barnloggar kräver nätverk — anslut innan du sparar.';
  }
  return 'Den här åtgärden går inte offline ännu. Anslut till nätverket.';
}

/** Throws when offline and collection is not allowed to queue writes. */
export function assertOfflineWriteAllowed(collection: string): void {
  if (!isBrowserOffline()) return;
  if (OFFLINE_WRITE_BLOCKED_COLLECTIONS.has(collection)) {
    throw new OfflineWriteBlockedError(collection);
  }
  if (!OFFLINE_WRITE_ALLOWLIST.has(collection)) {
    throw new OfflineWriteBlockedError(collection);
  }
}
