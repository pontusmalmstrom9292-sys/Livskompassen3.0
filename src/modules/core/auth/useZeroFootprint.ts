import { useEffect } from 'react';
import { App } from '@capacitor/app';
import { useStore } from '../store';
import { hasVaultGate, VAULT_SESSION_IDLE_MS } from './sessionService';
import { endVaultSession, syncVaultUnlockedFromGate } from '../security/vaultSessionLifecycle';
import { shouldSuppressVaultBackgroundLock } from './vaultUnlockInFlight';
import { isCapacitorNative } from '../platform/capacitorPlatform';

const ACTIVITY_EVENTS = ['pointerdown', 'keydown', 'touchstart', 'scroll'] as const;

function lockVaultIfOpen(): void {
  if (shouldSuppressVaultBackgroundLock()) return;
  if (!hasVaultGate() && !useStore.getState().ui.isVaultUnlocked) return;
  void endVaultSession({ closeDrawer: true });
}

/**
 * Zero Footprint for Valv session — single PIN via Fyren, 1 h idle.
 * No per-module zone gates; valv_core covers Dagbok/Speglar/Valv-menyn.
 *
 * G17 blur-lock:
 * - Webb: visibilitychange + pagehide (tab-byte)
 * - Capacitor Android/iOS: appStateChange (inte WebView visibility — den falsklåser vid biometri/system-UI)
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

  useEffect(() => {
    if (isCapacitorNative()) {
      const sub = App.addListener('appStateChange', ({ isActive }) => {
        if (isActive) return;
        lockVaultIfOpen();
      });
      return () => {
        void sub.then((handle) => handle.remove());
      };
    }

    const lockOnHidden = () => {
      if (!document.hidden) return;
      lockVaultIfOpen();
    };

    document.addEventListener('visibilitychange', lockOnHidden);
    window.addEventListener('pagehide', lockOnHidden);

    return () => {
      document.removeEventListener('visibilitychange', lockOnHidden);
      window.removeEventListener('pagehide', lockOnHidden);
    };
  }, []);
}
