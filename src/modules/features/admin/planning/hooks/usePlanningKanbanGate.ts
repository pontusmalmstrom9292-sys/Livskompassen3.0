import { useEvolutionStore } from '@/core/store/useEvolutionStore';
import { useCapacityGate } from '@/core/store/useCapacityGate';

/** P2.5 — tri-gate planering_kanban (speglar ekonomi-mönster). */
export function usePlanningKanbanGate(): {
  isAdvancedKanban: boolean;
  isLoading: boolean;
} {
  const doc = useEvolutionStore((s) => s.doc);
  const isEvolutionLoading = useEvolutionStore((s) => s.isLoading);
  const capacityScore = useCapacityGate((s) => s.capacityScore);
  const isCapacityLoading = useCapacityGate((s) => s.isLoading);

  const kognitivLevel = doc?.pillars?.kognitiv?.level ?? 1;
  const flagUnlocked = doc?.unlockedFeatureFlags?.includes('planning_kanban') ?? false;
  const capacityOk = capacityScore >= 0.45;

  const isAdvancedKanban = kognitivLevel >= 2 || flagUnlocked || capacityOk;

  return {
    isAdvancedKanban,
    isLoading: isEvolutionLoading || isCapacityLoading,
  };
}
