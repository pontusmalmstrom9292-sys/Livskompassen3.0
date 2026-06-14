/**
 * GDPR Data Retention Job (körbar modul)
 * Livskompassen v2 - Fas 3, Steg 3.1
 *
 * Permanent minne (G5): WORM-källor raderas ALDRIG — se .context/arkiv-minne.md
 */

import { Firestore, Timestamp } from '@google-cloud/firestore';

import { GCP_PROJECT_ID } from '../config';
import { purgeExpiredRegistryEntries } from '../lib/contextCacheRegistry';

const PROJECT_ID = GCP_PROJECT_ID;
const RETENTION_DAYS = parseInt(process.env.RETENTION_DAYS ?? '90', 10);

/** WORM / permanent minne — får ALDRIG purgas. */
export const WORM_COLLECTIONS_NEVER_PURGE = [
  'children_logs',
  'reality_vault',
  'journal',
  'emotional_memory',
  'vit_entries',
  'dossier_snapshots',
  'kampspar',
  'kb_docs',
  'entity_profiles',
  'system_synapses',
  'transactions',
  'evolution_ledger',
  'evolution_hub',
  'recovery_profile',
] as const;

/** Endast ephemeral cache under users/{uid}/. Live Minne = top-level kampspar. */
const COLLECTIONS_TO_PURGE = ['interaction_logs', 'dcap_analysis_cache'];

interface PurgeResult {
  collection: string;
  deletedCount: number;
  prunedVectorIds: string[];
}

function getCutoffTimestamp(): Timestamp {
  const cutoffMs = Date.now() - RETENTION_DAYS * 24 * 60 * 60 * 1000;
  return Timestamp.fromMillis(cutoffMs);
}

export function isWormProtectedCollection(collection: string): boolean {
  return (WORM_COLLECTIONS_NEVER_PURGE as readonly string[]).includes(collection);
}

async function purgeFirestoreCollection(
  db: Firestore,
  userId: string,
  collection: string,
  cutoff: Timestamp
): Promise<PurgeResult> {
  if (isWormProtectedCollection(collection)) {
    console.warn(`[RetentionJob] Skippar WORM-skyddad collection: ${collection}`);
    return { collection, deletedCount: 0, prunedVectorIds: [] };
  }

  const ref = db.collection(`users/${userId}/${collection}`);
  const snapshot = await ref.where('createdAt', '<', cutoff).get();

  if (snapshot.empty) return { collection, deletedCount: 0, prunedVectorIds: [] };

  const batch = db.batch();
  const prunedVectorIds: string[] = [];

  for (const doc of snapshot.docs) {
    batch.delete(doc.ref);
    const vectorId = doc.data()?.vectorId as string | undefined;
    if (vectorId) prunedVectorIds.push(vectorId);
  }

  await batch.commit();
  console.log(`[RetentionJob] ${collection}: ${snapshot.size} dok. raderade för uid=${userId}`);
  return { collection, deletedCount: snapshot.size, prunedVectorIds };
}

async function removeVectors(vectorIds: string[]): Promise<void> {
  const indexId = process.env.VECTOR_SEARCH_INDEX_ID;
  if (!indexId || vectorIds.length === 0) return;

  const { IndexServiceClient } = await import('@google-cloud/aiplatform');
  const client = new IndexServiceClient({ apiEndpoint: `europe-west1-aiplatform.googleapis.com` });

  await client.removeDatapoints({
    index: `projects/${PROJECT_ID}/locations/europe-west1/indexes/${indexId}`,
    datapointIds: vectorIds,
  });

  console.log(`[RetentionJob] ${vectorIds.length} vektorer borttagna från Vector Search.`);
}

export default async function runRetention(): Promise<void> {
  console.log(`[RetentionJob] Startar. Retention: ${RETENTION_DAYS} dagar.`);
  console.log(`[RetentionJob] WORM-skydd: ${WORM_COLLECTIONS_NEVER_PURGE.join(', ')}`);

  const db = new Firestore({ projectId: PROJECT_ID });
  const cutoff = getCutoffTimestamp();

  const usersSnap = await db.collection('users').select().get();
  const userIds = usersSnap.docs.map((d) => d.id);

  const allVectorIds: string[] = [];
  let totalDeleted = 0;

  for (const userId of userIds) {
    for (const collection of COLLECTIONS_TO_PURGE) {
      const result = await purgeFirestoreCollection(db, userId, collection, cutoff);
      totalDeleted += result.deletedCount;
      allVectorIds.push(...result.prunedVectorIds);
    }
  }

  await removeVectors(allVectorIds);

  const expiredCaches = await purgeExpiredRegistryEntries();
  if (expiredCaches > 0) {
    console.log(`[RetentionJob] context_cache_registry: ${expiredCaches} utgångna poster raderade.`);
  }

  console.log(
    `[RetentionJob] Klart. ${totalDeleted} dok., ${allVectorIds.length} vektorer, ${expiredCaches} cache-registry.`
  );
}

if (require.main === module) {
  runRetention().catch((err) => {
    console.error('[RetentionJob] Kritiskt fel:', err);
    process.exit(1);
  });
}
