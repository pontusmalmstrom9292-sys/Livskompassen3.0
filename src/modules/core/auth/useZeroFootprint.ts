import { useEffect } from 'react';
import { useStore } from '../store';
import { hasVaultGate, VAULT_SESSION_IDLE_MS } from './sessionService';
import { endVaultSession, syncVaultUnlockedFromGate } from '../security/vaultSessionLifecycle';

const ACTIVITY_EVENTS = ['pointerdown', 'keydown', 'touchstart', 'scroll'] as const;

/**
 * Zero Footprint for Valv session — single PIN via Fyren, 1 h idle.
 * No per-module zone gates; valv_core covers Dagbok/Speglar/Valv-menyn.
 */
export function useZeroFootprint() {
  const isVaultUnlocked = useStore((s) => s.ui.isVaultUnlocked);

  useEffect(() => {
    syncVaultUnlockedFromGate();
  }, [isVaultUnlocked]);

  useEffect(() => {
    if (!hasVaultGate() && !isVaultUnlocked) return;

    const endVaultSessionIdle = () => {
      void endVaultSession();
    };

    let timer = window.setTimeout(endVaultSessionIdle, VAULT_SESSION_IDLE_MS);

    const bump = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(endVaultSessionIdle, VAULT_SESSION_IDLE_MS);
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
  }, [isVaultUnlocked]);
}
