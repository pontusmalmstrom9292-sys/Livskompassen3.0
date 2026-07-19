import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { admin } from '../lib/firebaseAdmin';
import { GCP_REGION } from '../config';
import { guardSensitiveCallableV2 } from '../lib/callableGuards';
import { capacityScoreToScale10 } from '../../../shared/evolution/capacityScore';

export const calculateSmartAllocation = onCall(
  { region: GCP_REGION },
  async (event) => {
    const uid = await guardSensitiveCallableV2(event, 'calculateSmartAllocation', 10);
    const db = admin.firestore();

    try {
      // 1. Fetch user's capacityScore from user_capability_state
      const capabilityDoc = await db.collection('user_capability_state').doc(uid).get();
      let capacityScore = 5.0;

      if (capabilityDoc.exists) {
        const data = capabilityDoc.data();
        capacityScore = capacityScoreToScale10(
          typeof data?.capacityScore === 'number' ? data.capacityScore : undefined,
        );
      }

      // 2. Fetch project_blocks activity for the last 7 days
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const blocksSnapshot = await db
        .collection('project_blocks')
        .where('ownerId', '==', uid)
        .where('createdAt', '>=', sevenDaysAgo.toISOString())
        .get();

      const blocksCount = blocksSnapshot.size;

      // 3. Calculate smart allocation amount
      // base_amount: 50 SEK
      // Activity bonus: 10 SEK per block created in the last 7 days
      // MåBra multiplier: capacityScore / 10
      const baseAmount = 50;
      const activityBonus = blocksCount * 10;
      const multiplier = capacityScore / 10.0;
      
      const calculatedAmount = Math.round((baseAmount + activityBonus) * multiplier);
      const finalAmount = Math.max(0, calculatedAmount);

      // 4. Create proposal in allocation_proposals with 24h TTL
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24);

      const proposal = {
        userId: uid,
        ownerId: uid,
        amount: finalAmount,
        reasoning: `Based on ${blocksCount} recent project blocks and a MåBra capacity score of ${capacityScore.toFixed(1)}.`,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        // Convert JS Date to Firestore Timestamp for the TTL index to work correctly
        expiresAt: admin.firestore.Timestamp.fromDate(expiresAt),
      };

      const docRef = await db.collection('allocation_proposals').add(proposal);

      return {
        proposalId: docRef.id,
        amount: finalAmount,
        message: 'Smart allocation calculated and saved as proposal.',
      };

    } catch (error) {
      console.error(`Failed to calculate smart allocation for user ${uid}:`, error);
      throw new HttpsError('internal', 'An error occurred during calculation.');
    }
  }
);
