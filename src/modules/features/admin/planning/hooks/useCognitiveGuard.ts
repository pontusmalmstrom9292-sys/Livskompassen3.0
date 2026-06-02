import { useMemo, useState } from 'react';
import type { PlanningTask } from '../types';
import {
  getActivePlanningTasks,
  isPlanningOverloaded,
  pickPlanningFocusTask,
  readCognitiveGuardEnabled,
  writeCognitiveGuardEnabled,
} from '../utils/cognitiveGuard';

export function useCognitiveGuard(tasks: PlanningTask[]) {
  const [cognitiveGuardEnabled, setCognitiveGuardEnabled] = useState(readCognitiveGuardEnabled);

  const toggleGuard = () => {
    setCognitiveGuardEnabled((prev) => {
      const next = !prev;
      writeCognitiveGuardEnabled(next);
      return next;
    });
  };

  const activeTasks = useMemo(() => getActivePlanningTasks(tasks), [tasks]);
  const focusTask = useMemo(() => pickPlanningFocusTask(activeTasks), [activeTasks]);
  const isOverloaded = isPlanningOverloaded(activeTasks);

  return {
    cognitiveGuardEnabled,
    toggleGuard,
    activeTasks,
    focusTask,
    isOverloaded,
  };
}
