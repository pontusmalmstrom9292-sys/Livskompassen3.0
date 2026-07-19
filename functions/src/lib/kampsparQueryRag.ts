import { admin } from './firebaseAdmin';
import { generateEmbeddingInternal } from './generateEmbeddingInternal';

const RRF_K = 60;

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

function chunkKey(c: KampsparEvidenceChunk): string {
  return `${c.collection}:${c.docId}`;
}

/** Reciprocal Rank Fusion — Kunskap-silo only (ANN ∪ lexical). */
function fuseRrf(
  lists: KampsparEvidenceChunk[][],
  limit: number
): KampsparEvidenceChunk[] {
  const scores = new Map<string, { score: number; chunk: KampsparEvidenceChunk }>();
  for (const list of lists) {
    list.forEach((chunk, index) => {
      const key = chunkKey(chunk);
      const add = 1 / (RRF_K + index + 1);
      const prev = scores.get(key);
      if (prev) {
        prev.score += add;
      } else {
        scores.set(key, { score: add, chunk });
      }
    });
  }
  return [...scores.values()]
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.chunk);
}

async function fetchKampsparEvidenceAnn(
  uid: string,
  question: string,
  limit: number
): Promise<KampsparEvidenceChunk[]> {
  const embedding = await generateEmbeddingInternal(question);
  if (embedding.length === 0) return [];

  const db = admin.firestore();

  const kampsparSnap = await db
    .collection('kampspar')
    .where('ownerId', '==', uid)
    .findNearest('embedding', admin.firestore.FieldValue.vector(embedding), {
      limit,
      distanceMeasure: 'COSINE',
      distanceResultField: 'vectorDistance',
    } as any)
    .get();

  const kbSnap = await db
    .collection('kb_docs')
    .where('ownerId', '==', uid)
    .findNearest('embedding', admin.firestore.FieldValue.vector(embedding), {
      limit,
      distanceMeasure: 'COSINE',
      distanceResultField: 'vectorDistance',
    } as any)
    .get();

  const results: Array<{ distance: number; chunk: KampsparEvidenceChunk }> = [];

  for (const doc of kampsparSnap.docs) {
    const data = doc.data();
    results.push({
      distance: data.vectorDistance ?? Number.MAX_VALUE,
      chunk: chunkFromDoc('kampspar', doc.id, data),
    });
  }

  for (const doc of kbSnap.docs) {
    const data = doc.data();
    results.push({
      distance: data.vectorDistance ?? Number.MAX_VALUE,
      chunk: chunkFromDoc('kb_docs', doc.id, data),
    });
  }

  results.sort((a, b) => a.distance - b.distance);
  const chunks = results.map((r) => r.chunk).slice(0, limit);

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
    console.log(`[kampsparQueryRag] lexical ${chunks.length} träffar för uid=${uid}`);
  }
  return chunks;
}

/**
 * Minne-scoped RAG (Kunskap only): hybrid ANN ∪ lexical via RRF.
 * Aldrig Valv/Barnen. Metrics: ann_hit / lexical_hit / hybrid_rrf.
 */
export async function fetchKampsparEvidenceForQuery(
  uid: string,
  question: string,
  limit = 12
): Promise<KampsparEvidenceChunk[]> {
  let annChunks: KampsparEvidenceChunk[] = [];
  let lexicalChunks: KampsparEvidenceChunk[] = [];

  try {
    annChunks = await fetchKampsparEvidenceAnn(uid, question, limit);
  } catch (err) {
    console.warn('[kampsparQueryRag] ANN misslyckades:', err);
  }

  try {
    lexicalChunks = await fetchKampsparEvidenceTokenFallback(uid, question, limit);
  } catch (err) {
    console.warn('[kampsparQueryRag] lexical misslyckades:', err);
  }

  if (annChunks.length === 0 && lexicalChunks.length === 0) {
    console.log(`[kampsparQueryRag] metrics ann_hit=0 lexical_hit=0 hybrid_rrf=0 uid=${uid}`);
    return [];
  }

  if (annChunks.length > 0 && lexicalChunks.length > 0) {
    const fused = fuseRrf([annChunks, lexicalChunks], limit);
    console.log(
      `[kampsparQueryRag] metrics ann_hit=${annChunks.length} lexical_hit=${lexicalChunks.length} hybrid_rrf=${fused.length} uid=${uid}`,
    );
    return fused;
  }

  const only = annChunks.length > 0 ? annChunks : lexicalChunks;
  console.log(
    `[kampsparQueryRag] metrics ann_hit=${annChunks.length} lexical_hit=${lexicalChunks.length} hybrid_rrf=0 uid=${uid}`,
  );
  return only.slice(0, limit);
}
