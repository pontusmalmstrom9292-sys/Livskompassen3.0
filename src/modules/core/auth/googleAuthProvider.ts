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
const SKIP_ANONYMOUS_LS_KEY = 'livskompassen_skip_anonymous_once_ls';
const SKIP_ANONYMOUS_TTL_MS = 5 * 60 * 1000;

export function markSkipAnonymousOnce(): void {
  const expiresAt = String(Date.now() + SKIP_ANONYMOUS_TTL_MS);
  try {
    sessionStorage.setItem(SKIP_ANONYMOUS_KEY, '1');
    localStorage.setItem(SKIP_ANONYMOUS_LS_KEY, expiresAt);
  } catch {
    /* ignore */
  }
}

function consumeSkipAnonymousFromStorage(): boolean {
  try {
    if (sessionStorage.getItem(SKIP_ANONYMOUS_KEY) === '1') {
      sessionStorage.removeItem(SKIP_ANONYMOUS_KEY);
      localStorage.removeItem(SKIP_ANONYMOUS_LS_KEY);
      return true;
    }
    const expiresRaw = localStorage.getItem(SKIP_ANONYMOUS_LS_KEY);
    if (!expiresRaw) return false;
    const expiresAt = Number(expiresRaw);
    localStorage.removeItem(SKIP_ANONYMOUS_LS_KEY);
    if (Number.isFinite(expiresAt) && Date.now() <= expiresAt) {
      return true;
    }
  } catch {
    /* ignore */
  }
  return false;
}

export function consumeSkipAnonymousOnce(): boolean {
  return consumeSkipAnonymousFromStorage();
}

export function clearSkipAnonymousFlag(): void {
  try {
    sessionStorage.removeItem(SKIP_ANONYMOUS_KEY);
    localStorage.removeItem(SKIP_ANONYMOUS_LS_KEY);
  } catch {
    /* ignore */
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
