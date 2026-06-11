import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';
import { app } from './init';

let initialized = false;

/** Initierar App Check när site key finns (prod / dev med debug token). */
export function initAppCheck(): void {
  if (initialized || typeof window === 'undefined') return;

  const siteKey = import.meta.env.VITE_APP_CHECK_RECAPTCHA_SITE_KEY;
  if (!siteKey) return;

  if (import.meta.env.DEV && import.meta.env.VITE_APP_CHECK_DEBUG_TOKEN) {
    (
      globalThis as unknown as { FIREBASE_APPCHECK_DEBUG_TOKEN?: string }
    ).FIREBASE_APPCHECK_DEBUG_TOKEN = import.meta.env.VITE_APP_CHECK_DEBUG_TOKEN;
  }

  initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider(siteKey),
    isTokenAutoRefreshEnabled: true,
  });
  initialized = true;
}
