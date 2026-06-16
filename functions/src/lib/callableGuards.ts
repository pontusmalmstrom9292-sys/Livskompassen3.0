import { HttpsError, type CallableRequest } from 'firebase-functions/v2/https';
import * as functions from 'firebase-functions';
import { assertRateLimit, RateLimitExceeded } from './rateLimit';

/** Aktiveras i prod efter Firebase Console App Check + `APP_CHECK_ENFORCE=true`. */
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

export function assertAppCheckV1(context: functions.https.CallableContext): void {
  if (!isAppCheckEnforcementEnabled()) return;
  if (!context.app) {
    throw new functions.https.HttpsError('failed-precondition', 'App Check-verifiering krävs.');
  }
}

function rethrowRateLimitV1(err: unknown): never {
  if (err instanceof RateLimitExceeded) {
    throw new functions.https.HttpsError('resource-exhausted', err.message);
  }
  if (err instanceof HttpsError && err.code === 'resource-exhausted') {
    throw new functions.https.HttpsError('resource-exhausted', err.message);
  }
  throw err;
}

/** App Check (när aktiv) + auth + per-UID rate limit för v2 callables. */
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

/** App Check (när aktiv) + auth + per-UID rate limit för v1 callables. */
export async function guardSensitiveCallableV1(
  context: functions.https.CallableContext,
  rateLimitKey: string,
  maxPerMinute = 30,
): Promise<string> {
  assertAppCheckV1(context);
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Autentisering krävs.');
  }

  if (process.env.REQUIRE_EMAIL_AUTH === 'true' && !context.auth.token.email_verified) {
    throw new functions.https.HttpsError('permission-denied', 'Verifierad e-post krävs för denna miljö.');
  }

  try {
    await assertRateLimit(context.auth.uid, rateLimitKey, maxPerMinute);
  } catch (err) {
    rethrowRateLimitV1(err);
  }
  return context.auth.uid;
}
