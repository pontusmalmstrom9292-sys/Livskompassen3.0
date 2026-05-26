import { GoogleAuthProvider } from 'firebase/auth';

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
