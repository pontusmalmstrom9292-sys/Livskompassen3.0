import { onDocumentWritten } from 'firebase-functions/v2/firestore';
import * as admin from 'firebase-admin';
import { GCP_REGION } from '../config';
import { handleDcapAlert } from '../adk/synapses/dcapAlertSynapse';
import {
  CAPACITY_PLANNING_KANBAN_THRESHOLD,
  MAABRA_MOOD_ENERGY_THRESHOLD,
  moodEnergyAverageToNormalized,
} from '../../../shared/evolution/capacityScore';

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
    const normalizedCapacity = moodEnergyAverageToNormalized(averageScore7d);

    let economyAdvanced = averageScore7d >= MAABRA_MOOD_ENERGY_THRESHOLD;

    // Circuit Breaker validation: Verify last 48 hours trend
    if (count48h > 0 && averageScore48h < MAABRA_MOOD_ENERGY_THRESHOLD) {
      economyAdvanced = false;

      await handleDcapAlert({
        ownerId: uid,
        riskScore: 80,
        recommendedAction: 'ALERT',
        inputHash: 'mabra_economy_circuit_breaker',
        detectionCount: 1,
      });
      console.log(`[CircuitBreaker] Tripped for user ${uid}. Logged dcap_alert.`);
    }

    const planningKanbanUnlocked =
      economyAdvanced && normalizedCapacity >= CAPACITY_PLANNING_KANBAN_THRESHOLD;

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

    // Tri-gate: synka evolution_hub.unlockedFeatureFlags + user_capability_state.economy_advanced
    const hubRef = db.collection('evolution_hub').doc(uid);
    const hubSnap = await hubRef.get();
    const prevFlags = (hubSnap.data()?.unlockedFeatureFlags as string[] | undefined) ?? [];
    const nextFlags = new Set(prevFlags);
    if (economyAdvanced) {
      nextFlags.add('economy_advanced');
    } else {
      nextFlags.delete('economy_advanced');
    }
    if (planningKanbanUnlocked) {
      nextFlags.add('planning_kanban');
    } else {
      nextFlags.delete('planning_kanban');
    }
    await hubRef.set(
      {
        userId: uid,
        ownerId: uid,
        unlockedFeatureFlags: Array.from(nextFlags),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    await db.collection('user_capability_state').doc(uid).set(
      {
        userId: uid,
        ownerId: uid,
        economy_advanced: economyAdvanced,
        capacityScore: normalizedCapacity,
        lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );
  }
);
