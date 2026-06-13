import {
  startAuthentication,
  startRegistration,
} from '@simplewebauthn/browser';
import { isCapacitorNative } from '../platform/capacitorPlatform';
import type {
  AuthenticationResponseJSON,
  PublicKeyCredentialCreationOptionsJSON,
  PublicKeyCredentialRequestOptionsJSON,
  RegistrationResponseJSON,
} from '@simplewebauthn/browser';
import { httpsCallable } from 'firebase/functions';
import { functions } from '../firebase/init';
import { formatCallableError } from './callableErrorMessage';

type BeginVaultWebAuthnResult = {
  flow: 'registration' | 'authentication';
  options: PublicKeyCredentialCreationOptionsJSON | PublicKeyCredentialRequestOptionsJSON;
};

type BeginVaultWebAuthnPayload = {
  rpID: string;
  origin: string;
  forceRegistration?: boolean;
};

export type VaultWebAuthnSessionResult =
  | { ok: true; response: RegistrationResponseJSON | AuthenticationResponseJSON }
  | { ok: false; message: string };

function rpId(): string {
  const host = window.location.hostname;
  return host === '127.0.0.1' ? 'localhost' : host;
}

/**
 * Returnerar true ENBART om WebAuthn faktiskt är pålitlig i aktuell context.
 *
 * Tre villkor måste vara uppfyllda:
 *  1. window.PublicKeyCredential API måste existera.
 *  2. Vi får INTE vara i en Capacitor native WebView — WebAuthn API
 *     existerar där men kan inte bridga till Android FIDO2 / Credential Manager,
 *     vilket leder till tysta timeouts eller NotAllowedError utan UX-prompt.
 *  3. Enheten måste ha en platform authenticator konfigurerad (fingeravtryck/Face ID).
 *
 * Falskt negativ → Native Biometric fallback aktiveras (säkert).
 * Falskt positiv → 60s tyst hängning i Capacitor (det vi undviker).
 */
export async function isWebAuthnReliable(): Promise<boolean> {
  if (!window.PublicKeyCredential) return false;
  // I Capacitor WebView: API finns men FIDO2-bridging fungerar ej.
  if (isCapacitorNative()) return false;
  if (typeof PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable === 'function') {
    return PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
  }
  return true;
}

function formatWebAuthnClientError(err: unknown): string {
  const name = (err as Error)?.name ?? '';
  if (name === 'NotAllowedError') {
    return 'Biometri avbröts eller nekades. Försök igen och följ systemprompten.';
  }
  if (name === 'SecurityError') {
    return 'Biometri blockerades av enheten. Kontrollera skärmlås och försök igen.';
  }
  if (name === 'AbortError') {
    return 'Biometri avbröts. Håll Fyren igen och verifiera med fingeravtryck.';
  }
  return formatCallableError(err);
}

async function beginVaultChallenge(
  forceRegistration: boolean,
): Promise<BeginVaultWebAuthnResult> {
  const begin = httpsCallable<BeginVaultWebAuthnPayload, BeginVaultWebAuthnResult>(
    functions,
    'beginVaultWebAuthnChallenge',
  );
  const beginResult = await begin({
    rpID: rpId(),
    origin: window.location.origin,
    forceRegistration,
  });
  return beginResult.data;
}

async function runRegistration(): Promise<RegistrationResponseJSON | AuthenticationResponseJSON> {
  const { options } = await beginVaultChallenge(true);
  return startRegistration({
    optionsJSON: options as PublicKeyCredentialCreationOptionsJSON,
  });
}

function isRecoverableAuthError(err: unknown): boolean {
  const name = (err as Error)?.name ?? '';
  return (
    name === 'NotAllowedError' ||
    name === 'InvalidStateError' ||
    name === 'SecurityError' ||
    name === 'AbortError'
  );
}

/** Server-backed WebAuthn — krävs före issueVaultSession. Anropas bara om isWebAuthnReliable() === true. */
export async function performVaultWebAuthnForSession(): Promise<VaultWebAuthnSessionResult> {
  const reliable = await isWebAuthnReliable();
  if (!reliable) {
    return {
      ok: false,
      message: 'WebAuthn är inte tillgängligt i denna miljö. Använd biometri-knappen.',
    };
  }

  try {
    const first = await beginVaultChallenge(false);

    if (first.flow === 'registration') {
      const response = await startRegistration({
        optionsJSON: first.options as PublicKeyCredentialCreationOptionsJSON,
      });
      return { ok: true, response };
    }

    try {
      const response = await startAuthentication({
        optionsJSON: first.options as PublicKeyCredentialRequestOptionsJSON,
      });
      return { ok: true, response };
    } catch (authErr) {
      if (!isRecoverableAuthError(authErr)) {
        throw authErr;
      }
      console.warn('[vaultWebAuthn] Enhets-passkey saknas — registrerar denna enhet:', authErr);
      const response = await runRegistration();
      return { ok: true, response };
    }
  } catch (err) {
    console.warn('[vaultWebAuthn] performVaultWebAuthnForSession misslyckades:', err);
    return { ok: false, message: formatWebAuthnClientError(err) };
  }
}

export function getVaultWebAuthnContext(): { rpID: string; origin: string } {
  return {
    rpID: rpId(),
    origin: window.location.origin,
  };
}
