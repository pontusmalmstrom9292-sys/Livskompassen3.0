import * as admin from 'firebase-admin';
import { generateEmbeddingInternal } from './generateEmbeddingInternal';
import { upsertKampsparVector } from './vectorSearchClient';

export type IngestKampsparPayload = {
  title: string;
  content: string;
  category?: string;
  entryType?: string;
  tags?: string[];
  source?: string;
  eventDate?: string;
};

/** Delad WORM-create + embedding för kampspar (callables). */
export async function ingestKampsparForUser(
  uid: string,
  input: IngestKampsparPayload,
): Promise<{ docId: string; embeddingDim: number | null }> {
  const title = input.title.trim();
  const content = input.content.trim();
  if (!title || title.length > 200) {
    throw new Error('title krävs (max 200 tecken).');
  }
  if (!content || content.length > 48_000) {
    throw new Error('content krävs (max 48000 tecken).');
  }

  let embeddingDim: number | null = null;
  let embedding: number[] = [];
  try {
    embedding = await generateEmbeddingInternal(
      [title, input.entryType, input.category, input.tags?.join(' '), content]
        .filter(Boolean)
        .join('\n'),
    );
    embeddingDim = embedding.length > 0 ? embedding.length : null;
  } catch (err) {
    console.warn('[ingestKampsparForUser] Embedding misslyckades:', err);
  }

  const docRef = await admin.firestore().collection('kampspar').add({
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
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  if (embedding.length > 0) {
    await upsertKampsparVector(docRef.id, embedding);
  }

  return { docId: docRef.id, embeddingDim };
}
