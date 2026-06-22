import * as admin from 'firebase-admin';

export interface KasamAggregationPayload {
  ownerId: string;
  triggerSource: string;
}

export interface KasamAggregationResult {
  docId: string;
  aggregatedAt: string;
}

/**
 * ADK-Synaps för KASAM-aggregering.
 * Hämtar och sammanställer data för Känsla av sammanhang (Begriplighet, Hanterbarhet, Meningsfullhet).
 */
export async function handleKasamAggregation(payload: KasamAggregationPayload): Promise<KasamAggregationResult> {
  const { ownerId, triggerSource } = payload;
  if (!ownerId) {
    throw new Error('kasam_aggregation: ownerId krävs');
  }

  const db = admin.firestore();
  
  // Här sker själva aggregeringen i framtiden (t.ex. läsa journal och kampspar)
  const aggregatedData = {
    ownerId,
    triggerSource,
    status: 'aggregated',
    timestamp: admin.firestore.FieldValue.serverTimestamp(),
  };

  const docRef = await db.collection('kasam_aggregations').add(aggregatedData);

  console.log(`[Synapse:kasam_aggregation] Aggregerad KASAM för uid=${ownerId}, docId=${docRef.id}`);

  return {
    docId: docRef.id,
    aggregatedAt: new Date().toISOString(),
  };
}
