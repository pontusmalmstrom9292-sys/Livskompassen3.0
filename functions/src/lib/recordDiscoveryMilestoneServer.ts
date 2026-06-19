import * as admin from 'firebase-admin';
import {
  ledgerEntryDedupKey,
  ledgerEntryDedupKeyFromStored,
} from '../../../shared/evolution/evolutionHubLedgerSync';

const LEDGER_COLLECTION = 'evolution_ledger';

export async function recordDiscoveryMilestoneServer(
  userId: string,
  categoryId: string,
  firstBankId: string,
): Promise<{ recorded: boolean }> {
  const db = admin.firestore();
  const snap = await db
    .collection(LEDGER_COLLECTION)
    .where('ownerId', '==', userId)
    .get();

  const entry = {
    userId,
    type: 'milestone_unlocked' as const,
    pillar: 'kognitiv' as const,
    levelBefore: 0,
    levelAfter: 1,
    metadata: {
      source: 'kompass_discovery',
      categoryId,
      firstBankId,
    },
  };
  const key = ledgerEntryDedupKey(entry);
  const existingKeys = new Set<string>();
  snap.docs.forEach((docSnap) => {
    existingKeys.add(ledgerEntryDedupKeyFromStored(docSnap.data() as Record<string, unknown>));
  });
  if (existingKeys.has(key)) {
    return { recorded: false };
  }

  await db.collection(LEDGER_COLLECTION).add({
    userId,
    ownerId: userId,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    type: entry.type,
    pillar: entry.pillar,
    levelBefore: entry.levelBefore,
    levelAfter: entry.levelAfter,
    rationale: 'Första sparade reflektion i kompass-deck',
    metadata: entry.metadata,
  });

  return { recorded: true };
}
