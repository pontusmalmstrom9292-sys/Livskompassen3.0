import { httpsCallable } from 'firebase/functions';
import type {
  AuthenticationResponseJSON,
  RegistrationResponseJSON,
} from '@simplewebauthn/browser';
import { functions } from '../firebase/init';
import { getVaultWebAuthnContext } from './vaultWebAuthnClient';

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

export function withVaultSessionPayload<T>(payload: T): T & { vaultSessionToken?: string } {
  const vaultSessionToken = getVaultSessionToken();
  return vaultSessionToken ? { ...payload, vaultSessionToken } : payload;
}

/** Efter WebAuthn + Fyren — verifierar biometri på server och skapar Valv-session (1 h idle). */
export async function issueVaultServerSession(
  webAuthnResponse: RegistrationResponseJSON | AuthenticationResponseJSON,
): Promise<boolean> {
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
    if (!data?.vaultSessionToken || !data?.expiresAt) return false;
    sessionStorage.setItem(TOKEN_KEY, data.vaultSessionToken);
    sessionStorage.setItem(EXPIRES_KEY, data.expiresAt);
    return true;
  } catch (err) {
    console.warn('[vaultSession] issueVaultSession misslyckades:', err);
    return false;
  }
}
