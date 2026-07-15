import { FirebaseAppCheck } from '@capacitor-firebase/app-check';
import { Capacitor } from '@capacitor/core';
import { initializeAppCheck, ReCaptchaV3Provider, CustomProvider } from 'firebase/app-check';
import { app } from './init';

let initialized = false;
let initPromise: Promise<void> | null = null;

/**
 * Initierar App Check:
 * - Web: reCAPTCHA v3 (VITE_APP_CHECK_RECAPTCHA_SITE_KEY)
 * - Android/iOS: Play Integrity / App Attest via native plugin + CustomProvider-brygga till JS SDK
 */
export function initAppCheck(): Promise<void> {
  if (initPromise) return initPromise;
  initPromise = doInitAppCheck();
  return initPromise;
}

async function doInitAppCheck(): Promise<void> {
  if (initialized || typeof window === 'undefined') return;

  if (Capacitor.isNativePlatform()) {
    const debugToken = debugTokenFromEnv();
    await FirebaseAppCheck.initialize({
      isTokenAutoRefreshEnabled: true,
      // Debug-APK (Android Studio): token i .env + Firebase Console → App Check → Manage debug tokens.
      ...(debugToken ? { debugToken } : {}),
    });

    const provider = new CustomProvider({
      getToken: async () => {
        const result = await FirebaseAppCheck.getToken({ forceRefresh: false });
        return {
          token: result.token,
          expireTimeMillis: result.expireTimeMillis ?? Date.now() + 3_600_000,
        };
      },
    });

    initializeAppCheck(app, {
      provider,
      isTokenAutoRefreshEnabled: true,
    });
    initialized = true;
    return;
  }

  const siteKey = import.meta.env.VITE_APP_CHECK_RECAPTCHA_SITE_KEY;
  if (!siteKey) {
    if (!import.meta.env.DEV) {
      console.error(
        '[AppCheck] VITE_APP_CHECK_RECAPTCHA_SITE_KEY saknas i build — Valv-callables blockeras (APP_CHECK_ENFORCE).',
      );
    }
    return;
  }

  if (import.meta.env.DEV && debugTokenFromEnv()) {
    (globalThis as unknown as { FIREBASE_APPCHECK_DEBUG_TOKEN?: string }).FIREBASE_APPCHECK_DEBUG_TOKEN =
      debugTokenFromEnv();
  }

  const appCheck = initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider(siteKey),
    isTokenAutoRefreshEnabled: true,
  });
  initialized = true;

  try {
    const { getToken } = await import('firebase/app-check');
    getToken(appCheck, false).catch(err => {
      console.warn(
        '[AppCheck] Token-utbyte misslyckades (400 = site key ej registrerad i Console för denna web-app, eller fel domän).',
        'Se docs/evaluations/2026-06-15-appcheck-400-fix.md',
        err,
      );
    });
  } catch (err) {
    console.warn('[AppCheck] Import failed', err);
  }
}

function debugTokenFromEnv(): string | undefined {
  const token = import.meta.env.VITE_APP_CHECK_DEBUG_TOKEN;
  return typeof token === 'string' && token.length > 0 ? token : undefined;
}
