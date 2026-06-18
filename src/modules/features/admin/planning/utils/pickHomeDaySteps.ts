import type { PlanningTask } from '../types';
import { getActivePlanningTasks, pickPlanningFocusTask } from './cognitiveGuard';

function sortByDue(a: PlanningTask, b: PlanningTask): number {
  return (a.dueAt ?? '9999').localeCompare(b.dueAt ?? '9999');
}

/** Hem layout A — max N aktiva steg (todo först, sedan väntar). */
export function pickHomeDaySteps(tasks: PlanningTask[], max = 3): PlanningTask[] {
  const active = getActivePlanningTasks(tasks);
  if (active.length === 0) return [];

  const todos = active.filter((t) => t.status === 'todo');
  const waiting = active.filter((t) => t.status === 'waiting');

  const focus = pickPlanningFocusTask(todos);
  const restTodos = focus ? todos.filter((t) => t.id !== focus.id) : [...todos];
  restTodos.sort(sortByDue);

  const ordered = [...(focus ? [focus] : []), ...restTodos, ...waiting.sort(sortByDue)];
  return ordered.slice(0, max);
}

export function homeStepLabel(task: PlanningTask): string {
  return (task.microStep?.trim() || task.title).trim();
}
