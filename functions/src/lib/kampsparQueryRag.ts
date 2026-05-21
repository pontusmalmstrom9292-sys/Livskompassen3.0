import * as admin from 'firebase-admin';

const STOPWORDS = new Set(['och', 'att', 'som', 'det', 'en', 'i', 'på', 'är', 'för', 'med', 'av', 'till']);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .split(/\W+/)
    .filter((t) => t.length > 2 && !STOPWORDS.has(t));
}

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

async function fetchCollectionChunks(
  uid: string,
  collectionName: 'kampspar' | 'kb_docs',
  limit: number
): Promise<{ id: string; data: admin.firestore.DocumentData }[]> {
  const db = admin.firestore();
  try {
    const snap = await db
      .collection(collectionName)
      .where('ownerId', '==', uid)
      .orderBy('createdAt', 'desc')
      .limit(limit)
      .get();
    return snap.docs.map((d) => ({ id: d.id, data: d.data() }));
  } catch {
    return [];
  }
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

/** Minne-scoped RAG: token-match över kampspar + kb_docs, fallback till senaste. */
export async function fetchKampsparEvidenceForQuery(
  uid: string,
  question: string,
  limit = 12
): Promise<KampsparEvidenceChunk[]> {
  const [kampsparDocs, kbDocs] = await Promise.all([
    fetchCollectionChunks(uid, 'kampspar', 100),
    fetchCollectionChunks(uid, 'kb_docs', 50),
  ]);

  const all = [
    ...kampsparDocs.map(({ id, data }) => ({ collection: 'kampspar' as const, id, data })),
    ...kbDocs.map(({ id, data }) => ({ collection: 'kb_docs' as const, id, data })),
  ];

  const tokens = tokenize(question);

  const scored = all.map(({ collection, id, data }) => {
    const chunk = chunkFromDoc(collection, id, data);
    const corpus = `${chunk.title} ${chunk.content}`.toLowerCase();
    const score = tokens.length === 0 ? 0 : tokens.filter((t) => corpus.includes(t)).length;
    return { ...chunk, score };
  });

  const matched = scored.filter((s) => s.score > 0).sort((a, b) => b.score - a.score);
  const selected = (matched.length > 0 ? matched : scored).slice(0, limit);

  return selected.map(({ docId, collection, date, title, excerpt, content }) => ({
    docId,
    collection,
    date,
    title,
    excerpt,
    content,
  }));
}
