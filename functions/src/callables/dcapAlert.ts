import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { guardSensitiveCallableV2 } from '../lib/callableGuards';
import { assertVaultSession } from '../lib/vaultSessionGate';
import {
  resolveDcapAlertForUser,
  type DcapReviewDecision,
} from '../lib/dcapAlertReview';

/** P1.4 — HITL: markera DCAP-larm granskat (append-only review, WORM alert oförändrad). */
export const resolveDcapAlert = onCall({ region: 'europe-west1' }, async (request) => {
  const uid = await guardSensitiveCallableV2(request, 'resolveDcapAlert', 20);
  await assertVaultSession(uid, request.data);

  const alertId = request.data?.alertId;
  const decision = request.data?.decision as DcapReviewDecision | undefined;

  if (!alertId || typeof alertId !== 'string') {
    throw new HttpsError('invalid-argument', 'alertId krävs.');
  }
  if (decision !== 'acknowledged' && decision !== 'dismissed') {
    throw new HttpsError(
      'invalid-argument',
      'decision måste vara acknowledged eller dismissed.',
    );
  }

  try {
    return await resolveDcapAlertForUser(uid, alertId.trim(), decision);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Granskning misslyckades.';
    if (message.includes('Åtkomst nekad') || message.includes('saknas')) {
      throw new HttpsError('permission-denied', message);
    }
    throw new HttpsError('failed-precondition', message);
  }
});
