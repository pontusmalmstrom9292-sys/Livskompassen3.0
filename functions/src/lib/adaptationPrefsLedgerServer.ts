import * as admin from 'firebase-admin';
import {
  adaptationLedgerDedupKey,
  adaptationLedgerDedupKeyFromStored,
  collectLedgerEntriesFromPrefsDiff,
  prefsLedgerFingerprint,
} from '../../../shared/adaptation/adaptationLedgerSync';
import type {
  AdaptationLedgerSource,
  AdaptationLedgerWriteInput,
  AdaptationPrefsDoc,
  AdaptationSilo,
} from '../../../shared/adaptation/adaptationTypes';

const LEDGER_COLLECTION = 'adaptation_ledger';

async function loadExistingDedupKeys(
  db: admin.firestore.Firestore,
  userId: string,
): Promise<Set<string>> {
  const snap = await db
    .collection(LEDGER_COLLECTION)
    .where('ownerId', '==', userId)
    .get();

  const keys = new Set<string>();
  snap.docs.forEach((docSnap) => {
    keys.add(adaptationLedgerDedupKeyFromStored(docSnap.data() as Record<string, unknown>));
  });
  return keys;
}

async function appendLedgerEntry(
  db: admin.firestore.Firestore,
  entry: AdaptationLedgerWriteInput,
  existingKeys: Set<string>,
): Promise<void> {
  const key = adaptationLedgerDedupKey(entry);
  if (existingKeys.has(key)) return;

  await db.collection(LEDGER_COLLECTION).add({
    userId: entry.userId,
    ownerId: entry.userId,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    type: entry.type,
    source: entry.source,
    silo: entry.silo,
    rationale: entry.rationale,
    metadata: entry.metadata,
  });
  existingKeys.add(key);
}

/** Server-side mirror: adaptation_prefs onWrite → append-only adaptation_ledger. */
export async function syncAdaptationPrefsToLedgerServer(
  db: admin.firestore.Firestore,
  userId: string,
  prev: AdaptationPrefsDoc | null,
  next: AdaptationPrefsDoc,
  source: AdaptationLedgerSource = 'system',
  silo: AdaptationSilo = 'core',
): Promise<void> {
  if (!prev) return;
  if (prefsLedgerFingerprint(prev) === prefsLedgerFingerprint(next)) return;

  const entries = collectLedgerEntriesFromPrefsDiff(userId, prev, next, source, silo);
  if (entries.length === 0) return;

  const existingKeys = await loadExistingDedupKeys(db, userId);
  for (const entry of entries) {
    await appendLedgerEntry(db, entry, existingKeys);
  }
}
