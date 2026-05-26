import {
  APP_UNLOCK_PASSKEY_KEY,
  clearAppUnlockSession,
  markAppUnlockedThisSession,
  setAppUnlockEnabled,
} from './appUnlockPrefs';

function randomChallenge(): BufferSource {
  const buf = new ArrayBuffer(32);
  crypto.getRandomValues(new Uint8Array(buf));
  return buf;
}

function rpId(): string {
  const host = window.location.hostname;
  return host === '127.0.0.1' ? 'localhost' : host;
}

export function isAppUnlockSupported(): boolean {
  return typeof window !== 'undefined' && !!window.PublicKeyCredential;
}

/** Registrera eller verifiera fingeravtryck / Face ID för app-upplåsning. */
export async function authenticateAppUnlock(): Promise<boolean> {
  if (!isAppUnlockSupported()) {
    return true;
  }

  try {
    const challenge = randomChallenge();
    const storedId = localStorage.getItem(APP_UNLOCK_PASSKEY_KEY);

    if (!storedId) {
      const cred = (await navigator.credentials.create({
        publicKey: {
          challenge,
          rp: { name: 'Livskompassen', id: rpId() },
          user: {
            id: crypto.getRandomValues(new Uint8Array(16)),
            name: 'app-unlock',
            displayName: 'Livskompassen',
          },
          pubKeyCredParams: [{ alg: -7, type: 'public-key' }],
          authenticatorSelection: {
            userVerification: 'required',
            residentKey: 'required',
          },
        },
      })) as PublicKeyCredential | null;

      if (!cred) return false;
      localStorage.setItem(APP_UNLOCK_PASSKEY_KEY, cred.id);
      setAppUnlockEnabled(true);
      markAppUnlockedThisSession();
      return true;
    }

    const assertion = await navigator.credentials.get({
      publicKey: {
        challenge,
        timeout: 60_000,
        userVerification: 'required',
      },
    });

    if (!assertion) return false;
    markAppUnlockedThisSession();
    return true;
  } catch {
    return false;
  }
}

export async function enableAppUnlock(): Promise<boolean> {
  const ok = await authenticateAppUnlock();
  if (!ok) {
    setAppUnlockEnabled(false);
    localStorage.removeItem(APP_UNLOCK_PASSKEY_KEY);
    clearAppUnlockSession();
  }
  return ok;
}

export function disableAppUnlock(): void {
  setAppUnlockEnabled(false);
  localStorage.removeItem(APP_UNLOCK_PASSKEY_KEY);
  clearAppUnlockSession();
}
