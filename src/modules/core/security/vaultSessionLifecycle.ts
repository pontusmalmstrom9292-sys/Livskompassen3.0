import { clearAllVaultZones, hasVaultGate, invalidateServerSession } from '../auth/sessionService';
import { ensureVaultServerSession } from '../auth/vaultServerSession';
import { useStore } from '../store';

type EndVaultSessionOptions = {
  /** Default true — rensar Vertex-cache + Firestore vault_session. */
  invalidateServer?: boolean;
  /** Default true — stänger drawer om öppen. */
  closeDrawer?: boolean;
};

/** Zero Footprint — client gate + server token + valfri invalidateSession. */
export async function endVaultSession(options?: EndVaultSessionOptions): Promise<void> {
  const { invalidateServer = true, closeDrawer = true } = options ?? {};
  clearAllVaultZones();
  useStore.getState().setVaultUnlocked(false);
  if (closeDrawer) {
    useStore.getState().setActiveDrawer(null);
  }
  if (invalidateServer && useStore.getState().isAuthenticated) {
    await invalidateServerSession();
  }
}

/** Synka store med befintlig sessionStorage-gate (t.ex. efter refresh). */
export function syncVaultUnlockedFromGate(): void {
  if (useStore.getState().ui.isVaultUnlocked) return;
  if (hasVaultGate()) {
    useStore.getState().setVaultUnlocked(true);
  }
}

/** Efter Fyren/gate — säkerställ server-token för Valv-callables. */
export async function ensureVaultSessionReady(): Promise<boolean> {
  if (!hasVaultGate()) return false;
  syncVaultUnlockedFromGate();
  return ensureVaultServerSession();
}
