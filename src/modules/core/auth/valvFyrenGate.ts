import type { NavigateFunction } from 'react-router-dom';
import { NAV_PATHS } from '../navigation/navTruth';
import { setVaultGate, clearVaultGate } from './sessionService';
import { performVaultWebAuthnForSession } from './vaultWebAuthnClient';
import { issueVaultServerSession } from './vaultServerSession';
import { isEmailAuthRequired } from './requireEmailAuth';
import { useStore } from '../store';

type OpenValvViaFyrenOptions = {
  pathname?: string;
  search?: string;
  onDenied?: (message: string) => void;
};

/** Kompis-öga 3s-håll (eller nödknapp) → WebAuthn + session gate → Valv (Dagbok bevis). */
export async function openValvViaFyren(
  navigate: NavigateFunction,
  options?: OpenValvViaFyrenOptions,
): Promise<boolean> {
  const { isAuthenticated } = useStore.getState();
  if (!isAuthenticated) {
    options?.onDenied?.(
      isEmailAuthRequired()
        ? 'Logga in med Google eller e-post innan du öppnar Valvet.'
        : 'Logga in via Konto innan du öppnar Valvet.',
    );
    return false;
  }

  const webAuthn = await performVaultWebAuthnForSession();
  if (webAuthn.ok === false) {
    options?.onDenied?.(webAuthn.message);
    return false;
  }

  setVaultGate();
  useStore.getState().setVaultUnlocked(true);

  const issued = await issueVaultServerSession(webAuthn.response);
  if (issued.ok === false) {
    clearVaultGate();
    useStore.getState().setVaultUnlocked(false);
    options?.onDenied?.(issued.message);
    return false;
  }

  navigate({
    pathname: options?.pathname ?? NAV_PATHS.VALVET,
    search: options?.search ?? '',
  });
  return true;
}
