import { useEffect } from 'react';
import { useStore } from '../store';
import {
  clearVaultGate,
  invalidateServerSession,
} from './sessionService';

const VAULT_TIMEOUT_MS = 5 * 60 * 1000;

export function useZeroFootprint() {
  const setVaultUnlocked = useStore((s) => s.setVaultUnlocked);
  const setActiveDrawer = useStore((s) => s.setActiveDrawer);
  const isVaultUnlocked = useStore((s) => s.ui.isVaultUnlocked);
  const isAuthenticated = useStore((s) => s.isAuthenticated);

  useEffect(() => {
    const lockVault = () => {
      setVaultUnlocked(false);
      setActiveDrawer(null);
      clearVaultGate();
      if (isAuthenticated) {
        void invalidateServerSession();
      }
    };

    const onVisibility = () => {
      if (document.visibilityState === 'hidden') {
        lockVault();
      }
    };

    document.addEventListener('visibilitychange', onVisibility);

    let timer: ReturnType<typeof setTimeout> | undefined;
    if (isVaultUnlocked) {
      timer = setTimeout(lockVault, VAULT_TIMEOUT_MS);
    }

    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      if (timer) clearTimeout(timer);
    };
  }, [isVaultUnlocked, isAuthenticated, setVaultUnlocked, setActiveDrawer]);
}
