import { onCall, HttpsError } from 'firebase-functions/v2/https';
import {
  claimBarnportenPairingForUser,
  createBarnportenPairingForUser,
} from '../../lib/barnportenPairing';
import { guardSensitiveCallableV2 } from '../../lib/callableGuards';

export const createBarnportenPairing = onCall({ region: 'europe-west1' }, async (request) => {
  const uid = await guardSensitiveCallableV2(request, 'createBarnportenPairing', 10);
  const origin =
    typeof request.data?.origin === 'string' && request.data.origin.startsWith('http')
      ? request.data.origin
      : 'https://gen-lang-client-0481875058.web.app';
  try {
    return await createBarnportenPairingForUser(
      uid,
      request.data?.childAlias,
      origin,
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Kunde inte skapa QR-kod.';
    throw new HttpsError(
      message.includes('Ogiltigt') ? 'invalid-argument' : 'internal',
      message,
    );
  }
});

export const claimBarnportenPairing = onCall({ region: 'europe-west1' }, async (request) => {
  const uid = await guardSensitiveCallableV2(request, 'claimBarnportenPairing', 10);
  try {
    return await claimBarnportenPairingForUser(
      uid,
      request.data?.token,
      request.data?.deviceId,
      request.data?.deviceLabel,
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Koppling misslyckades.';
    const code =
      message.includes('Ogiltig') ||
      message.includes('hittades') ||
      message.includes('använd') ||
      message.includes('gått ut') ||
      message.includes('samma konto')
        ? 'failed-precondition'
        : 'internal';
    throw new HttpsError(code, message);
  }
});
