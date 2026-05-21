import * as admin from 'firebase-admin';

function truncate(text: string, max = 120): string {
  return text.length <= max ? text : `${text.slice(0, max)}…`;
}

async function fetchFirestoreRag(uid: string): Promise<string[]> {
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

  for (const coll of ['kampspar', 'kampspar_logs'] as const) {
    try {
      const field = coll === 'kampspar_logs' ? 'timestamp' : 'createdAt';
      const snap = await db.collection(coll).where('ownerId', '==', uid).orderBy(field, 'desc').limit(5).get();
      for (const d of snap.docs) {
        const data = d.data();
        lines.push(`[${coll}:${d.id}] ${truncate(String(data.content ?? data.text ?? ''))}`);
      }
    } catch {
      // Collection eller index saknas — hoppa över.
    }
  }

  return lines;
}

/** Vector Search stub — aktiveras när VECTOR_SEARCH_INDEX_ID är satt i miljön. */
async function fetchVectorRagExcerpts(_uid: string, _text: string): Promise<string[]> {
  const indexId = process.env.VECTOR_SEARCH_INDEX_ID;
  if (!indexId) return [];

  // Full ANN-query kräver deployat endpoint — fallback till Firestore tills index är live.
  console.log('[kampsparRag] VECTOR_SEARCH_INDEX_ID satt men ANN-query ej wired — Firestore-fallback.');
  return [];
}

/** RAG-kontext för Vävaren: journal + valv + Minne (+ Vector Search stub). */
export async function fetchWeaverRagContext(uid: string, journalText: string): Promise<string> {
  const firestoreLines = await fetchFirestoreRag(uid);
  const vectorLines = await fetchVectorRagExcerpts(uid, journalText);
  const combined = [...firestoreLines, ...vectorLines];
  return combined.join('\n') || '(ingen tidigare kontext)';
}
