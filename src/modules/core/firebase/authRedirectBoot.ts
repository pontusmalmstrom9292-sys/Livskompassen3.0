import { getRedirectResult } from 'firebase/auth';
import { auth } from './init';

const REDIRECT_BOOT_TIMEOUT_MS = 8_000;

function clearStaleFirebaseRedirectState(): void {
  try {
    for (const key of Object.keys(sessionStorage)) {
      if (key.startsWith('firebase:') && /redirect|pending|authUser/i.test(key)) {
        sessionStorage.removeItem(key);
      }
    }
  } catch {
    /* ignore */
  }
}

function withRedirectBootTimeout(
  promise: Promise<Awaited<ReturnType<typeof getRedirectResult>>>,
): Promise<Awaited<ReturnType<typeof getRedirectResult>>> {
  return new Promise((resolve) => {
    let settled = false;

    const finish = (value: Awaited<ReturnType<typeof getRedirectResult>>) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolve(value);
    };

    const timer = setTimeout(() => {
      console.warn(
        '[authRedirectBoot] getRedirectResult timeout — fortsätter utan redirect-resultat',
      );
      clearStaleFirebaseRedirectState();
      finish(null);
    }, REDIRECT_BOOT_TIMEOUT_MS);

    promise
      .then((value) => finish(value))
      .catch((err: unknown) => {
        console.warn('[authRedirectBoot] getRedirectResult failed', err);
        clearStaleFirebaseRedirectState();
        finish(null);
      });
  });
}

/**
 * Firebase kräver att getRedirectResult() körs direkt efter initializeAuth,
 * före React, service worker och andra auth-anrop — annars missas Google-redirect.
 * Timeout undviker evig vit skärm om redirect-state fastnat efter misslyckad OAuth.
 */
export const googleRedirectBoot: Promise<Awaited<ReturnType<typeof getRedirectResult>>> =
  typeof window !== 'undefined'
    ? withRedirectBootTimeout(getRedirectResult(auth))
    : Promise.resolve(null);
