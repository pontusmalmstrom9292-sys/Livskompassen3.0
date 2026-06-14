import { onDocumentWritten } from 'firebase-functions/v2/firestore';
import * as admin from 'firebase-admin';
import { GCP_REGION } from '../config';

export const mabraEconomySync = onDocumentWritten(
  {
    document: 'mabra_progress/{uid}',
    region: GCP_REGION,
  },
  async (event) => {
    const uid = event.params.uid;
    const db = admin.firestore();

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Get checkins for the last 7 days for this user
    const checkinsSnapshot = await db
      .collection('checkins')
      .where('userId', '==', uid)
      .where('questionId', '==', 'mabra_checkin')
      .where('createdAt', '>=', sevenDaysAgo.toISOString())
      .get();

    let totalScore7d = 0;
    let count7d = 0;

    let totalScore48h = 0;
    let count48h = 0;

    const fortyEightHoursAgo = new Date();
    fortyEightHoursAgo.setHours(fortyEightHoursAgo.getHours() - 48);
    const time48hStr = fortyEightHoursAgo.toISOString();

    checkinsSnapshot.forEach((doc) => {
      const data = doc.data();
      let docScore = 0;
      let validFields = 0;

      if (typeof data.mood === 'number') {
        docScore += data.mood;
        validFields++;
      }
      if (typeof data.energy === 'number') {
        docScore += data.energy;
        validFields++;
      }

      if (validFields > 0) {
        const avgDocScore = docScore / validFields;
        totalScore7d += avgDocScore;
        count7d++;

        // 48-hour trend
        if (data.createdAt >= time48hStr) {
          totalScore48h += avgDocScore;
          count48h++;
        }
      }
    });

    const averageScore7d = count7d > 0 ? totalScore7d / count7d : 0;
    const averageScore48h = count48h > 0 ? totalScore48h / count48h : 0;
    const SAFETY_THRESHOLD = 7.0;

    let economyAdvanced = averageScore7d >= SAFETY_THRESHOLD;

    // Circuit Breaker validation: Verify last 48 hours trend
    if (count48h > 0 && averageScore48h < SAFETY_THRESHOLD) {
      economyAdvanced = false;

      // Log DCAP alert (WORM-compliance)
      await db.collection('dcap_alerts').add({
        ownerId: uid,
        userId: uid,
        riskScore: 80, // High cognitive load / fatigue signal
        recommendedAction: 'ALERT',
        inputHash: 'mabra_economy_circuit_breaker',
        payloadHash: 'mabra_economy_circuit_breaker',
        status: 'pending_human_review',
        source: 'dcap_alert',
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        metadata: {
          reason: 'Circuit Breaker: 48h MåBra trend below safety threshold',
          averageScore48h,
          averageScore7d,
        }
      });
      console.log(`[CircuitBreaker] Tripped for user ${uid}. Logged dcap_alert.`);
    }

    // WORM: vi uppdaterar bara den flaggan och lastUpdated, inget historiskt raderas
    await db.collection('user_economy_status').doc(uid).set(
      {
        userId: uid,
        ownerId: uid,
        economy_advanced: economyAdvanced,
        lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );
  }
);
