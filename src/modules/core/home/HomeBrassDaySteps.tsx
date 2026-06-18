import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { clsx } from 'clsx';
import { usePlanningTasks } from '@/features/admin/planning/hooks/usePlanningTasks';
import type { PlanningTask } from '@/features/admin/planning/types';
import {
  homeStepLabel,
  pickHomeDaySteps,
} from '@/features/admin/planning/utils/pickHomeDaySteps';
import { HOME_SUPERHUB_ROUTES } from './homeSuperhubRoutes';

const MAX_STEPS = 3;

export function HomeBrassDaySteps() {
  const { tasks, loading, moveTask, user } = usePlanningTasks();
  const [busyId, setBusyId] = useState<string | null>(null);

  const steps = useMemo(() => pickHomeDaySteps(tasks, MAX_STEPS), [tasks]);

  const handleMarkDone = async (task: PlanningTask) => {
    if (!user || task.status === 'done' || busyId) return;
    setBusyId(task.id);
    try {
      await moveTask(task.id, 'done');
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="home-brass-a__tile home-brass-a__tile--tall brass-glass">
      <p className="home-brass-a__label">Dagens steg</p>

      {loading ? (
        <p className="home-brass-a__steps-loading flex items-center gap-2 text-xs text-text-muted">
          <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
          Laddar från Planering …
        </p>
      ) : steps.length === 0 ? (
        <p className="home-brass-a__steps-empty text-xs leading-relaxed text-text-muted">
          Inga öppna steg i Att göra.
        </p>
      ) : (
        <ul className="home-brass-a__steps">
          {steps.map((task) => {
            const label = homeStepLabel(task);
            const isWaiting = task.status === 'waiting';
            const isBusy = busyId === task.id;
            return (
              <li key={task.id} className="home-brass-a__step">
                <button
                  type="button"
                  className="home-brass-a__step-btn"
                  disabled={isBusy}
                  aria-label={`Markera klar: ${label}`}
                  onClick={() => void handleMarkDone(task)}
                >
                  <span
                    className={clsx(
                      'home-brass-a__check',
                      isBusy && 'home-brass-a__check--on',
                      isWaiting && 'home-brass-a__check--wait',
                    )}
                    aria-hidden
                  >
                    {isBusy ? '…' : ''}
                  </span>
                  <span className={clsx(isWaiting && 'text-text-dim')}>
                    {label}
                    {isWaiting ? ' · väntar' : ''}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}

      <Link to={HOME_SUPERHUB_ROUTES.planeringHub} className="home-brass-a__link">
        {steps.length >= MAX_STEPS ? 'Visa alla i Planering →' : 'Öppna Planering →'}
      </Link>
    </div>
  );
}
