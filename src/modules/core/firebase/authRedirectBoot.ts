import { getRedirectResult } from 'firebase/auth';
import { auth } from './init';

/**
 * Firebase kräver att getRedirectResult() körs direkt efter initializeAuth,
 * före React, service worker och andra auth-anrop — annars missas Google-redirect.
 */
export const googleRedirectBoot: Promise<Awaited<ReturnType<typeof getRedirectResult>>> =
  typeof window !== 'undefined' ? getRedirectResult(auth) : Promise.resolve(null);
