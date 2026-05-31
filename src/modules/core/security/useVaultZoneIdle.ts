import { useEffect } from 'react';
import { clearVaultZone, VAULT_SESSION_IDLE_MS, type VaultZoneId } from '../auth/sessionService';

const DEFAULT_IDLE_MS = VAULT_SESSION_IDLE_MS;

const ACTIVITY_EVENTS = ['pointerdown', 'keydown', 'touchstart', 'scroll'] as const;

/** Rensar zonsession efter idle — ingen blur (solo-läge). */
export function useVaultZoneIdle(
  zone: VaultZoneId,
  active: boolean,
  onIdle?: () => void,
  idleMs = DEFAULT_IDLE_MS,
) {
  useEffect(() => {
    if (!active) return;

    let timer = window.setTimeout(() => {
      clearVaultZone(zone);
      onIdle?.();
    }, idleMs);

    const bump = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        clearVaultZone(zone);
        onIdle?.();
      }, idleMs);
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
  }, [zone, active, onIdle, idleMs]);
}
