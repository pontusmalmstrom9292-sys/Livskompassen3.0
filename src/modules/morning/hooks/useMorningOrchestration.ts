import { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/core/firebase/firestore';
import { useStore } from '@/core/store';
import { listenPlanningTasks } from '@/modules/features/admin/planning/api/planningTasksApi';
import type { PlanningTask } from '@/modules/features/admin/planning/types';

/** Kanonisk antal fokusplatser i Morgonkompassen. */
export const MORNING_FOCUS_SLOTS = 3;

const EMPTY_FOCUS_POINTS: readonly string[] = ['', '', ''] as const;

export type MorningOrchestrationResult = {
  /** Dagligt fokus från `user_daily_focus` (kanoniskt, 3 platser). */
  focusPoints: string[];
  /** Alla Kanban-uppgifter från `planning_tasks` (todo | waiting | done). */
  tasks: PlanningTask[];
  /** Sant tills både fokus och uppgifter har levererat första snapshot. */
  loading: boolean;
};

type UserDailyFocusDoc = {
  focusPoints?: unknown;
};

/** Normaliserar rå `focusPoints` till exakt tre strängplatser. */
export function normalizeFocusPoints(raw: unknown): string[] {
  const points = [...EMPTY_FOCUS_POINTS];
  if (!Array.isArray(raw)) return points;
  raw.forEach((value, index) => {
    if (index < MORNING_FOCUS_SLOTS && typeof value === 'string') {
      points[index] = value;
    }
  });
  return points;
}

/**
 * Orkestreringskrok för Morgonkompassen + P3 Kanban.
 * Läser dagligt fokus enbart från `user_daily_focus` (inte `daily_intentions`).
 */
export function useMorningOrchestration(): MorningOrchestrationResult {
  const user = useStore((s) => s.user);
  const [focusPoints, setFocusPoints] = useState<string[]>([...EMPTY_FOCUS_POINTS]);
  const [tasks, setTasks] = useState<PlanningTask[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) {
      setFocusPoints([...EMPTY_FOCUS_POINTS]);
      setTasks([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    let focusReady = false;
    let tasksReady = false;

    const markReady = () => {
      if (focusReady && tasksReady) setLoading(false);
    };

    const focusRef = doc(db, 'user_daily_focus', user.uid);
    const unsubFocus = onSnapshot(
      focusRef,
      (snap) => {
        if (snap.exists()) {
          const data = snap.data() as UserDailyFocusDoc;
          setFocusPoints(normalizeFocusPoints(data.focusPoints));
        } else {
          setFocusPoints([...EMPTY_FOCUS_POINTS]);
        }
        focusReady = true;
        markReady();
      },
      () => {
        setFocusPoints([...EMPTY_FOCUS_POINTS]);
        focusReady = true;
        markReady();
      },
    );

    const unsubTasks = listenPlanningTasks(user.uid, (rows) => {
      setTasks(rows);
      tasksReady = true;
      markReady();
    });

    return () => {
      unsubFocus();
      unsubTasks();
    };
  }, [user?.uid]);

  return { focusPoints, tasks, loading };
}
