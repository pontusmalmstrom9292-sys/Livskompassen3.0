import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { guardSensitiveCallableV2 } from '../lib/callableGuards';
import { isAdaptationLayerEnabled } from '../lib/adaptationLayerGate';
import {
  ensureAdaptationPrefsDoc,
  getAdaptationPrefsDoc,
  recordAdaptationSignalForUser,
} from '../lib/adaptationPrefsStore';
import type { AdaptationSilo } from '../../../shared/adaptation/adaptationTypes';

const VALID_SILOS: AdaptationSilo[] = ['kunskap', 'valv', 'barnen', 'vardag', 'core'];

export const getAdaptationProfile = onCall({ region: 'europe-west1' }, async (request) => {
  const uid = await guardSensitiveCallableV2(request, 'getAdaptationProfile', 60);

  const enabled = await isAdaptationLayerEnabled(uid);
  if (!enabled) {
    return { enabled: false, prefs: null };
  }

  const prefs = (await getAdaptationPrefsDoc(uid)) ?? (await ensureAdaptationPrefsDoc(uid));
  return { enabled: true, prefs };
});

export const recordAdaptationSignal = onCall({ region: 'europe-west1' }, async (request) => {
  const uid = await guardSensitiveCallableV2(request, 'recordAdaptationSignal', 120);

  const enabled = await isAdaptationLayerEnabled(uid);
  if (!enabled) {
    throw new HttpsError(
      'failed-precondition',
      'Adaptation Layer är inte aktiverad (adaptation_layer_v1).',
    );
  }

  const signalKey = request.data?.signalKey;
  if (!signalKey || typeof signalKey !== 'string') {
    throw new HttpsError('invalid-argument', 'Fältet "signalKey" (string) krävs.');
  }

  const increment =
    typeof request.data?.increment === 'number' ? request.data.increment : undefined;
  const value = request.data?.value;
  if (
    value !== undefined &&
    typeof value !== 'number' &&
    typeof value !== 'string' &&
    typeof value !== 'boolean'
  ) {
    throw new HttpsError('invalid-argument', 'Fältet "value" måste vara number, string eller boolean.');
  }

  const siloRaw = request.data?.silo;
  const silo =
    typeof siloRaw === 'string' && VALID_SILOS.includes(siloRaw as AdaptationSilo)
      ? (siloRaw as AdaptationSilo)
      : 'core';

  try {
    const prefs = await recordAdaptationSignalForUser(uid, {
      signalKey,
      increment,
      value,
      silo,
    });
    return { ok: true, prefs, silo };
  } catch (err) {
    console.error('[recordAdaptationSignal] Fel:', err);
    throw new HttpsError('internal', 'Kunde inte spara adaptationssignal.');
  }
});
