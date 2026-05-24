import { useStore } from '../store';
import { clearVaultGate, invalidateServerSession } from '../auth/sessionService';

const VAULT_PIN_KEY = 'livskompassen_vault_pin_hash';
const CHILDREN_PIN_KEY = 'livskompassen_children_pin_hash';
const PASSKEY_ID_KEY = 'livskompassen_passkey_id';

export const KILL_SWITCH_EVENT = 'livskompassen:kill-switch';

/** Zero Footprint — omedelbar rensning av känslig lokal state. */
export function executeKillSwitch(): void {
  window.dispatchEvent(new CustomEvent(KILL_SWITCH_EVENT));
  useStore.getState().setVaultUnlocked(false);
  useStore.getState().setActiveDrawer(null);
  clearVaultGate();
  sessionStorage.clear();
  localStorage.removeItem(VAULT_PIN_KEY);
  localStorage.removeItem(CHILDREN_PIN_KEY);
  localStorage.removeItem(PASSKEY_ID_KEY);
  void invalidateServerSession();
}
