import * as admin from 'firebase-admin';

import { generateEmbeddingInternal } from './generateEmbeddingInternal';

function truncate(text: string, max = 120): string {
  return text.length <= max ? text : `${text.slice(0, max)}…`;
}

async function fetchWeaverPersonalContext(uid: string): Promise<string[]> {
  const db = admin.firestore();
  const [journalSnap, vaultSnap] = await Promise.all([
    db.collection('journal').where('ownerId', '==', uid).orderBy('createdAt', 'desc').limit(5).get(),
    db.collection('reality_vault').where('ownerId', '==', uid).orderBy('createdAt', 'desc').limit(5).get(),
  ]);

  const lines: string[] = [];

  for (const d of journalSnap.docs) {
    lines.push(`[journal:${d.id}] ${truncate(String(d.data().text ?? ''))}`);
  }
  for (const d of vaultSnap.docs) {
    lines.push(`[reality_vault:${d.id}] ${truncate(String(d.data().truth ?? ''))}`);
  }

  return lines;
}

/** Kunskap-silo only — never call from Vävaren together with personal/Valv context. */
export async function fetchKnowledgeRagContext(uid: string, journalText: string): Promise<string> {
  const firestoreLines: string[] = [];
  const db = admin.firestore();
  for (const coll of ['kampspar', 'kampspar_logs'] as const) {
    try {
      const field = coll === 'kampspar_logs' ? 'timestamp' : 'createdAt';
      const snap = await db.collection(coll).where('ownerId', '==', uid).orderBy(field, 'desc').limit(5).get();
      for (const d of snap.docs) {
        const data = d.data();
        firestoreLines.push(`[${coll}:${d.id}] ${truncate(String(data.content ?? data.text ?? ''))}`);
      }
    } catch {
      // Collection eller index saknas — hoppa över.
    }
  }
  const vectorLines = await fetchVectorRagExcerpts(uid, journalText);
  return [...firestoreLines, ...vectorLines].join('\n') || '(ingen kunskapskontext)';
}

/** Vector Search ANN för Kunskap-silo — Firestore Native Vector Search. */
async function fetchVectorRagExcerpts(uid: string, text: string): Promise<string[]> {
  try {
    const embedding = await generateEmbeddingInternal(text);
    if (embedding.length === 0) return [];

    const db = admin.firestore();
    const limit = 5;

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

    const results: Array<{ distance: number, line: string }> = [];

    for (const doc of kampsparSnap.docs) {
      const data = doc.data();
      const dist = data.vectorDistance ?? Number.MAX_VALUE;
      const line = `[kampspar:${doc.id}] ${truncate(String(data.content ?? data.text ?? ''))}`;
      results.push({ distance: dist, line });
    }

    for (const doc of kbSnap.docs) {
      const data = doc.data();
      const dist = data.vectorDistance ?? Number.MAX_VALUE;
      const line = `[kb_docs:${doc.id}] ${truncate(String(data.content ?? data.text ?? ''))}`;
      results.push({ distance: dist, line });
    }

    results.sort((a, b) => a.distance - b.distance);
    return results.slice(0, limit).map(r => r.line);

  } catch (err) {
    console.warn('[kampsparRag] ANN misslyckades — Firestore-fallback:', err);
    return [];
  }
}

/**
 * RAG-kontext för Vävaren (U1): endast journal + reality_vault.
 * Kunskap (kampspar/kb_docs) hämtas via fetchKnowledgeRagContext — aldrig i samma prompt.
 */
export async function fetchWeaverRagContext(uid: string, _journalText: string): Promise<string> {
  const lines = await fetchWeaverPersonalContext(uid);
  return lines.join('\n') || '(ingen tidigare kontext)';
}
