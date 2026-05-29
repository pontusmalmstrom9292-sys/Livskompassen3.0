import type { PlanningTask, PlanningTaskStatus } from '../types';

export function todayIsoDate(): string {
  return new Date().toISOString().slice(0, 10);
}

export function isPlanningTaskOverdue(
  dueAt: string | undefined,
  status: PlanningTaskStatus,
  today = todayIsoDate(),
): boolean {
  if (!dueAt || status === 'done') return false;
  return dueAt.slice(0, 10) < today;
}

export function countPlanningStats(tasks: PlanningTask[], today = todayIsoDate()) {
  const open = tasks.filter((t) => t.status !== 'done');
  return {
    todo: tasks.filter((t) => t.status === 'todo').length,
    waiting: tasks.filter((t) => t.status === 'waiting').length,
    done: tasks.filter((t) => t.status === 'done').length,
    overdue: open.filter((t) => isPlanningTaskOverdue(t.dueAt, t.status, today)).length,
  };
}
