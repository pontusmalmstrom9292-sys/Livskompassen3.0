import { useEffect } from 'react';
import { App } from '@capacitor/app';
import { useStore } from '../store';
import { hasVaultGate, VAULT_SESSION_IDLE_MS } from './sessionService';
import { endVaultSession, syncVaultUnlockedFromGate } from '../security/vaultSessionLifecycle';
import { shouldSuppressVaultBackgroundLock } from './vaultUnlockInFlight';
import { isCapacitorNative } from '../platform/capacitorPlatform';
import { getLivskompassenNative } from '@/shared/utils/nativeSecureDownload';

const ACTIVITY_EVENTS = ['pointerdown', 'keydown', 'touchstart', 'scroll'] as const;

/** Ignore brief Android pauses (biometrics, shade, system dialogs). */
const NATIVE_BACKGROUND_LOCK_MS = 3_000;

function notifyNativeUserInteracted(): void {
  try {
    getLivskompassenNative()?.userInteracted?.();
  } catch {
    /* bridge optional — SessionSentry also listens on WebView touch */
  }
}

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
 * - Capacitor Android/iOS: sustained appStateChange only (not brief WebView/system pauses)
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
      notifyNativeUserInteracted();
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
      let backgroundedAt: number | null = null;
      let pendingLock: number | undefined;

      const clearPending = () => {
        if (pendingLock === undefined) return;
        window.clearTimeout(pendingLock);
        pendingLock = undefined;
      };

      const sub = App.addListener('appStateChange', ({ isActive }) => {
        if (!isActive) {
          backgroundedAt = Date.now();
          clearPending();
          // Best-effort lock while away (requires JS timers not paused in MainActivity).
          pendingLock = window.setTimeout(() => {
            pendingLock = undefined;
            if (backgroundedAt !== null) lockVaultIfOpen();
          }, NATIVE_BACKGROUND_LOCK_MS);
          return;
        }

        // Became active — cancel short-blip lock; lock only if away was sustained.
        clearPending();
        const started = backgroundedAt;
        backgroundedAt = null;
        if (started === null) return;
        if (Date.now() - started < NATIVE_BACKGROUND_LOCK_MS) return;
        lockVaultIfOpen();
      });

      return () => {
        clearPending();
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
