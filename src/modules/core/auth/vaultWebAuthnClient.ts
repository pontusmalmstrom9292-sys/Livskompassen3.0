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

type BeginVaultWebAuthnResult = {
  flow: 'registration' | 'authentication';
  options: PublicKeyCredentialCreationOptionsJSON | PublicKeyCredentialRequestOptionsJSON;
};

function rpId(): string {
  const host = window.location.hostname;
  return host === '127.0.0.1' ? 'localhost' : host;
}

/** Server-backed WebAuthn — krävs före issueVaultSession. */
export async function performVaultWebAuthnForSession(): Promise<
  RegistrationResponseJSON | AuthenticationResponseJSON | null
> {
  if (!window.PublicKeyCredential) {
    return null;
  }

  try {
    const begin = httpsCallable<
      { rpID: string; origin: string },
      BeginVaultWebAuthnResult
    >(functions, 'beginVaultWebAuthnChallenge');

    const beginResult = await begin({
      rpID: rpId(),
      origin: window.location.origin,
    });

    const { flow, options } = beginResult.data;
    if (flow === 'registration') {
      return await startRegistration({
        optionsJSON: options as PublicKeyCredentialCreationOptionsJSON,
      });
    }

    return await startAuthentication({
      optionsJSON: options as PublicKeyCredentialRequestOptionsJSON,
    });
  } catch (err) {
    console.warn('[vaultWebAuthn] performVaultWebAuthnForSession misslyckades:', err);
    return null;
  }
}

export function getVaultWebAuthnContext(): { rpID: string; origin: string } {
  return {
    rpID: rpId(),
    origin: window.location.origin,
  };
}
