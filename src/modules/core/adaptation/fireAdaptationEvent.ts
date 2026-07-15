import { useAdaptationStore } from '../store/useAdaptationStore';
import { shouldFireAdaptationSignal } from './adaptationSignalThrottle';
import type { AdaptationSilo } from '../types/adaptation';

/**
 * Fire-and-forget adaptation signal (non-hook) — för spar-events utanför route-router.
 */
export function fireAdaptationEvent(signalKey: string, silo: AdaptationSilo = 'core'): void {
  const { layerEnabled, recordSignal } = useAdaptationStore.getState();
  if (!layerEnabled) return;
  if (!shouldFireAdaptationSignal(signalKey)) return;

  void recordSignal({ signalKey, increment: 1, silo }).catch(() => {
    /* Tyst — icke-kritisk */
  });
}
