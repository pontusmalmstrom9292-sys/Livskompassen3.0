import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { guardSensitiveCallableV2 } from '../lib/callableGuards';
import { isAdaptationSemanticEnabled } from '../lib/adaptationSemanticGate';
import { getAdaptationSemanticProfileDoc } from '../lib/adaptationSemanticStore';
import { rebuildAdaptationSemanticProfileForUser } from '../lib/adaptationSemanticRebuild';

export const getAdaptationSemanticProfile = onCall({ region: 'europe-west1' }, async (request) => {
  const uid = await guardSensitiveCallableV2(request, 'getAdaptationSemanticProfile', 60);

  const enabled = await isAdaptationSemanticEnabled(uid);
  if (!enabled) {
    return { enabled: false, profile: null };
  }

  const profile = await getAdaptationSemanticProfileDoc(uid);
  return { enabled: true, profile };
});

export const rebuildAdaptationSemanticProfile = onCall(
  { region: 'europe-west1' },
  async (request) => {
    const uid = await guardSensitiveCallableV2(request, 'rebuildAdaptationSemanticProfile', 30);

    const enabled = await isAdaptationSemanticEnabled(uid);
    if (!enabled) {
      throw new HttpsError(
        'failed-precondition',
        'Adaptation Semantic är inte aktiverad (adaptation_semantic_v1).',
      );
    }

    try {
      const result = await rebuildAdaptationSemanticProfileForUser(uid);
      return {
        ok: true,
        profile: result.profile,
        changed: result.changed,
        skipped: result.skipped,
      };
    } catch (err) {
      console.error('[rebuildAdaptationSemanticProfile] Fel:', err);
      throw new HttpsError('internal', 'Kunde inte bygga om semantisk profil.');
    }
  },
);
