import { useStore } from '../store';
import { clearAllVaultZones, invalidateServerSession } from '../auth/sessionService';
import { VAULT_PIN_STORAGE_KEY } from './vaultPin';
import { clearAllDrafts } from '../../capture/draftQueue';
import { clearSpeglarSession } from '@/features/lifeJournal/diary/mirror/utils/speglarSessionStorage';
import { clearDrogfrihetCounter } from '@/features/dailyLife/drogfrihet/lib/drogfrihetCounter';
import { clearRecoveryLocalStorage } from './clearRecoveryLocalStorage';
import { clearMaterialPackLocalCache } from '../lifeOs/materialPackApi';

const VAULT_PIN_KEY = VAULT_PIN_STORAGE_KEY;
const CHILDREN_PIN_KEY = 'livskompassen_children_pin_hash';
const PASSKEY_ID_KEY = 'livskompassen_passkey_id';
const APP_UNLOCK_PASSKEY_KEY = 'livskompassen_app_unlock_passkey_id';
const APP_UNLOCK_ENABLED_KEY = 'livskompassen_app_unlock_enabled';

/** Frivillig enhetsrensning — ersätter Kill Switch (ensam-boende). */
export async function clearDeviceSession(): Promise<void> {
  useStore.getState().setVaultUnlocked(false);
  useStore.getState().setActiveDrawer(null);
  clearAllVaultZones();
  const uid = useStore.getState().user?.uid;
  clearRecoveryLocalStorage(uid);
  sessionStorage.clear();
  localStorage.removeItem(VAULT_PIN_KEY);
  localStorage.removeItem(CHILDREN_PIN_KEY);
  localStorage.removeItem(PASSKEY_ID_KEY);
  localStorage.removeItem(APP_UNLOCK_PASSKEY_KEY);
  localStorage.removeItem(APP_UNLOCK_ENABLED_KEY);
  await clearAllDrafts();
  clearSpeglarSession();
  if (uid) clearMaterialPackLocalCache(uid);
  clearDrogfrihetCounter(uid);
  if (useStore.getState().isAuthenticated) {
    await invalidateServerSession();
  }
}
