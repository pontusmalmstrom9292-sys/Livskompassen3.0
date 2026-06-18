import type { EvolutionHubDoc } from '@/core/types/firestore';
import type { AdaptationPrefsDoc } from '@/core/types/adaptation';

/** Kognitiv nivå från evolution_hub (default 2 = normal kapacitet). */
export function getHomeCognitiveLevel(doc: EvolutionHubDoc | null): number {
  return doc?.pillars?.kognitiv?.level ?? 2;
}

/** Paralys-läge från adaptation_prefs (endast när lagret är aktivt). */
export function isAdaptationParalysMode(
  layerEnabled: boolean,
  prefs: AdaptationPrefsDoc | null,
): boolean {
  if (!layerEnabled || !prefs) return false;
  return prefs.uiDensity === 'paralys';
}

/** Låg kapacitet på Hem — förenklad dag-fas och snabbnav. */
export function isLowHomeCapacity(
  evolutionDoc: EvolutionHubDoc | null,
  capacityScore: number,
  adaptation?: { layerEnabled: boolean; prefs: AdaptationPrefsDoc | null },
): boolean {
  if (adaptation && isAdaptationParalysMode(adaptation.layerEnabled, adaptation.prefs)) {
    return true;
  }

  const level = getHomeCognitiveLevel(evolutionDoc);
  if (level <= 1) return true;
  return capacityScore > 0 && capacityScore < 35;
}
