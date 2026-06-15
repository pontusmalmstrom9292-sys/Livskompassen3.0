import { useMemo } from 'react';
import { useEvolutionStore } from '@/core/store/useEvolutionStore';
import { useEconomyLevel } from '@/features/economy/hooks/useEconomyLevel';
import { resolveCapacityLevel } from './goalDetection';

/** M3.0-C — delad kapacitetsgate (read-only, ingen ledger-skrivning). */
export function useMabra30Capacity(userId?: string) {
  const evolutionDoc = useEvolutionStore((s) => s.doc);
  const { level: economyLevel } = useEconomyLevel(userId);

  const capacityLevel = useMemo(
    () => resolveCapacityLevel(evolutionDoc, economyLevel),
    [evolutionDoc, economyLevel],
  );

  return { capacityLevel };
}
