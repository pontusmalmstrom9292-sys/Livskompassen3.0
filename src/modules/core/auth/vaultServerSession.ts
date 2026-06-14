import { httpsCallable } from 'firebase/functions';
import type {
  AuthenticationResponseJSON,
  RegistrationResponseJSON,
} from '@simplewebauthn/browser';
import { functions } from '../firebase/init';
import { getVaultWebAuthnContext } from './vaultWebAuthnClient';
import { formatCallableError } from './callableErrorMessage';

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
 * Bifogar giltig Valv-session-token till callable-payload om en finns i sessionStorage.
 * T begränsas till object — alla callables tar objekt-payload, aldrig primitiver.
 */
export function withVaultSessionPayload<T extends object>(
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

type BiometricSessionPayload = { platform: 'android' | 'ios' };

/**
 * Skapar en Valv-session via native biometri (Android TEE / iOS Secure Enclave).
 * Används som fallback när WebAuthn inte är tillgängligt i Capacitor WebView.
 *
 * Autentiseringsgarantin ges av:
 *  1. Firebase ID-token (verifieras server-side automatiskt av Cloud Functions)
 *  2. Android TEE-verifierad biometri (utförd av OS innan detta anrop görs)
 *
 * Same Zero Footprint: session är 1h idle, invalidateSession fungerar som vanligt.
 */
export async function issueVaultSessionViaBiometric(
  platform: 'android' | 'ios',
): Promise<VaultSessionIssueOutcome> {
  try {
    const issue = httpsCallable<BiometricSessionPayload, VaultSessionIssueResult>(
      functions,
      'issueVaultSessionViaBiometric',
    );
    const result = await issue({ platform });
    const data = result.data;
    if (!data?.vaultSessionToken || !data?.expiresAt) {
      return { ok: false, message: 'Valv-session (biometri) svarade utan token.' };
    }
    sessionStorage.setItem(TOKEN_KEY, data.vaultSessionToken);
    sessionStorage.setItem(EXPIRES_KEY, data.expiresAt);
    return { ok: true };
  } catch (err) {
    console.warn('[vaultSession] issueVaultSessionViaBiometric misslyckades:', err);
    return { ok: false, message: formatCallableError(err) };
  }
}

