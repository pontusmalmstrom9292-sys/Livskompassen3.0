import { FirebaseAppCheck } from '@capacitor-firebase/app-check';
import { Capacitor, registerPlugin } from '@capacitor/core';
import { initializeAppCheck, ReCaptchaV3Provider, CustomProvider, type AppCheck } from 'firebase/app-check';
import { app } from './init';

interface NativeAppCheckGate {
  useDebugProvider: boolean;
  isDebugBuild: boolean;
  /** Present only when BuildConfig.DEBUG ∧ non-empty FIREBASE_APP_CHECK_DEBUG_TOKEN. */
  debugToken?: string;
}

interface LkNativeBuildPlugin {
  getAppCheckDebugGate(): Promise<NativeAppCheckGate>;
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
let appCheckInstance: AppCheck | null = null;
let lastTokenOk = false;

/**
 * Single-user (Pontus): Valvet får INTE hard-fail när App Check-token saknas
 * (debug-APK / Play Integrity). Inloggning + biometri + firestore.rules skyddar data.
 * Server-enforce styrs separat via Functions `APP_CHECK_ENFORCE` (håll false).
 * Console Firestore App Check måste vara UNENFORCED — se `npm run smoke:app-check-policy`.
 * Sätt ENFORCED / APP_CHECK_ENFORCE=true endast med explicit Pontus PMIR OK.
 */
export const VALV_REQUIRES_APP_CHECK = false;

/**
 * Initierar App Check:
 * - Web: reCAPTCHA v3 (VITE_APP_CHECK_RECAPTCHA_SITE_KEY); debug-token endast i Vite DEV
 * - Android/iOS: Play Integrity / App Attest via native plugin + CustomProvider-brygga till JS SDK
 * - Debug-APK: debug provider via BuildConfig-token (plugin) + AppCheckDebugBootstrap (prefs)
 */
export function initAppCheck(): Promise<void> {
  if (initPromise) return initPromise;
  initPromise = doInitAppCheck();
  return initPromise;
}

/**
 * Väntar in giltig App Check-token innan Valv-callables.
 * När VALV_REQUIRES_APP_CHECK=false: returnerar alltid true (best-effort token i bakgrunden).
 */
export async function awaitAppCheckReady(options?: { forceRefresh?: boolean }): Promise<boolean> {
  if (!VALV_REQUIRES_APP_CHECK) {
    void tryGetTokenSoft(options);
    return true;
  }
  await initAppCheck();
  if (!initialized || !appCheckInstance) return false;
  try {
    const { getToken } = await import('firebase/app-check');
    const force = options?.forceRefresh ?? !lastTokenOk;
    await getToken(appCheckInstance, force);
    lastTokenOk = true;
    return true;
  } catch (err) {
    lastTokenOk = false;
    console.warn('[AppCheck] awaitAppCheckReady misslyckades', err);
    return false;
  }
}

/** Soft token fetch — never blocks Valvet when VALV_REQUIRES_APP_CHECK is false. */
async function tryGetTokenSoft(options?: { forceRefresh?: boolean }): Promise<void> {
  try {
    await initAppCheck();
    if (!initialized || !appCheckInstance) return;
    const { getToken } = await import('firebase/app-check');
    const force = options?.forceRefresh ?? !lastTokenOk;
    await getToken(appCheckInstance, force);
    lastTokenOk = true;
  } catch {
    lastTokenOk = false;
  }
}

/**
 * När VALV_REQUIRES_APP_CHECK=false: no-op (Valvet öppnas utan token).
 * När true: kastar om App Check-token saknas.
 */
export async function requireAppCheckReady(options?: { forceRefresh?: boolean }): Promise<void> {
  if (!VALV_REQUIRES_APP_CHECK) {
    void tryGetTokenSoft(options);
    return;
  }
  const ok = await awaitAppCheckReady(options);
  if (!ok) {
    const err = new Error('App Check-verifiering krävs.') as Error & { code?: string };
    err.code = 'functions/failed-precondition';
    throw err;
  }
}

async function doInitAppCheck(): Promise<void> {
  if (initialized || typeof window === 'undefined') return;

  if (Capacitor.isNativePlatform()) {
    const gate = await resolveNativeDebugGate();
    // Token path priority: BuildConfig string (plugin) → prefs/setprop boolean fallback.
    // Never read VITE_APP_CHECK_DEBUG_TOKEN on native (prod leak risk).
    let nativeDebugToken: string | true | undefined;
    if (gate.useDebugProvider) {
      if (gate.debugToken && gate.debugToken.length > 0) {
        nativeDebugToken = gate.debugToken;
      } else {
        console.warn(
          '[AppCheck] BuildConfig debugToken saknas — fallback boolean (AppCheckDebugBootstrap prefs / adb setprop).',
        );
        nativeDebugToken = true;
      }
    }
    await FirebaseAppCheck.initialize({
      isTokenAutoRefreshEnabled: true,
      ...(nativeDebugToken !== undefined ? { debugToken: nativeDebugToken } : {}),
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

    appCheckInstance = initializeAppCheck(app, {
      provider,
      isTokenAutoRefreshEnabled: true,
    });
    initialized = true;

    // Tvinga tidig token så Valv-callables inte hinner köra utan X-Firebase-AppCheck.
    lastTokenOk = await warmNativeToken(gate.useDebugProvider);
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

  appCheckInstance = initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider(siteKey),
    isTokenAutoRefreshEnabled: true,
  });
  initialized = true;

  try {
    const { getToken } = await import('firebase/app-check');
    getToken(appCheckInstance, false)
      .then(() => {
        lastTokenOk = true;
      })
      .catch(err => {
        lastTokenOk = false;
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

/** Retry warm-up — SharedPreferences/bootstrap can race the first getToken. */
async function warmNativeToken(useDebugProvider: boolean): Promise<boolean> {
  if (!appCheckInstance) return false;
  const { getToken } = await import('firebase/app-check');
  const delays = [0, 250, 750];
  for (const delay of delays) {
    if (delay > 0) await new Promise(r => setTimeout(r, delay));
    try {
      await getToken(appCheckInstance, true);
      return true;
    } catch (err) {
      if (delay === delays[delays.length - 1]) {
        console.warn(
          useDebugProvider
            ? '[AppCheck] Native debug-token misslyckades — bygg om debug-APK (Android Studio Run) så BuildConfig-token bakas in, eller kör npm run android:appcheck-adb med USB.'
            : '[AppCheck] Native Play Integrity-token misslyckades — release-APK kräver Play Integrity i App Check Console.',
          err,
        );
      }
    }
  }
  return false;
}

async function resolveNativeDebugGate(): Promise<{ useDebugProvider: boolean; debugToken?: string }> {
  try {
    const gate = await LkNativeBuild.getAppCheckDebugGate();
    if (gate.useDebugProvider !== true) {
      return { useDebugProvider: false };
    }
    const token =
      typeof gate.debugToken === 'string' && gate.debugToken.length > 0 ? gate.debugToken : undefined;
    return { useDebugProvider: true, debugToken: token };
  } catch (err) {
    // Fail closed: utan gate → Play Integrity (aldrig debug p.g.a. saknad plugin).
    console.warn('[AppCheck] LkNativeBuild gate saknas — använder Play Integrity/App Attest.', err);
    return { useDebugProvider: false };
  }
}

function debugTokenFromEnv(): string | undefined {
  // DEV-only — production must never read/embed a debug token string.
  if (!import.meta.env.DEV) return undefined;
  const token = import.meta.env.VITE_APP_CHECK_DEBUG_TOKEN;
  return typeof token === 'string' && token.length > 0 ? token : undefined;
}
