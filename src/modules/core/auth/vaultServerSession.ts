import { httpsCallable } from 'firebase/functions';
import type {
  AuthenticationResponseJSON,
  RegistrationResponseJSON,
} from '@simplewebauthn/browser';
import { functions } from '../firebase/init';
import { awaitAppCheckReady } from '../firebase/appCheck';
import { getVaultWebAuthnContext, isWebAuthnReliable, performVaultWebAuthnForSession } from './vaultWebAuthnClient';
import { formatCallableError } from './callableErrorMessage';
import { isCapacitorNative } from '../platform/capacitorPlatform';
import { performNativeBiometric } from './nativeBiometricAuth';

const TOKEN_KEY = 'livskompassen_vault_session_token';
const EXPIRES_KEY = 'livskompassen_vault_session_expires';

type VaultSessionIssueResult = {
  vaultSessionToken?: string;
  expiresAt?: string;
};

type VaultSessionIssuePayload = {
  webAuthnResponse: RegistrationResponseJSON | AuthenticationResponseJSON;
  rpID: string;
  origin: string;
};

export function getVaultSessionToken(): string | null {
  const token = sessionStorage.getItem(TOKEN_KEY);
  const expiresAt = sessionStorage.getItem(EXPIRES_KEY);
  if (!token || !expiresAt) return null;
  if (new Date(expiresAt).getTime() < Date.now()) {
    clearVaultServerSession();
    return null;
  }
  return token;
}

export function clearVaultServerSession(): void {
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(EXPIRES_KEY);
}

/** Returnerar true om giltig token finns — kan inte förnya utan ny WebAuthn. */
export async function ensureVaultServerSession(): Promise<boolean> {
  return getVaultSessionToken() !== null;
}

type VaultSessionTokenField = { vaultSessionToken?: string };

/**
 * Strukturell bas för callable-payloads — objekt, aldrig primitiv.
 * Tom marker-interface: alla app-callables skickar plain object-literal eller interface.
 */
interface VaultCallablePayloadBase {}

/**
 * Bifogar giltig Valv-session-token till callable-payload om en finns i sessionStorage.
 * T extends VaultCallablePayloadBase — kompilatorn kan säkert härleda T & VaultSessionTokenField.
 */
export function withVaultSessionPayload<T extends VaultCallablePayloadBase>(
  payload: T,
): T & VaultSessionTokenField {
  const vaultSessionToken = getVaultSessionToken();
  return {
    ...payload,
    ...(vaultSessionToken ? { vaultSessionToken } : {}),
  };
}

export type VaultSessionIssueOutcome =
  | { ok: true }
  | { ok: false; message: string };

/** Efter WebAuthn + Fyren — verifierar biometri på server och skapar Valv-session (1 h idle). */
export async function issueVaultServerSession(
  webAuthnResponse: RegistrationResponseJSON | AuthenticationResponseJSON,
): Promise<VaultSessionIssueOutcome> {
  try {
    const appCheckOk = await awaitAppCheckReady({ forceRefresh: false });
    if (!appCheckOk) {
      return {
        ok: false,
        message: formatCallableError({
          code: 'functions/failed-precondition',
          message: 'App Check-verifiering krävs.',
        }),
      };
    }

    const issue = httpsCallable<VaultSessionIssuePayload, VaultSessionIssueResult>(
      functions,
      'issueVaultSession',
    );
    const result = await issue({
      webAuthnResponse,
      ...getVaultWebAuthnContext(),
    });
    const data = result.data;
    if (!data?.vaultSessionToken || !data?.expiresAt) {
      return { ok: false, message: 'Valv-session svarade utan token.' };
    }
    sessionStorage.setItem(TOKEN_KEY, data.vaultSessionToken);
    sessionStorage.setItem(EXPIRES_KEY, data.expiresAt);
    return { ok: true };
  } catch (err) {
    console.warn('[vaultSession] issueVaultSession misslyckades:', err);
    return { ok: false, message: formatCallableError(err) };
  }
}

type BiometricSessionPayload = {
  platform: 'android' | 'ios';
  challengeId: string;
  challengeProof: string;
};

type BiometricChallengeResult = {
  challengeId: string;
  challengeProof: string;
  expiresAt: string;
};

/**
 * Native biometri → Valv-session (Capacitor Android/iOS).
 * Kedja: server-utmaning → OS-biometri → issue med engångsbevis.
 */
export async function issueVaultSessionAfterNativeBiometric(): Promise<VaultSessionIssueOutcome> {
  if (!isCapacitorNative()) {
    return {
      ok: false,
      message: 'Native biometri krävs i Capacitor-appen.',
    };
  }

  try {
    const appCheckOk = await awaitAppCheckReady({ forceRefresh: true });
    if (!appCheckOk) {
      return {
        ok: false,
        message: formatCallableError({
          code: 'functions/failed-precondition',
          message: 'App Check-verifiering krävs.',
        }),
      };
    }

    const begin = httpsCallable<Record<string, never>, BiometricChallengeResult>(
      functions,
      'beginVaultBiometricChallenge',
    );
    const challengeResult = await begin({});
    const challenge = challengeResult.data;
    if (!challenge?.challengeId || !challenge?.challengeProof) {
      return { ok: false, message: 'Biometri-utmaning svarade utan token.' };
    }

    const bio = await performNativeBiometric();
    if (bio.ok === false) {
      return { ok: false, message: bio.message };
    }

    const issue = httpsCallable<BiometricSessionPayload, VaultSessionIssueResult>(
      functions,
      'issueVaultSessionViaBiometric',
    );
    const result = await issue({
      platform: bio.platform,
      challengeId: challenge.challengeId,
      challengeProof: challenge.challengeProof,
    });
    const data = result.data;
    if (!data?.vaultSessionToken || !data?.expiresAt) {
      return { ok: false, message: 'Valv-session (biometri) svarade utan token.' };
    }
    sessionStorage.setItem(TOKEN_KEY, data.vaultSessionToken);
    sessionStorage.setItem(EXPIRES_KEY, data.expiresAt);
    return { ok: true };
  } catch (err) {
    console.warn('[vaultSession] issueVaultSessionAfterNativeBiometric misslyckades:', err);
    return { ok: false, message: formatCallableError(err) };
  }
}

/** @deprecated Använd issueVaultSessionAfterNativeBiometric — kräver challenge-kedja. */
export async function issueVaultSessionViaBiometric(
  _platform: 'android' | 'ios',
): Promise<VaultSessionIssueOutcome> {
  return issueVaultSessionAfterNativeBiometric();
}

/**
 * Säkerställer server-Valv-session före JWT-claim (unlockVault).
 * Återanvänder befintlig token eller utfärdar ny via WebAuthn/native biometri.
 */
export async function ensureVaultServerSessionFromGate(): Promise<VaultSessionIssueOutcome> {
  if (getVaultSessionToken()) {
    return { ok: true };
  }

  const webAuthnOk = await isWebAuthnReliable();
  if (webAuthnOk) {
    const webAuthn = await performVaultWebAuthnForSession();
    if (webAuthn.ok === false) {
      return { ok: false, message: webAuthn.message };
    }
    return issueVaultServerSession(webAuthn.response);
  }

  if (isCapacitorNative()) {
    return issueVaultSessionAfterNativeBiometric();
  }

  return {
    ok: false,
    message: 'Biometri stöds inte i denna miljö. Öppna Valvet via Fyren först.',
  };
}

