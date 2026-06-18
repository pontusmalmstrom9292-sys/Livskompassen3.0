import { addDoc, collection, doc, getDocs, query, serverTimestamp, setDoc, where } from 'firebase/firestore';
import { db } from './firestore';
import { assertOfflineWriteAllowed } from './offlineWritePolicy';
import { FIRESTORE_COLLECTIONS } from '../types/firestore';
import type { AdaptationPrefsDoc } from '../types/adaptation';
import { DEFAULT_ADAPTATION_PREFS } from '../types/adaptation';
import {
  adaptationLedgerDedupKey,
  adaptationLedgerDedupKeyFromStored,
  collectLedgerEntriesFromPrefsDiff,
  prefsLedgerFingerprint,
} from '../../../../shared/adaptation/adaptationLedgerSync';

async function loadExistingDedupKeys(userId: string): Promise<Set<string>> {
  const ref = collection(db, FIRESTORE_COLLECTIONS.adaptation_ledger);
  const snap = await getDocs(query(ref, where('ownerId', '==', userId)));
  const keys = new Set<string>();
  snap.docs.forEach((docSnap) => {
    keys.add(adaptationLedgerDedupKeyFromStored(docSnap.data() as Record<string, unknown>));
  });
  return keys;
}

async function appendAdaptationLedgerEntry(
  entry: Parameters<typeof adaptationLedgerDedupKey>[0] & { userId: string },
  existingKeys: Set<string>,
): Promise<void> {
  const key = adaptationLedgerDedupKey(entry);
  if (existingKeys.has(key)) return;

  assertOfflineWriteAllowed(FIRESTORE_COLLECTIONS.adaptation_ledger);
  const ref = collection(db, FIRESTORE_COLLECTIONS.adaptation_ledger);
  await addDoc(ref, {
    userId: entry.userId,
    ownerId: entry.userId,
    createdAt: serverTimestamp(),
    type: entry.type,
    source: entry.source,
    silo: entry.silo,
    rationale: entry.rationale,
    metadata: entry.metadata,
  });
  existingKeys.add(key);
}

/** Jämför prev/next adaptation_prefs och append-only logga förändringar. */
export async function syncAdaptationPrefsToLedger(
  userId: string,
  prev: AdaptationPrefsDoc | null,
  next: AdaptationPrefsDoc,
): Promise<void> {
  if (!prev) return;
  if (prefsLedgerFingerprint(prev) === prefsLedgerFingerprint(next)) return;

  const entries = collectLedgerEntriesFromPrefsDiff(userId, prev, next, 'user', 'core');
  if (entries.length === 0) return;

  const existingKeys = await loadExistingDedupKeys(userId);
  for (const entry of entries) {
    await appendAdaptationLedgerEntry(entry, existingKeys);
  }
}

/**
 * Kanonisk merge-skrivning till adaptation_prefs.
 * Dual-write: client (useAdaptationSync) + server (`onAdaptationPrefsWrite`) med dedup.
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
