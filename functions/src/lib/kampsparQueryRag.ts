import * as admin from 'firebase-admin';
import { generateEmbeddingInternal } from './generateEmbeddingInternal';

function formatDate(value: unknown): string {
  if (value && typeof value === 'object' && 'toDate' in value) {
    return (value as { toDate: () => Date }).toDate().toISOString().slice(0, 10);
  }
  if (typeof value === 'string') return value.slice(0, 10);
  return '';
}

export interface KampsparEvidenceChunk {
  docId: string;
  collection: 'kampspar' | 'kb_docs';
  date: string;
  title: string;
  excerpt: string;
  content: string;
}

function chunkFromDoc(
  collectionName: 'kampspar' | 'kb_docs',
  id: string,
  data: admin.firestore.DocumentData
): KampsparEvidenceChunk {
  const content = String(data.content ?? data.text ?? '');
  const title = String(data.title ?? data.fileName ?? 'Minne');
  const date = formatDate(data.eventDate ?? data.createdAt);
  return {
    docId: id,
    collection: collectionName,
    date,
    title,
    excerpt: content.slice(0, 200),
    content,
  };
}

async function fetchKampsparEvidenceAnn(
  uid: string,
  question: string,
  limit: number
): Promise<KampsparEvidenceChunk[]> {
  const embedding = await generateEmbeddingInternal(question);
  if (embedding.length === 0) return [];

  const db = admin.firestore();
  
  // Sök i kampspar
  const kampsparSnap = await db.collection('kampspar')
    .where('ownerId', '==', uid)
    .findNearest('embedding', admin.firestore.FieldValue.vector(embedding), {
      limit: limit,
      distanceMeasure: 'COSINE',
      distanceResultField: 'vectorDistance'
    } as any)
    .get();

  // Sök i kb_docs
  const kbSnap = await db.collection('kb_docs')
    .where('ownerId', '==', uid)
    .findNearest('embedding', admin.firestore.FieldValue.vector(embedding), {
      limit: limit,
      distanceMeasure: 'COSINE',
      distanceResultField: 'vectorDistance'
    } as any)
    .get();

  const results: Array<{ distance: number, chunk: KampsparEvidenceChunk }> = [];

  for (const doc of kampsparSnap.docs) {
    const data = doc.data();
    results.push({
      distance: data.vectorDistance ?? Number.MAX_VALUE,
      chunk: chunkFromDoc('kampspar', doc.id, data)
    });
  }

  for (const doc of kbSnap.docs) {
    const data = doc.data();
    results.push({
      distance: data.vectorDistance ?? Number.MAX_VALUE,
      chunk: chunkFromDoc('kb_docs', doc.id, data)
    });
  }

  // Sortera så att lägst avstånd (mest likt) kommer först
  results.sort((a, b) => a.distance - b.distance);

  const chunks = results.map(r => r.chunk).slice(0, limit);

  if (chunks.length > 0) {
    console.log(`[kampsparQueryRag] ANN ${chunks.length} träffar för uid=${uid}`);
  }
  return chunks;
}

/** Minne-scoped RAG: ANN via Firestore Native Vector Search. */
export async function fetchKampsparEvidenceForQuery(
  uid: string,
  question: string,
  limit = 12
): Promise<KampsparEvidenceChunk[]> {
  try {
    const annChunks = await fetchKampsparEvidenceAnn(uid, question, limit);
    return annChunks;
  } catch (err) {
    console.warn('[kampsparQueryRag] ANN misslyckades:', err);
    return [];
  }
}
