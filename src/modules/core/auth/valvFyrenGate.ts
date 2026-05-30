import type { NavigateFunction } from 'react-router-dom';
import { FYREN_BEVIS_HINT } from '../navigation/appNavigation';
import { setVaultGate } from './sessionService';
import { authenticateVaultGate } from './webauthn';

type OpenValvViaFyrenOptions = {
  pathname?: string;
  search?: string;
  onDenied?: (message: string) => void;
};

/** Fyren 3s-håll → WebAuthn + session gate → Valv (Dagbok bevis). */
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
  navigate({
    pathname: options?.pathname ?? '/dagbok',
    search: options?.search ?? '?tab=bevis',
  });
  return true;
}
