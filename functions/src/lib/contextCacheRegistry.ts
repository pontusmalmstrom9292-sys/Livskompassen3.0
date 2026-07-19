import { admin } from './firebaseAdmin';
import { createHash } from 'crypto';

const COLLECTION = 'context_cache_registry';

export interface ContextCacheRegistryDoc {
  cacheKey: string;
  ownerId: string;
  cacheId: string;
  contentHash: string;
  expiresAt: admin.firestore.Timestamp;
  createdAt: admin.firestore.Timestamp;
}

export interface CachedContextRecord {
  cacheId: string;
  expiresAt: Date;
  contentHash: string;
}

/** Deterministisk hash — ny RAG-kontext ⇒ ny cache (token-kostnad vs korrekthet). */
export function hashCacheContent(systemInstruction: string, backgroundDocuments: string[]): string {
  const payload = [systemInstruction, ...backgroundDocuments].join('\n---\n');
  return createHash('sha256').update(payload).digest('hex').slice(0, 32);
}

/** Extrahera ownerId från cacheKey (kompis_uid, adk_*_uid). */
export function resolveOwnerIdFromCacheKey(cacheKey: string): string {
  if (cacheKey.startsWith('kompis_')) {
    return cacheKey.slice('kompis_'.length);
  }
  const adkParts = cacheKey.split('_');
  if (cacheKey.startsWith('adk_') && adkParts.length >= 3) {
    return adkParts[adkParts.length - 1];
  }
  return cacheKey;
}

function docToRecord(data: admin.firestore.DocumentData): CachedContextRecord {
  const expiresAt = data.expiresAt?.toDate?.() ?? new Date(0);
  return {
    cacheId: String(data.cacheId ?? ''),
    expiresAt,
    contentHash: String(data.contentHash ?? ''),
  };
}

export async function getRegistryEntry(
  cacheKey: string,
  contentHash: string
): Promise<CachedContextRecord | null> {
  const snap = await admin.firestore().collection(COLLECTION).doc(cacheKey).get();
  if (!snap.exists) return null;

  const record = docToRecord(snap.data()!);
  if (record.expiresAt <= new Date()) {
    await admin.firestore().collection(COLLECTION).doc(cacheKey).delete();
    console.log(`[ContextCacheRegistry] Expired entry removed: ${cacheKey}`);
    return null;
  }
  if (record.contentHash !== contentHash) {
    console.log(`[ContextCacheRegistry] Content hash mismatch for ${cacheKey} — treat as MISS`);
    return null;
  }
  if (!record.cacheId) return null;

  return record;
}

export async function setRegistryEntry(input: {
  cacheKey: string;
  ownerId: string;
  cacheId: string;
  contentHash: string;
  expiresAt: Date;
}): Promise<void> {
  await admin.firestore().collection(COLLECTION).doc(input.cacheKey).set({
    cacheKey: input.cacheKey,
    ownerId: input.ownerId,
    cacheId: input.cacheId,
    contentHash: input.contentHash,
    expiresAt: admin.firestore.Timestamp.fromDate(input.expiresAt),
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });
}

export async function deleteRegistryEntry(cacheKey: string): Promise<void> {
  await admin.firestore().collection(COLLECTION).doc(cacheKey).delete();
}

/** Zero Footprint — alla cache-nycklar för användare (Kill Switch). */
export async function deleteRegistryEntriesForUser(ownerId: string): Promise<number> {
  const snap = await admin
    .firestore()
    .collection(COLLECTION)
    .where('ownerId', '==', ownerId)
    .get();

  if (snap.empty) return 0;

  const batch = admin.firestore().batch();
  for (const doc of snap.docs) {
    batch.delete(doc.ref);
  }
  await batch.commit();
  return snap.size;
}

/** GDPR — rensa utgångna registry-poster (Vertex TTL hanterar själva cachen). */
export async function purgeExpiredRegistryEntries(): Promise<number> {
  const now = admin.firestore.Timestamp.now();
  const snap = await admin
    .firestore()
    .collection(COLLECTION)
    .where('expiresAt', '<', now)
    .limit(200)
    .get();

  if (snap.empty) return 0;

  const batch = admin.firestore().batch();
  for (const doc of snap.docs) {
    batch.delete(doc.ref);
  }
  await batch.commit();
  return snap.size;
}

export async function listRegistryEntriesForUser(
  ownerId: string
): Promise<Array<{ cacheKey: string; expiresAt: string; contentHash: string }>> {
  const snap = await admin
    .firestore()
    .collection(COLLECTION)
    .where('ownerId', '==', ownerId)
    .limit(20)
    .get();

  return snap.docs.map((d) => {
    const data = d.data();
    const exp = data.expiresAt?.toDate?.() ?? new Date(0);
    return {
      cacheKey: String(data.cacheKey ?? d.id),
      expiresAt: exp.toISOString(),
      contentHash: String(data.contentHash ?? '').slice(0, 8),
    };
  });
}
