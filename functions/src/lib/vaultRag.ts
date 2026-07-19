import { admin } from './firebaseAdmin';

const STOPWORDS = new Set(['och', 'att', 'som', 'det', 'en', 'i', 'på', 'är', 'för', 'med', 'av', 'till']);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .split(/\W+/)
    .filter((t) => t.length > 2 && !STOPWORDS.has(t));
}

function formatDate(value: unknown): string {
  if (value && typeof value === 'object' && 'toDate' in value) {
    const date = (value as { toDate: () => Date }).toDate();
    return date.toISOString().slice(0, 10);
  }
  if (typeof value === 'string') return value.slice(0, 10);
  return '';
}

function searchableText(data: admin.firestore.DocumentData): string {
  const parts = [String(data.truth ?? data.myReality ?? '')];
  if (data.category) parts.push(String(data.category));
  if (data.theirVersion) parts.push(String(data.theirVersion));
  const tags = data.weaverTags as { emotions?: string[]; actors?: string[] } | undefined;
  if (tags?.emotions?.length) parts.push(tags.emotions.join(' '));
  if (tags?.actors?.length) parts.push(tags.actors.join(' '));
  return parts.join(' ').toLowerCase();
}

export interface VaultEvidenceChunk {
  docId: string;
  date: string;
  excerpt: string;
  truth: string;
}

/** Vault-scoped RAG: token-match + vävaren-filter, fallback till senaste poster. */
export async function fetchVaultEvidenceForQuery(
  uid: string,
  question: string,
  limit = 12
): Promise<VaultEvidenceChunk[]> {
  const db = admin.firestore();
  const snap = await db
    .collection('reality_vault')
    .where('ownerId', '==', uid)
    .orderBy('createdAt', 'desc')
    .limit(100)
    .get();

  const docs = snap.docs
    .map((d) => ({ id: d.id, data: d.data() }))
    .filter(({ data }) => data.category !== 'vävaren_metadata');

  const tokens = tokenize(question);

  const scored = docs.map(({ id, data }) => {
    const truth = String(data.truth ?? data.myReality ?? '');
    const corpus = searchableText(data);
    const score = tokens.length === 0 ? 0 : tokens.filter((t) => corpus.includes(t)).length;
    return {
      docId: id,
      date: formatDate(data.createdAt),
      excerpt: truth.slice(0, 200),
      truth,
      score,
    };
  });

  const matched = scored.filter((s) => s.score > 0).sort((a, b) => b.score - a.score);
  const selected = (matched.length > 0 ? matched : scored).slice(0, limit);

  return selected.map(({ docId, date, excerpt, truth }) => ({ docId, date, excerpt, truth }));
}
