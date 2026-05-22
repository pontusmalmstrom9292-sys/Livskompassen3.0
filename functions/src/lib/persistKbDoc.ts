import * as admin from 'firebase-admin';

export interface PersistKbDocInput {
  ownerId: string;
  title: string;
  content: string;
  driveFileId: string;
  mimeType: string;
  folderId?: string;
  embeddingDim?: number;
  inboxTags?: string[];
  inboxCategory?: string;
  proposedRouting?: string;
}

/** Idempotent WORM create för Drive-analys → kb_docs. */
export async function persistKbDocFromDrive(input: PersistKbDocInput): Promise<{ docId: string; created: boolean }> {
  const db = admin.firestore();
  const existing = await db
    .collection('kb_docs')
    .where('ownerId', '==', input.ownerId)
    .where('driveFileId', '==', input.driveFileId)
    .limit(1)
    .get();

  if (!existing.empty) {
    return { docId: existing.docs[0].id, created: false };
  }

  const docRef = await db.collection('kb_docs').add({
    userId: input.ownerId,
    ownerId: input.ownerId,
    title: input.title,
    content: input.content.slice(0, 12000),
    folderId: input.folderId ?? 'drive',
    source: 'drive',
    driveFileId: input.driveFileId,
    mimeType: input.mimeType,
    embeddingDim: input.embeddingDim ?? null,
    inboxTags: input.inboxTags ?? null,
    inboxCategory: input.inboxCategory ?? null,
    proposedRouting: input.proposedRouting ?? null,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  return { docId: docRef.id, created: true };
}
