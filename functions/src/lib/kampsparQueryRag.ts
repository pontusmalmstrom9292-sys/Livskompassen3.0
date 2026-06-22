import * as admin from 'firebase-admin';
import { generateEmbeddingInternal } from './generateEmbeddingInternal';
import { isVectorSearchConfigured, queryKampsparVectorNeighbors } from './vectorSearchClient';

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
  const neighborDocIds = await queryKampsparVectorNeighbors(embedding, limit);
  if (neighborDocIds.length === 0) return [];

  const db = admin.firestore();
  const chunks: KampsparEvidenceChunk[] = [];

  for (const docId of neighborDocIds) {
    const doc = await db.collection('kampspar').doc(docId).get();
    if (!doc.exists) continue;
    const data = doc.data();
    if (!data || data.ownerId !== uid) continue;
    chunks.push(chunkFromDoc('kampspar', docId, data));
  }

  if (chunks.length > 0) {
    console.log(`[kampsparQueryRag] ANN ${chunks.length} träffar för uid=${uid}`);
  }
  return chunks;
}

/** Minne-scoped RAG: ANN (kampspar) via Vertex Vector Search. */
export async function fetchKampsparEvidenceForQuery(
  uid: string,
  question: string,
  limit = 12
): Promise<KampsparEvidenceChunk[]> {
  if (isVectorSearchConfigured()) {
    try {
      const annChunks = await fetchKampsparEvidenceAnn(uid, question, limit);
      return annChunks.slice(0, limit);
    } catch (err) {
      console.warn('[kampsparQueryRag] ANN misslyckades:', err);
      return [];
    }
  }

  console.warn('[kampsparQueryRag] Vector Search ej konfigurerad. Returnerar [].');
  return [];
}
