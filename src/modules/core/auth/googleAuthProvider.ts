import { GoogleAuthProvider } from 'firebase/auth';
import { isCapacitorNative } from './capacitorPlatform';

/** Valfri hint i Google-popup (t.ex. din primära e-post i `.env`). */
export function createGoogleProvider(): GoogleAuthProvider {
  const provider = new GoogleAuthProvider();
  const hint = import.meta.env.VITE_GOOGLE_LOGIN_HINT;
  if (typeof hint === 'string' && hint.trim()) {
    provider.setCustomParameters({ login_hint: hint.trim() });
  }
  return provider;
}

export function getExpectedLoginEmail(): string | null {
  const hint = import.meta.env.VITE_GOOGLE_LOGIN_HINT;
  return typeof hint === 'string' && hint.trim() ? hint.trim() : null;
}

const SKIP_ANONYMOUS_KEY = 'livskompassen_skip_anonymous_once';

export function markSkipAnonymousOnce(): void {
  try {
    sessionStorage.setItem(SKIP_ANONYMOUS_KEY, '1');
  } catch {
    /* ignore */
  }
}

export function consumeSkipAnonymousOnce(): boolean {
  try {
    if (sessionStorage.getItem(SKIP_ANONYMOUS_KEY) !== '1') return false;
    sessionStorage.removeItem(SKIP_ANONYMOUS_KEY);
    return true;
  } catch {
    return false;
  }
}

/** Installerad PWA (iOS/Android) — redirect krävs; popup funkar inte i standalone. */
export function isStandalonePwa(): boolean {
  if (typeof window === 'undefined') return false;
  if (window.matchMedia?.('(display-mode: standalone)').matches === true) return true;
  return (navigator as Navigator & { standalone?: boolean }).standalone === true;
}

/** @locked AUTH-G1 — popup i flik; redirect endast standalone PWA; dev-flagga ej prod. */
export function shouldUseGoogleRedirect(): boolean {
  if (typeof navigator === 'undefined') return false;
  if (isCapacitorNative()) return false;
  if (import.meta.env.DEV && import.meta.env.VITE_GOOGLE_SIGNIN_REDIRECT === 'true') {
    return true;
  }
  return isStandalonePwa();
}
