import { FirebaseAppCheck } from '@capacitor-firebase/app-check';
import { Capacitor, registerPlugin } from '@capacitor/core';
import { initializeAppCheck, ReCaptchaV3Provider, CustomProvider } from 'firebase/app-check';
import { app } from './init';

interface LkNativeBuildPlugin {
  getAppCheckDebugGate(): Promise<{ useDebugProvider: boolean; isDebugBuild: boolean }>;
}

/** Native gate: BuildConfig.DEBUG ∧ non-empty FIREBASE_APP_CHECK_DEBUG_TOKEN (release → false). */
const LkNativeBuild = registerPlugin<LkNativeBuildPlugin>('LkNativeBuild', {
  web: {
    async getAppCheckDebugGate() {
      return { useDebugProvider: false, isDebugBuild: false };
    },
  },
});

let initialized = false;
let initPromise: Promise<void> | null = null;

/**
 * Initierar App Check:
 * - Web: reCAPTCHA v3 (VITE_APP_CHECK_RECAPTCHA_SITE_KEY); debug-token endast i Vite DEV
 * - Android/iOS: Play Integrity / App Attest via native plugin + CustomProvider-brygga till JS SDK
 * - Debug-APK: debug provider endast när native BuildConfig.DEBUG (aldrig enbart p.g.a. Vite .env i release)
 */
export function initAppCheck(): Promise<void> {
  if (initPromise) return initPromise;
  initPromise = doInitAppCheck();
  return initPromise;
}

async function doInitAppCheck(): Promise<void> {
  if (initialized || typeof window === 'undefined') return;

  if (Capacitor.isNativePlatform()) {
    const useDebugProvider = await resolveNativeDebugProvider();
    await FirebaseAppCheck.initialize({
      isTokenAutoRefreshEnabled: true,
      // Boolean endast — token skrivs native via AppCheckDebugBootstrap (SharedPreferences).
      ...(useDebugProvider ? { debugToken: true } : {}),
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

    const appCheck = initializeAppCheck(app, {
      provider,
      isTokenAutoRefreshEnabled: true,
    });
    initialized = true;

    // Tvinga tidig token så Valv-callables inte hinner köra utan X-Firebase-AppCheck.
    try {
      const { getToken } = await import('firebase/app-check');
      await getToken(appCheck, true);
    } catch (err) {
      console.warn(
        useDebugProvider
          ? '[AppCheck] Native debug-token misslyckades — kontrollera token i Firebase Console och att AppCheckDebugBootstrap körts.'
          : '[AppCheck] Native Play Integrity-token misslyckades — release-APK kräver Play Integrity i App Check Console.',
        err,
      );
    }
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

async function resolveNativeDebugProvider(): Promise<boolean> {
  try {
    const gate = await LkNativeBuild.getAppCheckDebugGate();
    return gate.useDebugProvider === true;
  } catch (err) {
    // Fail closed: utan gate → Play Integrity (aldrig debug p.g.a. saknad plugin).
    console.warn('[AppCheck] LkNativeBuild gate saknas — använder Play Integrity/App Attest.', err);
    return false;
  }
}

function debugTokenFromEnv(): string | undefined {
  const token = import.meta.env.VITE_APP_CHECK_DEBUG_TOKEN;
  return typeof token === 'string' && token.length > 0 ? token : undefined;
}
