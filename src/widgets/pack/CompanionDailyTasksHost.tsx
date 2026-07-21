/**
 * CompanionDailyTasksHost — Planering tasks + complete → done in Planering.
 */

import { useCallback, useEffect, useMemo } from 'react';
import { usePlanningTasks } from '@/features/admin/planning/hooks/usePlanningTasks';
import {
  homeStepLabel,
  pickHomeDaySteps,
} from '@/features/admin/planning/utils/pickHomeDaySteps';
import { setCached } from '../core/WidgetCache';
import { DailyTasksWidget, type DailyTask } from './DailyTasksWidget';

export function CompanionDailyTasksHost({
  maxVisible = 3,
  pulseHint = false,
}: {
  maxVisible?: number;
  pulseHint?: boolean;
}) {
  const { tasks, loading, moveTask } = usePlanningTasks();

  const initial = useMemo<DailyTask[] | undefined>(() => {
    if (loading) return undefined;
    const steps = pickHomeDaySteps(tasks, maxVisible);
    return steps.map((t) => ({
      id: t.id,
      title: homeStepLabel(t),
      done: false,
    }));
  }, [tasks, loading, maxVisible]);

  useEffect(() => {
    if (initial === undefined) return;
    void setCached('widget:daily_tasks:tasks', initial);
  }, [initial]);

  const onComplete = useCallback(
    async (id: string) => {
      /* Local defaults use t1/t2/t3 — skip Planering for those. */
      if (id.startsWith('t') && id.length <= 3) return;
      try {
        await moveTask(id, 'done');
      } catch {
        /* offline / auth — local cache already updated */
      }
    },
    [moveTask],
  );

  return (
    <DailyTasksWidget
      initial={initial}
      maxVisible={maxVisible}
      onComplete={onComplete}
      hosted
      pulseHint={pulseHint}
    />
  );
}
