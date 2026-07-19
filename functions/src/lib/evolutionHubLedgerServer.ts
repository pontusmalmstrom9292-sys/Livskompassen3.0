import { admin } from './firebaseAdmin';
import {
  collectLedgerEntriesFromHubDiff,
  hubLedgerFingerprint,
  ledgerEntryDedupKey,
  ledgerEntryDedupKeyFromStored,
  type EvolutionHubDoc,
  type LedgerWriteInput,
} from '../../../shared/evolution/evolutionHubLedgerSync';

const LEDGER_COLLECTION = 'evolution_ledger';

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
    keys.add(ledgerEntryDedupKeyFromStored(docSnap.data() as Record<string, unknown>));
  });
  return keys;
}

async function appendLedgerEntry(
  db: admin.firestore.Firestore,
  entry: LedgerWriteInput,
  existingKeys: Set<string>,
): Promise<void> {
  const key = ledgerEntryDedupKey(entry);
  if (existingKeys.has(key)) return;

  await db.collection(LEDGER_COLLECTION).add({
    userId: entry.userId,
    ownerId: entry.userId,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    type: entry.type,
    pillar: entry.pillar,
    levelBefore: entry.levelBefore,
    levelAfter: entry.levelAfter,
    rationale: entry.rationale,
    metadata: entry.metadata,
  });
  existingKeys.add(key);
}

/** Server-side mirror: evolution_hub onWrite → append-only evolution_ledger. */
export async function syncEvolutionHubToLedgerServer(
  db: admin.firestore.Firestore,
  userId: string,
  prev: EvolutionHubDoc | null,
  next: EvolutionHubDoc,
): Promise<void> {
  if (!prev) return;
  if (hubLedgerFingerprint(prev) === hubLedgerFingerprint(next)) return;

  const entries = collectLedgerEntriesFromHubDiff(userId, prev, next);
  if (entries.length === 0) return;

  const existingKeys = await loadExistingDedupKeys(db, userId);
  for (const entry of entries) {
    await appendLedgerEntry(db, entry, existingKeys);
  }
}
