import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, Check } from 'lucide-react';
import { clsx } from 'clsx';
import { usePlanningTasks } from '@/features/admin/planning/hooks/usePlanningTasks';
import type { PlanningTask } from '@/features/admin/planning/types';
import {
  homeStepLabel,
  pickHomeDaySteps,
} from '@/features/admin/planning/utils/pickHomeDaySteps';
import { HOME_SUPERHUB_ROUTES } from './homeSuperhubRoutes';

const MAX_STEPS = 3;

type Props = {
  variant?: 'brass' | 'calm' | 'executive';
};

function formatDueTime(dueAt?: string): string | null {
  if (!dueAt) return null;
  if (/^\d{2}[:.]\d{2}$/.test(dueAt)) return dueAt;
  try {
    const d = new Date(dueAt);
    if (isNaN(d.getTime())) return null;
    return d.toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' });
  } catch {
    return null;
  }
}

export function HomeBrassDaySteps({ variant = 'calm' }: Props) {
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

  const tileClass = clsx(
    'home-layout-a__tile home-layout-a__tile--tall flex flex-col justify-between min-h-[160px]',
    variant === 'brass' ? 'brass-glass' : 'calm-card',
  );

  return (
    <div className={tileClass}>
      <div>
        <p className="text-[10px] tracking-[0.2em] font-sans text-accent uppercase font-bold mb-2">
          DAGENS STEG
        </p>

        {loading ? (
          <p className="flex items-center gap-2 text-xs text-text-muted py-2">
            <Loader2 className="h-3 w-3 animate-spin text-accent" aria-hidden />
            Laddar från Planering …
          </p>
        ) : steps.length === 0 ? (
          <p className="text-xs leading-relaxed text-text-muted py-2">
            Inga öppna steg i Att göra.
          </p>
        ) : (
          <ul className="divide-y divide-border/5">
            {steps.map((task) => {
              const label = homeStepLabel(task);
              const isWaiting = task.status === 'waiting';
              const isBusy = busyId === task.id;
              return (
                <li key={task.id} className="group py-2 first:pt-1 last:pb-1">
                  <button
                    type="button"
                    className="w-full flex items-center justify-between text-left disabled:opacity-50"
                    disabled={isBusy}
                    aria-label={`Markera klar: ${label}`}
                    onClick={() => void handleMarkDone(task)}
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className={clsx(
                          "w-4 h-4 flex items-center justify-center rounded border transition-colors",
                          isWaiting 
                            ? "border-dashed border-text-dim" 
                            : "border-accent/40 group-hover:border-accent bg-accent/5",
                          isBusy && "bg-accent/10"
                        )}
                        aria-hidden
                      >
                        {isBusy ? (
                          <Loader2 className="w-2.5 h-2.5 animate-spin text-accent" />
                        ) : (
                          <Check className="w-3 h-3 text-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                        )}
                      </span>
                      <span className={clsx(
                        "text-[11px] font-medium text-text",
                        isWaiting && "text-text-dim italic"
                      )}>
                        {label}
                        {isWaiting ? ' (väntar)' : ''}
                      </span>
                    </div>
                    {task.dueAt && (
                      <span className="text-[10px] text-text-dim font-mono">
                        {formatDueTime(task.dueAt) || ''}
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className="pt-2 border-t border-border/5 mt-auto flex justify-end w-full">
        <Link 
          to={HOME_SUPERHUB_ROUTES.planeringHub} 
          className={clsx(
            'text-[10px] font-semibold text-accent hover:text-accent-light transition-colors flex items-center gap-1',
            variant === 'executive' && 'uppercase tracking-wider',
          )}
        >
          + Lägg till steg
        </Link>
      </div>
    </div>
  );
}

