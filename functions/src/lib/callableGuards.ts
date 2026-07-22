import { HttpsError, type CallableRequest } from 'firebase-functions/v2/https';
import { assertRateLimit } from './rateLimit';

/**
 * Opt-in only. Default off (single-user).
 * Console Firestore App Check måste också vara UNENFORCED (`smoke:app-check-policy`).
 * Aktivera ENFORCED + `APP_CHECK_ENFORCE=true` endast med Pontus PMIR OK.
 */
export function isAppCheckEnforcementEnabled(): boolean {
  if (process.env.FUNCTIONS_EMULATOR === 'true') return false;
  if (process.env.APP_CHECK_ENFORCE === 'false') return false;
  return process.env.APP_CHECK_ENFORCE === 'true';
}

export function assertAppCheckV2(request: Pick<CallableRequest, 'app'>): void {
  if (!isAppCheckEnforcementEnabled()) return;
  if (!request.app) {
    throw new HttpsError('failed-precondition', 'App Check-verifiering krävs.');
  }
}


/** App Check (när aktiv) + auth + per-UID rate limit för callables. */
export async function guardSensitiveCallableV2(
  request: CallableRequest,
  rateLimitKey: string,
  maxPerMinute = 30,
): Promise<string> {
  assertAppCheckV2(request);
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'Autentisering krävs.');
  }
  
  if (process.env.REQUIRE_EMAIL_AUTH === 'true' && !request.auth.token.email_verified) {
    throw new HttpsError('permission-denied', 'Verifierad e-post krävs för denna miljö.');
  }

  await assertRateLimit(request.auth.uid, rateLimitKey, maxPerMinute);
  return request.auth.uid;
}

/** @deprecated Använd guardSensitiveCallableV2 */
export const guardSensitiveCallableV1 = guardSensitiveCallableV2;
