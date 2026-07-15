import { onCall } from 'firebase-functions/v2/https';
import { guardSensitiveCallableV2 } from '../lib/callableGuards';
import { adkOrchestrator } from '../adk/orchestrator';
import { emitSynapse } from '../adk/synapses/synapseBus';

/** Triggar KASAM-aggregering (deterministisk, flash-free). */
export const triggerKasamAggregation = onCall({ region: 'europe-west1' }, async (request) => {
  const uid = await guardSensitiveCallableV2(request, 'triggerKasamAggregation', 10);

  const triggerSource =
    typeof request.data?.triggerSource === 'string'
      ? request.data.triggerSource.trim()
      : 'callable';

  return emitSynapse(adkOrchestrator, {
    trigger: 'kasam_aggregation',
    contextId: uid,
    payload: {
      ownerId: uid,
      triggerSource,
    },
  });
});
