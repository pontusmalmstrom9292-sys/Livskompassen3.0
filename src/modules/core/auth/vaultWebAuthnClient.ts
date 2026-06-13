import {
  startAuthentication,
  startRegistration,
} from '@simplewebauthn/browser';
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

/** Server-backed WebAuthn — krävs före issueVaultSession. */
export async function performVaultWebAuthnForSession(): Promise<VaultWebAuthnSessionResult> {
  if (!window.PublicKeyCredential) {
    return {
      ok: false,
      message: 'Biometri stöds inte här. Använd en uppdaterad webbläsare eller Android-appen.',
    };
  }

  try {
    if (typeof PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable === 'function') {
      const platformAvailable =
        await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
      if (!platformAvailable) {
        return {
          ok: false,
          message:
            'Enheten har inget fingeravtryck/Face ID konfigurerat för webben. Lägg till skärmlås i systeminställningar.',
        };
      }
    }

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
