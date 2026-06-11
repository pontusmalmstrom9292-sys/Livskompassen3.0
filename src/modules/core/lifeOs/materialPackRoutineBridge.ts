/**
 * Rutinkoppling (Våg C) — RoutineTemplate navigate-steg → MaterialPack-genvägar.
 * Delar ModuleLinkTarget med rutiner; ingen ny routing.
 */

import type { LifeHubPresetId } from './lifeHubPresets';
import type { MaterialShortcut } from './materialPacks';
import { routinesForPreset, type RoutineNavigateStep, type RoutineTemplate } from './routineTemplates';
import { targetToKey } from './materialPackTargets';

export type RoutineNavigateShortcut = {
  routineId: string;
  routineTitle: string;
  stepIndex: number;
  shortcut: MaterialShortcut;
};

function isNavigateStep(step: RoutineTemplate['steps'][number]): step is RoutineNavigateStep {
  return step.kind === 'navigate';
}

/** Navigate-steg från rutiner för aktiv preset — kandidater till MaterialPack. */
export function routineNavigateShortcuts(presetId: LifeHubPresetId): RoutineNavigateShortcut[] {
  const out: RoutineNavigateShortcut[] = [];
  for (const routine of routinesForPreset(presetId)) {
    routine.steps.forEach((step, stepIndex) => {
      if (!isNavigateStep(step)) return;
      out.push({
        routineId: routine.id,
        routineTitle: routine.title,
        stepIndex,
        shortcut: { label: step.label, target: step.target },
      });
    });
  }
  return out;
}

export function shortcutTargetKey(shortcut: MaterialShortcut): string {
  return targetToKey(shortcut.target);
}

/** True om genvägslistan redan har samma mål som rutinsteget. */
export function shortcutsIncludeTarget(
  shortcuts: MaterialShortcut[],
  candidate: MaterialShortcut,
): boolean {
  const key = shortcutTargetKey(candidate);
  return shortcuts.some((s) => shortcutTargetKey(s) === key);
}
