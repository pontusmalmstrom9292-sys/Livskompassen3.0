import { httpsCallable } from 'firebase/functions';
import { functions } from '../firebase/init';

const TOKEN_KEY = 'livskompassen_vault_session_token';
const EXPIRES_KEY = 'livskompassen_vault_session_expires';

type VaultSessionIssueResult = {
  vaultSessionToken?: string;
  expiresAt?: string;
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

/** Återanvänd giltig token eller skapa ny via issueVaultSession. */
export async function ensureVaultServerSession(): Promise<boolean> {
  if (getVaultSessionToken()) return true;
  return issueVaultServerSession();
}

export function withVaultSessionPayload<T>(payload: T): T & { vaultSessionToken?: string } {
  const vaultSessionToken = getVaultSessionToken();
  return vaultSessionToken ? { ...payload, vaultSessionToken } : payload;
}

/** Efter WebAuthn + Fyren — skapar server-side Valv-session (1 h idle). */
export async function issueVaultServerSession(): Promise<boolean> {
  try {
    const issue = httpsCallable<Record<string, never>, VaultSessionIssueResult>(
      functions,
      'issueVaultSession',
    );
    const result = await issue({});
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
