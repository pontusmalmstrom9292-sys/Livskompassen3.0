import { onSchedule } from 'firebase-functions/v2/scheduler';
import * as admin from 'firebase-admin';
import { GCP_REGION } from '../config';
import { evaluateBarnportenBracketsForUser } from '../lib/barnportenAgeEvaluator';

/** Veckovis bracket-eval — P2.3 (mirror orkester_barnporten_evaluator). */
export const scheduledBarnportenAgeEval = onSchedule(
  {
    schedule: '0 4 * * 1',
    region: GCP_REGION,
    timeZone: 'Europe/Stockholm',
  },
  async () => {
    const db = admin.firestore();
    const hubs = await db.collection('evolution_hub').limit(200).get();
    let totalUpdated = 0;
    for (const doc of hubs.docs) {
      const { updated } = await evaluateBarnportenBracketsForUser(doc.id);
      totalUpdated += updated.length;
    }
    console.log(`[scheduledBarnportenAgeEval] updated ${totalUpdated} child bracket(s)`);
  },
);
