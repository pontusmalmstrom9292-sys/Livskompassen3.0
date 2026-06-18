import type { EvolutionHubDoc } from '@/core/types/firestore';

/** Kognitiv nivå från evolution_hub (default 2 = normal kapacitet). */
export function getHomeCognitiveLevel(doc: EvolutionHubDoc | null): number {
  return doc?.pillars?.kognitiv?.level ?? 2;
}

/** Låg kapacitet på Hem — förenklad dag-fas och snabbnav. */
export function isLowHomeCapacity(
  evolutionDoc: EvolutionHubDoc | null,
  capacityScore: number,
): boolean {
  const level = getHomeCognitiveLevel(evolutionDoc);
  if (level <= 1) return true;
  return capacityScore > 0 && capacityScore < 35;
}
