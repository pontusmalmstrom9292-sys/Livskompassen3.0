/** @locked MOD-BACK-WORM — låst modul; unlock via docs/evaluations/*-unlock-MOD-BACK-WORM.md
 *
 * WORM Hash-Chain — SHA-256 cryptographic proof chain for immutable evidence entries.
 *
 * Each WORM entry (reality_vault, children_logs, journal) gets a hash linking to the
 * previous entry in the chain, forming a tamper-evident append-only log.
 *
 * Schema: { entryHash, previousHash, chainIndex, collection, docId, createdAt }
 * Storage: `worm_hash_chain` collection (itself append-only).
 *
 * Verification: External auditor can re-compute chain from first entry.
 */

import crypto from 'crypto';
import { admin } from './firebaseAdmin';
import { monitor } from './monitoring';

export interface HashChainEntry {
  entryHash: string;
  previousHash: string;
  chainIndex: number;
  collection: string;
  docId: string;
  userId: string;
  createdAt: FirebaseFirestore.Timestamp;
}

const HASH_CHAIN_COLLECTION = 'worm_hash_chain';
const GENESIS_HASH = '0000000000000000000000000000000000000000000000000000000000000000';

/**
 * Compute SHA-256 hash of a WORM payload.
 * Deterministic: sorts keys, stringifies, then hashes.
 */
export function computeEntryHash(payload: Record<string, unknown>): string {
  const sorted = Object.keys(payload)
    .sort()
    .reduce<Record<string, unknown>>((acc, key) => {
      acc[key] = payload[key];
      return acc;
    }, {});
  return crypto.createHash('sha256').update(JSON.stringify(sorted)).digest('hex');
}

/**
 * Compute chain hash linking current entry to previous.
 * chainHash = SHA-256(previousHash + entryHash + chainIndex)
 */
export function computeChainHash(previousHash: string, entryHash: string, chainIndex: number): string {
  return crypto
    .createHash('sha256')
    .update(`${previousHash}:${entryHash}:${chainIndex}`)
    .digest('hex');
}

/**
 * Append a new entry to the hash chain for a given user + collection.
 * Called after every WORM write to reality_vault, children_logs, journal.
 */
export async function appendToHashChain(
  userId: string,
  collection: string,
  docId: string,
  payload: Record<string, unknown>
): Promise<HashChainEntry> {
  const db = admin.firestore();
  const entryHash = computeEntryHash(payload);

  // Get the latest chain entry for this user + collection
  const lastEntrySnap = await db
    .collection(HASH_CHAIN_COLLECTION)
    .where('userId', '==', userId)
    .where('collection', '==', collection)
    .orderBy('chainIndex', 'desc')
    .limit(1)
    .get();

  let previousHash = GENESIS_HASH;
  let chainIndex = 0;

  if (!lastEntrySnap.empty) {
    const lastData = lastEntrySnap.docs[0].data();
    previousHash = computeChainHash(
      lastData.previousHash as string,
      lastData.entryHash as string,
      lastData.chainIndex as number
    );
    chainIndex = (lastData.chainIndex as number) + 1;
  }

  const chainEntry: HashChainEntry = {
    entryHash,
    previousHash,
    chainIndex,
    collection,
    docId,
    userId,
    createdAt: admin.firestore.Timestamp.now(),
  };

  await db.collection(HASH_CHAIN_COLLECTION).add({
    ...chainEntry,
    chainHash: computeChainHash(previousHash, entryHash, chainIndex),
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  monitor.trackWormWrite(collection, docId, userId);
  monitor.log('INFO', `[HashChain] Appended ${collection}/${docId} index=${chainIndex}`, {
    userId,
    collection,
    docId,
    chainIndex,
    entryHash: entryHash.slice(0, 16),
  });

  return chainEntry;
}

/**
 * Verify the integrity of the hash chain for a user + collection.
 * Returns { valid, brokenAtIndex } — useful for audits.
 */
export async function verifyHashChain(
  userId: string,
  collection: string
): Promise<{ valid: boolean; brokenAtIndex: number | null; totalEntries: number }> {
  const db = admin.firestore();
  const snap = await db
    .collection(HASH_CHAIN_COLLECTION)
    .where('userId', '==', userId)
    .where('collection', '==', collection)
    .orderBy('chainIndex', 'asc')
    .get();

  if (snap.empty) {
    return { valid: true, brokenAtIndex: null, totalEntries: 0 };
  }

  let expectedPreviousHash = GENESIS_HASH;

  for (const doc of snap.docs) {
    const data = doc.data();
    const entryHash = data.entryHash as string;
    const previousHash = data.previousHash as string;
    const chainIndex = data.chainIndex as number;
    const storedChainHash = data.chainHash as string;

    if (previousHash !== expectedPreviousHash) {
      monitor.log('CRITICAL', `[HashChain] BROKEN at index=${chainIndex} for ${collection}`, {
        userId,
        collection,
        chainIndex,
        expected: expectedPreviousHash,
        found: previousHash,
      });
      return { valid: false, brokenAtIndex: chainIndex, totalEntries: snap.size };
    }

    const computedChainHash = computeChainHash(previousHash, entryHash, chainIndex);
    if (computedChainHash !== storedChainHash) {
      monitor.log('CRITICAL', `[HashChain] TAMPERED chainHash at index=${chainIndex}`, {
        userId,
        collection,
        chainIndex,
      });
      return { valid: false, brokenAtIndex: chainIndex, totalEntries: snap.size };
    }

    expectedPreviousHash = computedChainHash;
  }

  return { valid: true, brokenAtIndex: null, totalEntries: snap.size };
}
