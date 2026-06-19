import * as admin from 'firebase-admin';

export type DcapReviewDecision = 'acknowledged' | 'dismissed';

/**
 * Append-only granskning — muterar aldrig dcap_alerts (WORM).
 * Dubbel-granskning idempotent: returnerar befintlig reviewId.
 */
export async function resolveDcapAlertForUser(
  uid: string,
  alertId: string,
  decision: DcapReviewDecision,
): Promise<{ reviewId: string; alreadyReviewed: boolean }> {
  if (!alertId || typeof alertId !== 'string') {
    throw new Error('alertId krävs.');
  }
  if (decision !== 'acknowledged' && decision !== 'dismissed') {
    throw new Error('Ogiltigt granskningsbeslut.');
  }

  const alertSnap = await admin.firestore().collection('dcap_alerts').doc(alertId).get();
  if (!alertSnap.exists) {
    throw new Error('DCAP-larm saknas.');
  }

  const alertData = alertSnap.data();
  const ownerId = typeof alertData?.ownerId === 'string' ? alertData.ownerId : '';
  const userId = typeof alertData?.userId === 'string' ? alertData.userId : ownerId;
  if (ownerId !== uid || userId !== uid) {
    throw new Error('Åtkomst nekad för detta larm.');
  }

  const existing = await admin
    .firestore()
    .collection('dcap_alert_reviews')
    .where('ownerId', '==', uid)
    .where('alertId', '==', alertId)
    .limit(1)
    .get();

  if (!existing.empty) {
    return { reviewId: existing.docs[0].id, alreadyReviewed: true };
  }

  const docRef = await admin.firestore().collection('dcap_alert_reviews').add({
    ownerId: uid,
    userId: uid,
    alertId,
    decision,
    source: 'resolveDcapAlert',
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  return { reviewId: docRef.id, alreadyReviewed: false };
}
