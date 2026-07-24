/**
 * Zero Footprint — rensa lokala Mabra recovery/SOS-nycklar.
 * Keys speglar `recoveryPlanLocal.ts` (utan att röra låst MOD-FAM-DROG).
 */

const PLAN_PREFIX = 'livskompassen_recovery_plan:';
const SOS_TS_PREFIX = 'livskompassen_recovery_sos_ts:';
const COMEBACK_FLAG = 'livskompassen_recovery_comeback:';
const SOS_PREFIX = 'livskompassen_recovery_sos_';

function keyed(prefix: string, uid?: string): string {
  return `${prefix}${uid || 'local'}`;
}

/** Device Clear + logout — lokal recovery/SOS-metadata bort. */
export function clearRecoveryLocalStorage(uid?: string): void {
  try {
    for (const prefix of [PLAN_PREFIX, SOS_TS_PREFIX, COMEBACK_FLAG]) {
      localStorage.removeItem(keyed(prefix, uid));
      localStorage.removeItem(keyed(prefix, 'local'));
    }
    const toRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (!k) continue;
      if (
        k.startsWith(PLAN_PREFIX) ||
        k.startsWith(SOS_TS_PREFIX) ||
        k.startsWith(COMEBACK_FLAG) ||
        k.startsWith(SOS_PREFIX)
      ) {
        toRemove.push(k);
      }
    }
    for (const k of toRemove) localStorage.removeItem(k);

    // Session drafts (logout does not sessionStorage.clear — Device Clear does)
    sessionStorage.removeItem('livskompassen_recovery_sos_session');
    sessionStorage.removeItem('livskompassen_recovery_reality_draft');
  } catch {
    /* ignore quota / private mode */
  }
}
