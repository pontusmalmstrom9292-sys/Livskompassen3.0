const PASSKEY_ID_KEY = 'livskompassen_passkey_id';

function randomChallenge(): BufferSource {
  const buf = new ArrayBuffer(32);
  crypto.getRandomValues(new Uint8Array(buf));
  return buf;
}

function rpId(): string {
  const host = window.location.hostname;
  return host === '127.0.0.1' ? 'localhost' : host;
}

/** WebAuthn biometrisk gate — returnerar false vid avbroft (grey rock). */
export async function authenticateVaultGate(): Promise<boolean> {
  if (!window.PublicKeyCredential) {
    return true;
  }

  try {
    const challenge = randomChallenge();
    const storedId = localStorage.getItem(PASSKEY_ID_KEY);

    if (!storedId) {
      const cred = (await navigator.credentials.create({
        publicKey: {
          challenge,
          rp: { name: 'Livskompassen', id: rpId() },
          user: {
            id: crypto.getRandomValues(new Uint8Array(16)),
            name: 'vault-gate',
            displayName: 'Valv',
          },
          pubKeyCredParams: [{ alg: -7, type: 'public-key' }],
          authenticatorSelection: {
            userVerification: 'required',
            residentKey: 'required',
          },
        },
      })) as PublicKeyCredential | null;

      if (!cred) return false;
      localStorage.setItem(PASSKEY_ID_KEY, cred.id);
      return true;
    }

    const assertion = await navigator.credentials.get({
      publicKey: {
        challenge,
        timeout: 60_000,
        userVerification: 'required',
      },
    });

    return !!assertion;
  } catch {
    return false;
  }
}
