import { useEffect } from 'react';
import { useStore } from '../store';
import {
  clearAllVaultZones,
  hasVaultGate,
  invalidateServerSession,
  VAULT_SESSION_IDLE_MS,
} from './sessionService';

const ACTIVITY_EVENTS = ['pointerdown', 'keydown', 'touchstart', 'scroll'] as const;

/**
 * Zero Footprint for Valv session — single PIN via Fyren, 1 h idle.
 * No per-module zone gates; valv_core covers Dagbok/Speglar/Valv-menyn.
 */
export function useZeroFootprint() {
  const setVaultUnlocked = useStore((s) => s.setVaultUnlocked);
  const setActiveDrawer = useStore((s) => s.setActiveDrawer);
  const isVaultUnlocked = useStore((s) => s.ui.isVaultUnlocked);

  useEffect(() => {
    if (hasVaultGate() && !isVaultUnlocked) {
      setVaultUnlocked(true);
    }
  }, [isVaultUnlocked, setVaultUnlocked]);

  useEffect(() => {
    if (!hasVaultGate() && !isVaultUnlocked) return;

    const endVaultSession = () => {
      setVaultUnlocked(false);
      setActiveDrawer(null);
      clearAllVaultZones();
      if (useStore.getState().isAuthenticated) {
        void invalidateServerSession();
      }
    };

    let timer = window.setTimeout(endVaultSession, VAULT_SESSION_IDLE_MS);

    const bump = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(endVaultSession, VAULT_SESSION_IDLE_MS);
    };

    for (const event of ACTIVITY_EVENTS) {
      window.addEventListener(event, bump, { passive: true });
    }

    return () => {
      window.clearTimeout(timer);
      for (const event of ACTIVITY_EVENTS) {
        window.removeEventListener(event, bump);
      }
    };
  }, [isVaultUnlocked, setVaultUnlocked, setActiveDrawer]);
}
