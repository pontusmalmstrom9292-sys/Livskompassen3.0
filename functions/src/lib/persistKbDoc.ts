import * as admin from 'firebase-admin';
import { generateEmbeddingInternal } from './generateEmbeddingInternal';
import {
  computeMinneContentHash,
  MINNE_CONTENT_CLASS,
  MINNE_EMBEDDING_DIM,
  MINNE_EMBEDDING_MODEL,
  type EmbedStatus,
} from './minneEmbedMeta';

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
  contentClass?: string;
}

/** Idempotent WORM create för Drive-analys → kb_docs. */
export async function persistKbDocFromDrive(input: PersistKbDocInput): Promise<{
  docId: string;
  created: boolean;
  embedStatus: EmbedStatus;
}> {
  const db = admin.firestore();
  const existing = await db
    .collection('kb_docs')
    .where('ownerId', '==', input.ownerId)
    .where('driveFileId', '==', input.driveFileId)
    .limit(1)
    .get();

  if (!existing.empty) {
    const prev = existing.docs[0].data();
    return {
      docId: existing.docs[0].id,
      created: false,
      embedStatus: (prev.embedStatus as EmbedStatus) ?? (prev.embedding ? 'ok' : 'pending'),
    };
  }

  const contentToSave = input.content.slice(0, 12000);
  const contentHash = computeMinneContentHash([input.title, contentToSave, input.driveFileId]);
  let embeddingDim = input.embeddingDim ?? null;
  let embedding: number[] = [];
  let embedStatus: EmbedStatus = 'pending';

  try {
    embedding = await generateEmbeddingInternal([input.title, contentToSave].join('\n'));
    embeddingDim = embedding.length;
    embedStatus = embedding.length === MINNE_EMBEDDING_DIM ? 'ok' : 'fail';
    if (embedStatus === 'fail') {
      console.warn(
        `[persistKbDoc] metrics embed_fail dim=${embedding.length} expected=${MINNE_EMBEDDING_DIM} driveFileId=${input.driveFileId}`,
      );
    }
  } catch (err) {
    embedStatus = 'fail';
    console.warn(`[persistKbDoc] metrics embed_fail driveFileId=${input.driveFileId}:`, err);
  }

  const docData: Record<string, unknown> = {
    userId: input.ownerId,
    ownerId: input.ownerId,
    title: input.title,
    content: contentToSave,
    folderId: input.folderId ?? 'drive',
    source: 'drive',
    driveFileId: input.driveFileId,
    mimeType: input.mimeType,
    embeddingDim,
    embeddingModel: MINNE_EMBEDDING_MODEL,
    embedStatus,
    contentHash,
    content_class: input.contentClass ?? MINNE_CONTENT_CLASS.kb_docs,
    inboxTags: input.inboxTags ?? null,
    inboxCategory: input.inboxCategory ?? null,
    proposedRouting: input.proposedRouting ?? null,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    embeddedAt: embedStatus === 'ok' ? admin.firestore.FieldValue.serverTimestamp() : null,
  };

  if (embedding.length > 0 && embedStatus === 'ok') {
    docData.embedding = admin.firestore.FieldValue.vector(embedding);
  }

  const docRef = await db.collection('kb_docs').add(docData);
  console.log(
    `[persistKbDoc] metrics created=1 embedStatus=${embedStatus} docId=${docRef.id}`,
  );

  return { docId: docRef.id, created: true, embedStatus };
}
