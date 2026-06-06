import type { NavigateFunction } from 'react-router-dom';
import { FYREN_BEVIS_HINT } from '../navigation/appNavigation';
import { NAV_PATHS } from '../navigation/navTruth';
import { setVaultGate } from './sessionService';
import { authenticateVaultGate } from './webauthn';
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
  const ok = await authenticateVaultGate();
  if (!ok) {
    options?.onDenied?.(`Fyren avbruten. ${FYREN_BEVIS_HINT}`);
    return false;
  }
  setVaultGate();
  useStore.getState().setVaultUnlocked(true);
  await issueVaultServerSession();
  navigate({
    pathname: options?.pathname ?? NAV_PATHS.VALVET,
    search: options?.search ?? '',
  });
  return true;
}
