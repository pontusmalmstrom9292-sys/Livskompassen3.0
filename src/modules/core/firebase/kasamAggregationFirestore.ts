import { getFunctions, httpsCallable } from 'firebase/functions';
import { collection, getDocs, limit, query, where } from 'firebase/firestore';
import { app } from './init';
import { db } from './firestore';
import { FIRESTORE_COLLECTIONS } from '../types/firestore';

export type KasamDimension = 'comprehensible' | 'manageable' | 'meaningful';

export interface KasamAggregationRow {
  id: string;
  scores: {
    comprehensible: number;
    manageable: number;
    meaningful: number;
    overall: number;
  };
  weakestDimension: KasamDimension;
  aggregatedAt?: string;
  createdAt?: string;
}

const KASAM_LABELS: Record<KasamDimension, string> = {
  comprehensible: 'Begriplighet',
  manageable: 'Hanterbarhet',
  meaningful: 'Meningsfullhet',
};

export function kasamDimensionLabel(dim: KasamDimension): string {
  return KASAM_LABELS[dim];
}

/** Triggar server-side KASAM-aggregering (deterministisk, ingen LLM). */
export async function triggerKasamAggregationClient(triggerSource: string): Promise<void> {
  const fn = httpsCallable<{ triggerSource?: string }, unknown>(
    getFunctions(app, 'europe-west1'),
    'triggerKasamAggregation',
  );
  await fn({ triggerSource });
}

/** Senaste KASAM-snapshot för hemkompass-proaktiva kort. */
export async function getLatestKasamAggregation(userId: string): Promise<KasamAggregationRow | null> {
  const q = query(
    collection(db, FIRESTORE_COLLECTIONS.kasam_aggregations),
    where('ownerId', '==', userId),
    limit(8),
  );
  const snap = await getDocs(q);
  if (snap.empty) return null;

  const sorted = snap.docs
    .map((docSnap) => ({ docSnap, data: docSnap.data() }))
    .sort((a, b) => {
      const aTs = String(a.data.createdAt ?? a.data.aggregatedAt ?? '');
      const bTs = String(b.data.createdAt ?? b.data.aggregatedAt ?? '');
      return bTs.localeCompare(aTs);
    });

  const top = sorted[0];
  if (!top) return null;
  const scores = top.data.scores as KasamAggregationRow['scores'] | undefined;
  if (!scores || typeof scores.overall !== 'number') return null;
  return {
    id: top.docSnap.id,
    scores,
    weakestDimension: (top.data.weakestDimension as KasamDimension) ?? 'manageable',
    aggregatedAt: typeof top.data.aggregatedAt === 'string' ? top.data.aggregatedAt : undefined,
    createdAt: typeof top.data.createdAt === 'string' ? top.data.createdAt : undefined,
  };
}
