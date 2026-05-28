import type { NavigateFunction } from 'react-router-dom';
import { createPlanningTask } from '../../admin/planning/api/planningTasksApi';
import { moduleLinkToString, resolveModuleLink } from './moduleLink';
import type { RoutineTemplate } from './routineTemplates';

export type RunRoutineResult = {
  tasksCreated: number;
  navigatedTo: string;
};

/**
 * Kör rutin: skapar uppgifter för task-steg, navigerar till första navigate-steg.
 */
export async function runRoutine(
  userId: string,
  routine: RoutineTemplate,
  navigate: NavigateFunction,
): Promise<RunRoutineResult> {
  let tasksCreated = 0;
  let firstNav: ReturnType<typeof resolveModuleLink> | null = null;

  for (const step of routine.steps) {
    if (step.kind === 'task') {
      await createPlanningTask(userId, {
        title: step.title,
        status: 'todo',
        source: 'manual',
        summary: step.summary,
        sourceRef: `routine:${routine.id}`,
      });
      tasksCreated += 1;
    } else if (step.kind === 'navigate' && !firstNav) {
      firstNav = resolveModuleLink(step.target);
    }
  }

  if (!firstNav) {
    for (const step of routine.steps) {
      if (step.kind === 'navigate') {
        firstNav = resolveModuleLink(step.target);
        break;
      }
    }
  }

  const navigatedTo = firstNav ? moduleLinkToString(firstNav) : '/planering';

  if (firstNav) {
    navigate({
      pathname: firstNav.pathname,
      search: firstNav.search,
      hash: firstNav.hash,
    });
  }

  return { tasksCreated, navigatedTo };
}
