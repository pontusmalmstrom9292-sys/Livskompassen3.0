import { useEffect, useState } from 'react';
import { useStore } from '../../../core/store';
import {
  createPlanningTask,
  listenPlanningTasks,
  updatePlanningTask,
} from '../api/planningTasksApi';
import type { PlanningTask, PlanningTaskSource, PlanningTaskStatus } from '../types';

export function usePlanningTasks() {
  const user = useStore((s) => s.user);
  const [tasks, setTasks] = useState<PlanningTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setTasks([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    const unsub = listenPlanningTasks(user.uid, (rows) => {
      setTasks(rows);
      setLoading(false);
    });
    return () => unsub();
  }, [user]);

  const addTask = async (input: {
    title: string;
    status: PlanningTaskStatus;
    source?: PlanningTaskSource;
    dueAt?: string;
    summary?: string;
    projectId?: string;
  }) => {
    if (!user) throw new Error('Inte inloggad');
    await createPlanningTask(user.uid, {
      title: input.title,
      status: input.status,
      source: input.source ?? 'manual',
      dueAt: input.dueAt,
      summary: input.summary,
      projectId: input.projectId,
    });
  };

  const moveTask = async (id: string, status: PlanningTaskStatus) => {
    if (!user) return;
    await updatePlanningTask(user.uid, id, { status });
  };

  const setMicroStep = async (id: string, microStep: string) => {
    if (!user) return;
    await updatePlanningTask(user.uid, id, { microStep: microStep.trim() || undefined });
  };

  return { user, tasks, loading, error, setError, addTask, moveTask, setMicroStep };
}
