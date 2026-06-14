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

    let totalScore = 0;
    let count = 0;

    checkinsSnapshot.forEach((doc) => {
      const data = doc.data();
      // Calculate score based on mood and energy, assuming both are out of 10.
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
        totalScore += docScore / validFields;
        count++;
      }
    });

    const averageScore = count > 0 ? totalScore / count : 0;
    const SAFETY_THRESHOLD = 7.0;

    const economyAdvanced = averageScore >= SAFETY_THRESHOLD;

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
