/** @locked MOD-CORE-MINNE — låst modul; unlock via docs/evaluations/*-unlock-MOD-CORE-MINNE.md */
import { admin } from '../../lib/firebaseAdmin';
import { scoreKasamFromSnippets, type KasamScores } from '../../lib/kasamScoring';

export interface KasamAggregationPayload {
  ownerId: string;
  triggerSource: string;
}

export interface KasamAggregationResult {
  docId: string;
  aggregatedAt: string;
  scores: KasamScores;
  weakestDimension: 'comprehensible' | 'manageable' | 'meaningful';
}

const LOOKBACK_DAYS = 14;
const SNIPPET_LIMIT = 20;
const DEDUP_HOURS = 24;

async function findRecentAggregation(
  db: admin.firestore.Firestore,
  ownerId: string,
): Promise<{ docId: string; scores: KasamScores; weakestDimension: KasamAggregationResult['weakestDimension'] } | null> {
  const since = new Date();
  since.setHours(since.getHours() - DEDUP_HOURS);

  const snap = await db
    .collection('kasam_aggregations')
    .where('ownerId', '==', ownerId)
    .limit(5)
    .get();

  for (const docSnap of snap.docs) {
    const data = docSnap.data();
    const createdAt = data.createdAt?.toDate?.() as Date | undefined;
    if (!createdAt || createdAt < since) continue;
    const scores = data.scores as KasamScores | undefined;
    if (!scores || typeof scores.overall !== 'number') continue;
    return {
      docId: docSnap.id,
      scores,
      weakestDimension:
        (data.weakestDimension as KasamAggregationResult['weakestDimension']) ?? 'manageable',
    };
  }
  return null;
}

function truncate(text: string, max = 400): string {
  const t = text.trim();
  return t.length <= max ? t : `${t.slice(0, max)}…`;
}

async function fetchJournalSnippets(
  db: admin.firestore.Firestore,
  ownerId: string,
): Promise<string[]> {
  const since = new Date();
  since.setDate(since.getDate() - LOOKBACK_DAYS);

  try {
    const snap = await db
      .collection('journal')
      .where('ownerId', '==', ownerId)
      .where('createdAt', '>=', since.toISOString())
      .orderBy('createdAt', 'desc')
      .limit(SNIPPET_LIMIT)
      .get();

    return snap.docs
      .map((d) => truncate(String(d.data().text ?? d.data().content ?? '')))
      .filter((s) => s.length > 0);
  } catch {
    const snap = await db
      .collection('journal')
      .where('ownerId', '==', ownerId)
      .limit(SNIPPET_LIMIT)
      .get();
    return snap.docs
      .map((d) => truncate(String(d.data().text ?? d.data().content ?? '')))
      .filter((s) => s.length > 0);
  }
}

/** Kunskap-silo only — kampspar for same owner (no cross-silo RAG merge). */
async function fetchKampsparSnippets(
  db: admin.firestore.Firestore,
  ownerId: string,
): Promise<string[]> {
  try {
    const snap = await db
      .collection('kampspar')
      .where('ownerId', '==', ownerId)
      .orderBy('createdAt', 'desc')
      .limit(SNIPPET_LIMIT)
      .get();

    return snap.docs
      .map((d) => {
        const data = d.data();
        const title = String(data.title ?? '');
        const content = String(data.content ?? data.text ?? '');
        return truncate([title, content].filter(Boolean).join(' — '));
      })
      .filter((s) => s.length > 0);
  } catch {
    return [];
  }
}

function weakestDimension(scores: KasamScores): 'comprehensible' | 'manageable' | 'meaningful' {
  const dims: Array<{ key: 'comprehensible' | 'manageable' | 'meaningful'; score: number }> = [
    { key: 'comprehensible', score: scores.comprehensible },
    { key: 'manageable', score: scores.manageable },
    { key: 'meaningful', score: scores.meaningful },
  ];
  dims.sort((a, b) => a.score - b.score);
  return dims[0]!.key;
}

/**
 * ADK-Synaps för KASAM-aggregering.
 * Läser journal (vardag) + kampspar (kunskap) separat — aggregerar deterministiskt, ingen LLM.
 */
export async function handleKasamAggregation(
  payload: KasamAggregationPayload,
): Promise<KasamAggregationResult> {
  const { ownerId, triggerSource } = payload;
  if (!ownerId) {
    throw new Error('kasam_aggregation: ownerId krävs');
  }

  const db = admin.firestore();

  const recent = await findRecentAggregation(db, ownerId);
  if (recent) {
    console.log(`[Synapse:kasam_aggregation] dedup uid=${ownerId} docId=${recent.docId}`);
    return {
      docId: recent.docId,
      aggregatedAt: new Date().toISOString(),
      scores: recent.scores,
      weakestDimension: recent.weakestDimension,
    };
  }

  const [journalSnippets, kampsparSnippets] = await Promise.all([
    fetchJournalSnippets(db, ownerId),
    fetchKampsparSnippets(db, ownerId),
  ]);

  const scores = scoreKasamFromSnippets(journalSnippets, kampsparSnippets);
  const weak = weakestDimension(scores);

  const aggregatedData = {
    ownerId,
    userId: ownerId,
    triggerSource,
    status: 'aggregated',
    scores,
    weakestDimension: weak,
    journalSnippetCount: scores.journalSnippetCount,
    kampsparSnippetCount: scores.kampsparSnippetCount,
    lookbackDays: LOOKBACK_DAYS,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  };

  const docRef = await db.collection('kasam_aggregations').add(aggregatedData);

  console.log(
    `[Synapse:kasam_aggregation] uid=${ownerId} overall=${scores.overall} weak=${weak} docId=${docRef.id}`,
  );

  return {
    docId: docRef.id,
    aggregatedAt: new Date().toISOString(),
    scores,
    weakestDimension: weak,
  };
}
