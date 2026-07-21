/** @locked MOD-WIDGET — låst modul; unlock via docs/evaluations/*-unlock-MOD-WIDGET.md */
import type { EvolutionHubDoc } from '@/core/types/firestore';

/**
 * Kapacitetsgate för Egna moduler (masterplan v2.2).
 * Nivå 1: mallar + enkel create (ingen Experimentera / ingen tung stil-lek).
 * Nivå 2+: Experimentera + stil-presets live.
 * Saknad hub → default 2 (samma antagande som homeProactiveTriggers).
 */
export const WIDGET_BUILD_EXPERIMENT_MIN_LEVEL = 2;

export function cognitiveLevelFromEvolution(doc: EvolutionHubDoc | null | undefined): number {
  return doc?.pillars?.kognitiv?.level ?? 2;
}

export type WidgetBuildCapacity = {
  cognitiveLevel: number;
  /** Mallgalleri + enkel create. */
  canUseTemplates: boolean;
  /** Experimentera + stil-lek + datetime. */
  canExperiment: boolean;
  /** Pin till Hem — tillåtet från nivå 1. */
  canPinHome: boolean;
};

export function resolveWidgetBuildCapacity(
  doc: EvolutionHubDoc | null | undefined,
): WidgetBuildCapacity {
  const cognitiveLevel = cognitiveLevelFromEvolution(doc);
  const canExperiment = cognitiveLevel >= WIDGET_BUILD_EXPERIMENT_MIN_LEVEL;
  return {
    cognitiveLevel,
    canUseTemplates: true,
    canExperiment,
    canPinHome: true,
  };
}
