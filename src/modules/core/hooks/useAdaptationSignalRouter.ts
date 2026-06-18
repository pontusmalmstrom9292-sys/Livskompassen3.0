import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useStore } from '../store';
import { useAdaptationStore } from '../store/useAdaptationStore';
import { resolveRouteAdaptationSignal } from '../adaptation/adaptationRouteSignals';
import { shouldFireAdaptationSignal } from '../adaptation/adaptationSignalThrottle';

/**
 * Tyst route-signalering (Steg 2d) — bakom adaptation_layer_v1.
 * Ökar inferredSignals via callable; blockerar inte navigation.
 */
export function useAdaptationSignalRouter(): void {
  const user = useStore((s) => s.user);
  const layerEnabled = useAdaptationStore((s) => s.layerEnabled);
  const recordSignal = useAdaptationStore((s) => s.recordSignal);
  const location = useLocation();
  const skipInitialRef = useRef(true);

  useEffect(() => {
    if (!user?.uid || !layerEnabled) {
      skipInitialRef.current = true;
      return;
    }

    if (skipInitialRef.current) {
      skipInitialRef.current = false;
      return;
    }

    const resolved = resolveRouteAdaptationSignal(location.pathname, location.search);
    if (!resolved) return;
    if (!shouldFireAdaptationSignal(resolved.signalKey)) return;

    void recordSignal({
      signalKey: resolved.signalKey,
      increment: 1,
      silo: resolved.silo,
    }).catch(() => {
      /* Tyst — signaler är icke-kritiska */
    });
  }, [
    user?.uid,
    layerEnabled,
    location.pathname,
    location.search,
    recordSignal,
  ]);
}
