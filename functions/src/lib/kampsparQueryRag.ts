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

async function fetchKampsparEvidenceTokenFallback(
  uid: string,
  question: string,
  limit: number
): Promise<KampsparEvidenceChunk[]> {
  const db = admin.firestore();
  const tokens = question
    .toLowerCase()
    .split(/[^\p{L}\p{N}]+/u)
    .filter((t) => t.length >= 3)
    .slice(0, 12);
  if (tokens.length === 0) return [];

  const [kampsparSnap, kbSnap] = await Promise.all([
    db.collection('kampspar').where('ownerId', '==', uid).orderBy('createdAt', 'desc').limit(40).get(),
    db.collection('kb_docs').where('ownerId', '==', uid).orderBy('createdAt', 'desc').limit(40).get(),
  ]);

  const scored: Array<{ score: number; chunk: KampsparEvidenceChunk }> = [];
  for (const [coll, snap] of [
    ['kampspar', kampsparSnap],
    ['kb_docs', kbSnap],
  ] as const) {
    for (const doc of snap.docs) {
      const data = doc.data();
      const hay = `${data.title ?? ''} ${data.content ?? data.text ?? ''}`.toLowerCase();
      let score = 0;
      for (const t of tokens) {
        if (hay.includes(t)) score += 1;
      }
      if (score > 0) {
        scored.push({
          score,
          chunk: chunkFromDoc(coll, doc.id, data),
        });
      }
    }
  }
  scored.sort((a, b) => b.score - a.score);
  const chunks = scored.slice(0, limit).map((s) => s.chunk);
  if (chunks.length > 0) {
    console.log(`[kampsparQueryRag] token-fallback ${chunks.length} träffar för uid=${uid}`);
  }
  return chunks;
}

/** Minne-scoped RAG: ANN via Firestore Native Vector Search, token-fallback om ANN tom/fail. */
export async function fetchKampsparEvidenceForQuery(
  uid: string,
  question: string,
  limit = 12
): Promise<KampsparEvidenceChunk[]> {
  try {
    const annChunks = await fetchKampsparEvidenceAnn(uid, question, limit);
    if (annChunks.length > 0) return annChunks;
  } catch (err) {
    console.warn('[kampsparQueryRag] ANN misslyckades — token-fallback:', err);
  }
  try {
    return await fetchKampsparEvidenceTokenFallback(uid, question, limit);
  } catch (err) {
    console.warn('[kampsparQueryRag] token-fallback misslyckades:', err);
    return [];
  }
}
