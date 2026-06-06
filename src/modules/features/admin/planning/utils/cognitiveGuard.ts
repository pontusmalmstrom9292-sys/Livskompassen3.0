import type { PlanningTask } from '../types';

export const COGNITIVE_GUARD_STORAGE_KEY = 'lk_cognitive_guard_enabled';

/** Över denna gräns aktiveras överbelastningsskydd (när det är på). */
export const COGNITIVE_GUARD_OVERLOAD_THRESHOLD = 3;

export function readCognitiveGuardEnabled(): boolean {
  try {
    return localStorage.getItem(COGNITIVE_GUARD_STORAGE_KEY) !== 'false';
  } catch {
    return true;
  }
}

export function writeCognitiveGuardEnabled(enabled: boolean): void {
  try {
    localStorage.setItem(COGNITIVE_GUARD_STORAGE_KEY, String(enabled));
  } catch {
    /* ignore */
  }
}

export function getActivePlanningTasks(tasks: PlanningTask[]): PlanningTask[] {
  return tasks.filter((t) => t.status !== 'done');
}

/** microStep → närmaste dueAt → första aktiva. */
export function pickPlanningFocusTask(activeTasks: PlanningTask[]): PlanningTask | null {
  if (activeTasks.length === 0) return null;
  const withMicro = activeTasks.find((t) => t.microStep);
  if (withMicro) return withMicro;
  const withDue = activeTasks
    .filter((t) => t.dueAt)
    .sort((a, b) => (a.dueAt || '').localeCompare(b.dueAt || ''));
  if (withDue[0]) return withDue[0];
  return activeTasks[0] ?? null;
}

export function isPlanningOverloaded(activeTasks: PlanningTask[]): boolean {
  return activeTasks.length > COGNITIVE_GUARD_OVERLOAD_THRESHOLD;
}

/** Deterministisk «Föreslå nästa» efter nuvarande fokus-uppgift. */
export function pickNextFocusTask(
  activeTasks: PlanningTask[],
  currentId: string,
): PlanningTask | null {
  const rest = activeTasks.filter((t) => t.id !== currentId);
  return pickPlanningFocusTask(rest);
}
