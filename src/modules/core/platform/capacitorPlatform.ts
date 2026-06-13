/**
 * capacitorPlatform.ts
 *
 * Lättviktig plattformsdetektering utan extra imports.
 * `window.Capacitor` injekteras automatiskt av @capacitor/core vid runtime
 * i Android/iOS-skalet. I vanlig webbläsare är det undefined.
 *
 * Används för att välja rätt autentiseringsväg i Valvet:
 *   - Webb/Desktop  → WebAuthn (befintligt flöde, oförändrat)
 *   - Android/iOS   → Native Biometric fallback (nytt flöde)
 */

interface CapacitorGlobal {
  getPlatform?: () => string;
  isNativePlatform?: () => boolean;
}

function getCapacitorGlobal(): CapacitorGlobal | undefined {
  return (window as unknown as { Capacitor?: CapacitorGlobal }).Capacitor;
}

/**
 * Returnerar 'android' | 'ios' | 'web'.
 * Faller tillbaka på 'web' om Capacitor inte är tillgängligt.
 */
export function getCapacitorPlatform(): 'android' | 'ios' | 'web' {
  const cap = getCapacitorGlobal();
  if (!cap) return 'web';
  const platform = cap.getPlatform?.();
  if (platform === 'android' || platform === 'ios') return platform;
  return 'web';
}

/**
 * True om appen körs i en native Capacitor-shell (Android eller iOS).
 * False i webbläsare, Vite dev-server, etc.
 */
export function isCapacitorNative(): boolean {
  const cap = getCapacitorGlobal();
  if (!cap) return false;
  // Föredra isNativePlatform() om tillgängligt (Capacitor 5+)
  if (typeof cap.isNativePlatform === 'function') {
    return cap.isNativePlatform();
  }
  return getCapacitorPlatform() !== 'web';
}

/** Bekvämlighetsalias — true om Android Capacitor-shell. */
export function isAndroidCapacitor(): boolean {
  return getCapacitorPlatform() === 'android';
}
