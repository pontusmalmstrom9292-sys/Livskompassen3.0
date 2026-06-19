import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { guardSensitiveCallableV2 } from '../lib/callableGuards';
import { recordDiscoveryMilestoneServer } from '../lib/recordDiscoveryMilestoneServer';

export const recordDiscoveryMilestone = onCall({ region: 'europe-west1' }, async (request) => {
  const uid = await guardSensitiveCallableV2(request, 'recordDiscoveryMilestone', 20);

  const categoryId = request.data?.categoryId;
  const firstBankId = request.data?.firstBankId;
  if (typeof categoryId !== 'string' || !categoryId.trim()) {
    throw new HttpsError('invalid-argument', 'categoryId krävs.');
  }
  if (typeof firstBankId !== 'string' || !firstBankId.trim()) {
    throw new HttpsError('invalid-argument', 'firstBankId krävs.');
  }

  return recordDiscoveryMilestoneServer(uid, categoryId.trim(), firstBankId.trim());
});
