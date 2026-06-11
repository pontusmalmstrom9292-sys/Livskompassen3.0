import type { NavigateFunction } from 'react-router-dom';
import { FYREN_BEVIS_HINT } from '../navigation/appNavigation';
import { NAV_PATHS } from '../navigation/navTruth';
import { setVaultGate, clearVaultGate } from './sessionService';
import { performVaultWebAuthnForSession } from './vaultWebAuthnClient';
import { issueVaultServerSession } from './vaultServerSession';
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
  const webAuthnResponse = await performVaultWebAuthnForSession();
  if (!webAuthnResponse) {
    options?.onDenied?.(`Fyren avbruten. ${FYREN_BEVIS_HINT}`);
    return false;
  }
  setVaultGate();
  useStore.getState().setVaultUnlocked(true);
  const issued = await issueVaultServerSession(webAuthnResponse);
  if (!issued) {
    clearVaultGate();
    useStore.getState().setVaultUnlocked(false);
    options?.onDenied?.('Valv-session kunde inte skapas. Kontrollera nätverk och försök igen.');
    return false;
  }
  navigate({
    pathname: options?.pathname ?? NAV_PATHS.VALVET,
    search: options?.search ?? '',
  });
  return true;
}
