/**
 * GDPR Data Retention Job (körbar modul)
 * Livskompassen v2 - Fas 3, Steg 3.1
 *
 * Exporterar en default-funktion så att den kan anropas både
 * som ett fristående Cloud Run Job (process.argv) och
 * som en inlineimport från scheduledRetentionJob i index.ts.
 */

import { Firestore, Timestamp } from '@google-cloud/firestore';

const PROJECT_ID = process.env.GCP_PROJECT_ID ?? 'livskompassen-v2';
const RETENTION_DAYS = parseInt(process.env.RETENTION_DAYS ?? '90', 10);
const COLLECTIONS_TO_PURGE = ['kampspar', 'interaction_logs', 'dcap_analysis_cache'];

interface PurgeResult {
  collection: string;
  deletedCount: number;
  prunedVectorIds: string[];
}

function getCutoffTimestamp(): Timestamp {
  const cutoffMs = Date.now() - RETENTION_DAYS * 24 * 60 * 60 * 1000;
  return Timestamp.fromMillis(cutoffMs);
}

async function purgeFirestoreCollection(
  db: Firestore,
  userId: string,
  collection: string,
  cutoff: Timestamp
): Promise<PurgeResult> {
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

  // Dynamic import för att undvika onödigt beroende vid inline-körning
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

  const db = new Firestore({ projectId: PROJECT_ID });
  const cutoff = getCutoffTimestamp();

  const usersSnap = await db.collection('users').select().get();
  const userIds = usersSnap.docs.map((d) => d.id);

  console.log(`[RetentionJob] ${userIds.length} användare att bearbeta.`);

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

  console.log(`[RetentionJob] Klart. ${totalDeleted} dok., ${allVectorIds.length} vektorer raderade.`);
}

// Kör direkt om filen anropas som Cloud Run Job
if (require.main === module) {
  runRetention().catch((err) => {
    console.error('[RetentionJob] Kritiskt fel:', err);
    process.exit(1);
  });
}
