import * as admin from 'firebase-admin';
import { hashPayload } from '../stateStore';

export interface DcapAlertPayload {
  ownerId: string;
  riskScore: number;
  recommendedAction: 'NONE' | 'COACHING' | 'ALERT';
  /** SHA-256 prefix — ingen rå PII (Zero Footprint). */
  inputHash: string;
  detectionCount?: number;
}

export interface DcapAlertResult {
  alertId: string;
  hitlRequired: boolean;
}

/**
 * U2.5 / G38 — Human-in-the-loop vid DCAP ALERT.
 * WORM-post i dcap_alerts; ingen rå text, fail-closed eskalering.
 */
export async function handleDcapAlert(payload: DcapAlertPayload): Promise<DcapAlertResult> {
  const { ownerId, riskScore, recommendedAction, inputHash } = payload;

  if (!ownerId || typeof ownerId !== 'string') {
    throw new Error('dcap_alert: ownerId krävs');
  }
  if (typeof riskScore !== 'number' || riskScore < 0 || riskScore > 100) {
    throw new Error('dcap_alert: ogiltig riskScore');
  }

  const hitlRequired = recommendedAction === 'ALERT' || riskScore >= 70;
  if (!hitlRequired) {
    console.log(`[Synapse:dcap_alert] riskScore=${riskScore} — ingen HITL (under tröskel)`);
    return { alertId: '', hitlRequired: false };
  }

  const existing = await admin
    .firestore()
    .collection('dcap_alerts')
    .where('ownerId', '==', ownerId)
    .where('inputHash', '==', inputHash)
    .limit(1)
    .get();

  if (!existing.empty) {
    const priorId = existing.docs[0].id;
    console.log(`[Synapse:dcap_alert] duplicate inputHash uid=${ownerId} alertId=${priorId}`);
    return { alertId: priorId, hitlRequired: true };
  }

  const docRef = await admin.firestore().collection('dcap_alerts').add({
    ownerId,
    userId: ownerId,
    riskScore,
    recommendedAction,
    inputHash,
    payloadHash: hashPayload({ riskScore, recommendedAction, inputHash }),
    detectionCount: payload.detectionCount ?? 0,
    status: 'pending_human_review',
    source: 'dcap_alert',
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  console.log(
    `[Synapse:dcap_alert] HITL alertId=${docRef.id} uid=${ownerId} riskScore=${riskScore}`
  );

  return { alertId: docRef.id, hitlRequired: true };
}
