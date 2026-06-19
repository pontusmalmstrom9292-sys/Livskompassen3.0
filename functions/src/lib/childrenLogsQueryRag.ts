import * as admin from 'firebase-admin';
import { isParentVisibleChildLog } from './childObservationEpistemics';

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

function searchableText(data: admin.firestore.DocumentData): string {
  const parts: string[] = [];
  if (data.childAlias) parts.push(String(data.childAlias));
  if (data.action) parts.push(String(data.action));
  if (data.category) parts.push(String(data.category));
  if (data.observation) parts.push(String(data.observation));
  if (data.truth) parts.push(String(data.truth));
  if (data.childrenImpact) parts.push(String(data.childrenImpact));
  const signals = data.signals as { somn?: number; angest?: number; aptit?: number } | undefined;
  if (signals) {
    parts.push(`sömn ${signals.somn ?? ''} ångest ${signals.angest ?? ''} aptit ${signals.aptit ?? ''}`);
  }
  return parts.join(' ').toLowerCase();
}

function excerptForDoc(data: admin.firestore.DocumentData): string {
  if (data.action === 'fysiologi' && data.signals) {
    const s = data.signals as { somn?: number; angest?: number; aptit?: number };
    return `Fysiologi — sömn ${s.somn ?? '?'}, ångest ${s.angest ?? '?'}, aptit ${s.aptit ?? '?'}`;
  }
  const text = String(data.observation ?? data.truth ?? '');
  return text.slice(0, 200);
}

export interface ChildrenLogEvidenceChunk {
  docId: string;
  childAlias: string;
  date: string;
  action: string;
  excerpt: string;
  body: string;
}

/**
 * Barnen-silo RAG — läser ENDAST `children_logs`. MUST NOT anropa valv/kampspar.
 */
export async function fetchChildrenLogsForQuery(
  uid: string,
  question: string,
  childAlias?: string,
  limit = 12
): Promise<ChildrenLogEvidenceChunk[]> {
  const db = admin.firestore();
  const snap = await db
    .collection('children_logs')
    .where('ownerId', '==', uid)
    .orderBy('createdAt', 'desc')
    .limit(100)
    .get();

  let docs = snap.docs
    .map((d) => ({ id: d.id, data: d.data() }))
    .filter(({ data }) => isParentVisibleChildLog(data));

  if (childAlias && typeof childAlias === 'string') {
    const alias = childAlias.trim();
    docs = docs.filter(({ data }) => String(data.childAlias ?? '') === alias);
  }

  const tokens = tokenize(question);

  const scored = docs.map(({ id, data }) => {
    const corpus = searchableText(data);
    const score = tokens.length === 0 ? 0 : tokens.filter((t) => corpus.includes(t)).length;
    const body =
      data.action === 'fysiologi'
        ? excerptForDoc(data)
        : String(data.observation ?? data.truth ?? '');
    return {
      docId: id,
      childAlias: String(data.childAlias ?? ''),
      date: formatDate(data.createdAt),
      action: String(data.action ?? 'livslogg'),
      excerpt: excerptForDoc(data),
      body,
      score,
    };
  });

  const matched = scored.filter((s) => s.score > 0).sort((a, b) => b.score - a.score);
  const selected = (matched.length > 0 ? matched : scored).slice(0, limit);

  return selected.map(({ docId, childAlias: alias, date, action, excerpt, body }) => ({
    docId,
    childAlias: alias,
    date,
    action,
    excerpt,
    body,
  }));
}
