import { doc, setDoc } from 'firebase/firestore';
import { db } from './firestore';
import { assertOfflineWriteAllowed } from './offlineWritePolicy';
import { FIRESTORE_COLLECTIONS } from '../types/firestore';
import type { AdaptationPrefsDoc } from '../types/adaptation';
import { DEFAULT_ADAPTATION_PREFS } from '../types/adaptation';

/**
 * Kanonisk merge-skrivning till adaptation_prefs.
 * Ledger audit skrivs server-side via onAdaptationPrefsWrite (source: system).
 */
export async function mergeAdaptationPrefs(
  userId: string,
  patch: Partial<
    Pick<
      AdaptationPrefsDoc,
      'coachTone' | 'uiDensity' | 'routingDefaults' | 'dismissedHints' | 'inferredSignals'
    >
  >,
): Promise<void> {
  assertOfflineWriteAllowed(FIRESTORE_COLLECTIONS.adaptation_prefs);
  const prefsRef = doc(db, FIRESTORE_COLLECTIONS.adaptation_prefs, userId);
  await setDoc(
    prefsRef,
    {
      coachTone: DEFAULT_ADAPTATION_PREFS.coachTone,
      uiDensity: DEFAULT_ADAPTATION_PREFS.uiDensity,
      routingDefaults: DEFAULT_ADAPTATION_PREFS.routingDefaults,
      dismissedHints: DEFAULT_ADAPTATION_PREFS.dismissedHints,
      inferredSignals: DEFAULT_ADAPTATION_PREFS.inferredSignals,
      ...patch,
      userId,
      ownerId: userId,
      updatedAt: new Date().toISOString(),
    },
    { merge: true },
  );
}
