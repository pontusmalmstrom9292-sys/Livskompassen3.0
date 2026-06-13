/**
 * webauthn.ts
 *
 * Lättviktig WebAuthn-gate för VaultZoneGate (zoner inuti Valvet).
 * Primärt flöde — används på webb/desktop. På Capacitor native-platform
 * används isWebAuthnReliable() för att kontrollera om WebAuthn faktiskt
 * fungerar innan vi försöker.
 *
 * authenticateVaultGateUniversal() är den rekommenderade ingångspunkten
 * för alla nya anrop — den hanterar plattformsdetektering automatiskt.
 */

import { isCapacitorNative } from '../platform/capacitorPlatform';
import { isWebAuthnReliable } from './vaultWebAuthnClient';
import { performNativeBiometric } from './nativeBiometricAuth';

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

/**
 * WebAuthn biometrisk gate — returnerar false vid avbrott (grey rock).
 * Anropas enbart om isWebAuthnReliable() === true.
 */
export async function authenticateVaultGate(): Promise<boolean> {
  if (!window.PublicKeyCredential) {
    return false;
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

export type UniversalGateResult = { ok: boolean };

/**
 * Universell autentiseringsgate för VaultZoneGate (zoner inuti Valvet).
 * Väljer rätt autentiseringsmetod baserat på plattform:
 *  - Webb/Desktop  → authenticateVaultGate() (WebAuthn, oförändrat)
 *  - Capacitor     → performNativeBiometric() (Android TEE / iOS Secure Enclave)
 *
 * Obs: Zongates inuti Valvet kräver inte en ny server-session — de
 * kontrollerar bara hasVaultGate() i sessionStorage. Biometrin här
 * verifierar bara att det är rätt person vid zonomslag.
 */
export async function authenticateVaultGateUniversal(): Promise<UniversalGateResult> {
  const webAuthnOk = await isWebAuthnReliable();

  if (webAuthnOk) {
    const ok = await authenticateVaultGate();
    return { ok };
  }

  if (isCapacitorNative()) {
    const bio = await performNativeBiometric();
    return { ok: bio.ok };
  }

  return { ok: false };
}
