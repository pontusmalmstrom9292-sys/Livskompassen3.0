import { useEffect } from 'react';
import { useStore } from '../store';
import { clearAllVaultZones, invalidateServerSession } from './sessionService';

const VAULT_TIMEOUT_MS = 15 * 60 * 1000;

/**
 * Zero Footprint for vault session.
 * Uses idle timeout only — visibilitychange removed because mobile keyboards
 * and passkey prompts fire "hidden" and immediately locked/cleared the gate.
 */
export function useZeroFootprint() {
  const setVaultUnlocked = useStore((s) => s.setVaultUnlocked);
  const setActiveDrawer = useStore((s) => s.setActiveDrawer);
  const isVaultUnlocked = useStore((s) => s.ui.isVaultUnlocked);

  useEffect(() => {
    if (!isVaultUnlocked) return;

    const endVaultSession = () => {
      setVaultUnlocked(false);
      setActiveDrawer(null);
      clearAllVaultZones();
      if (useStore.getState().isAuthenticated) {
        void invalidateServerSession();
      }
    };

    const timer = setTimeout(endVaultSession, VAULT_TIMEOUT_MS);
    return () => clearTimeout(timer);
  }, [isVaultUnlocked, setVaultUnlocked, setActiveDrawer]);
}
