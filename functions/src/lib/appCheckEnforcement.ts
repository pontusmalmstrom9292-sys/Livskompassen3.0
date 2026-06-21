/**
 * App Check Enforcement Middleware — device attestation for callable functions.
 *
 * Validates Firebase App Check tokens on sensitive endpoints.
 * Logs violations for monitoring and gradual enforcement rollout.
 *
 * Enforcement modes:
 * - 'log': Log violations but allow requests (monitoring phase)
 * - 'warn': Log + return warning header
 * - 'enforce': Reject unauthenticated app requests (production)
 */

import { HttpsError } from 'firebase-functions/v2/https';
import type { CallableRequest } from 'firebase-functions/v2/https';
import { monitor } from './monitoring';

export type AppCheckMode = 'log' | 'warn' | 'enforce';

/** Current enforcement mode — change to 'enforce' after GCP Console activation. */
const ENFORCEMENT_MODE: AppCheckMode =
  (process.env.APP_CHECK_MODE as AppCheckMode) ?? 'log';

/**
 * Validate App Check token on a callable request.
 * Call at the beginning of sensitive callables (Valv, WORM writes, agent calls).
 */
export function assertAppCheck(
  request: CallableRequest,
  functionName: string
): void {
  const appCheckToken = request.app;

  if (appCheckToken) {
    // Valid App Check token — allow
    return;
  }

  // No valid token — handle based on mode
  const clientIp = request.rawRequest?.ip ?? 'unknown';
  monitor.log('WARNING', `[AppCheck] Missing token on ${functionName}`, {
    functionName,
    mode: ENFORCEMENT_MODE,
    clientIp,
    'metric.type': 'custom.googleapis.com/appcheck/violation_count',
    'metric.labels': { function_name: functionName, mode: ENFORCEMENT_MODE },
    'metric.value': 1,
  });

  if (ENFORCEMENT_MODE === 'enforce') {
    throw new HttpsError(
      'permission-denied',
      'App Check verification failed. Update your app to the latest version.'
    );
  }
}

/**
 * Get current App Check enforcement status for diagnostics.
 */
export function getAppCheckStatus(): {
  mode: AppCheckMode;
  enforced: boolean;
} {
  return {
    mode: ENFORCEMENT_MODE,
    enforced: ENFORCEMENT_MODE === 'enforce',
  };
}
