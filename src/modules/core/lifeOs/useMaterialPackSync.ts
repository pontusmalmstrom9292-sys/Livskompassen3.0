import { useEffect } from 'react';
import { useStore } from '../store';
import {
  listenMaterialPackOverrides,
  pushUnsyncedMaterialPackOverrides,
} from './materialPackFirestoreApi';

/** Våg B — synka MaterialPack overrides mellan enheter via Firestore. */
export function useMaterialPackSync(): void {
  const user = useStore((s) => s.user);

  useEffect(() => {
    const uid = user?.uid;
    if (!uid) return;

    let unsub: (() => void) | undefined;
    let cancelled = false;

    void pushUnsyncedMaterialPackOverrides(uid)
      .catch(() => {
        /* offline on boot */
      })
      .finally(() => {
        if (cancelled) return;
        unsub = listenMaterialPackOverrides(uid);
      });

    return () => {
      cancelled = true;
      unsub?.();
    };
  }, [user?.uid]);
}
