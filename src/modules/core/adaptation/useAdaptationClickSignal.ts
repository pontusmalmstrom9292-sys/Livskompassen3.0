import { useCallback } from 'react';
import type { AdaptationSilo } from '../types/adaptation';
import { useAdaptationStore } from '../store/useAdaptationStore';
import { shouldFireAdaptationSignal } from './adaptationSignalThrottle';

/**
 * Engångs-/klick-signaler (t.ex. Inkast öppnas) — throttlad per signalKey.
 */
export function useAdaptationClickSignal() {
  const layerEnabled = useAdaptationStore((s) => s.layerEnabled);
  const recordSignal = useAdaptationStore((s) => s.recordSignal);

  return useCallback(
    (signalKey: string, silo: AdaptationSilo = 'core') => {
      if (!layerEnabled) return;
      if (!shouldFireAdaptationSignal(signalKey)) return;

      void recordSignal({ signalKey, increment: 1, silo }).catch(() => {
        /* Tyst */
      });
    },
    [layerEnabled, recordSignal],
  );
}
