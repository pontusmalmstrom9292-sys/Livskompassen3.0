import * as admin from 'firebase-admin';
import { generateEmbeddingInternal } from './generateEmbeddingInternal';
import {
  computeMinneContentHash,
  MINNE_CONTENT_CLASS,
  MINNE_EMBEDDING_DIM,
  MINNE_EMBEDDING_MODEL,
  type EmbedStatus,
} from './minneEmbedMeta';

export type IngestKampsparPayload = {
  title: string;
  content: string;
  category?: string;
  entryType?: string;
  tags?: string[];
  source?: string;
  eventDate?: string;
  contentClass?: string;
  promotedFromKbDocId?: string;
};

/** Delad WORM-create + embedding för kampspar (callables). */
export async function ingestKampsparForUser(
  uid: string,
  input: IngestKampsparPayload,
): Promise<{ docId: string; embeddingDim: number | null; embedStatus: EmbedStatus }> {
  const title = input.title.trim();
  const content = input.content.trim();
  if (!title || title.length > 200) {
    throw new Error('title krävs (max 200 tecken).');
  }
  if (!content || content.length > 48_000) {
    throw new Error('content krävs (max 48000 tecken).');
  }

  const contentHash = computeMinneContentHash([
    title,
    content,
    input.category,
    input.entryType,
    input.source,
  ]);

  let embeddingDim: number | null = null;
  let embedding: number[] = [];
  let embedStatus: EmbedStatus = 'pending';
  try {
    embedding = await generateEmbeddingInternal(
      [title, input.entryType, input.category, input.tags?.join(' '), content]
        .filter(Boolean)
        .join('\n'),
    );
    embeddingDim = embedding.length > 0 ? embedding.length : null;
    embedStatus = embedding.length === MINNE_EMBEDDING_DIM ? 'ok' : 'fail';
    if (embedStatus === 'fail') {
      console.warn(`[ingestKampsparForUser] metrics embed_fail dim=${embedding.length}`);
    }
  } catch (err) {
    embedStatus = 'fail';
    console.warn('[ingestKampsparForUser] metrics embed_fail:', err);
  }

  const docData: Record<string, unknown> = {
    userId: uid,
    ownerId: uid,
    title,
    content,
    category: input.category || null,
    entryType: input.entryType || null,
    tags: input.tags?.length ? input.tags : null,
    source: input.source || 'manual',
    eventDate: input.eventDate || null,
    embeddingDim,
    embeddingModel: MINNE_EMBEDDING_MODEL,
    embedStatus,
    contentHash,
    content_class: input.contentClass ?? MINNE_CONTENT_CLASS.kampspar,
    promotedFromKbDocId: input.promotedFromKbDocId ?? null,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    embeddedAt: embedStatus === 'ok' ? admin.firestore.FieldValue.serverTimestamp() : null,
  };

  if (embedding.length > 0 && embedStatus === 'ok') {
    docData.embedding = admin.firestore.FieldValue.vector(embedding);
  }

  const docRef = await admin.firestore().collection('kampspar').add(docData);
  console.log(
    `[ingestKampsparForUser] metrics created=1 embedStatus=${embedStatus} docId=${docRef.id}`,
  );

  return { docId: docRef.id, embeddingDim, embedStatus };
}
