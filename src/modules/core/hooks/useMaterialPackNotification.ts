import { useEffect } from 'react';
import { useEvolutionStore } from '../store/useEvolutionStore';
import { listFetchablePacks } from '../home/dev/contentPackCatalog';
import { useStore } from '../store';

const LAST_PACK_NOTIF_KEY = 'lk_last_pack_notif_ts';
const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;

/** Typed bridge interface for the native Android notification bridge. */
interface LivskompassenNativeBridge {
  triggerPremiumNotification?: (title: string, body: string, channel: string) => void;
}

/**
 * Phase 3.3 Stub — Weekly notification if new content packs are available.
 * Infrastructure: triggerPremiumNotification on Android bridge.
 */
export function useMaterialPackNotification(): void {
  const user = useStore((s) => s.user);
  // Select unlockedPacks directly to avoid creating a new [] reference each render
  // when the field is undefined, which would fire the effect on every render cycle.
  const unlockedPacks = useEvolutionStore((s) => s.doc?.unlockedPacks);

  useEffect(() => {
    if (!user?.uid) return;

    // TODO: IMPLEMENTERA BARA om befintlig notis-infra finns; annars skriv exakt fil där det ska in senare.
    // Infra bekräftad i NativeInterface.java + AppNotificationManager.java.

    const checkAndNotify = () => {
      const now = Date.now();
      const lastNotif = parseInt(localStorage.getItem(LAST_PACK_NOTIF_KEY) || '0', 10);

      if (now - lastNotif < ONE_WEEK_MS) return;

      const hubUnlocked = unlockedPacks ?? [];
      const fetchable = listFetchablePacks(hubUnlocked);
      if (fetchable.length > 0) {
        const native = (window as unknown as { LivskompassenNative?: LivskompassenNativeBridge }).LivskompassenNative;
        if (native?.triggerPremiumNotification) {
          native.triggerPremiumNotification(
            'Nya utvecklingskort!',
            `Det finns ${fetchable.length} nya faktapack att hämta.`,
            'daily_reminders'
          );
          localStorage.setItem(LAST_PACK_NOTIF_KEY, now.toString());
        }
      }
    };

    // Delay check to avoid boot congestion
    const timer = setTimeout(checkAndNotify, 10000);
    return () => clearTimeout(timer);
  }, [user?.uid, unlockedPacks]);
}
