import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { updatePlanningTask } from '@/modules/features/admin/planning/api/planningTasksApi';
import type { PlanningTask } from '@/modules/features/admin/planning/types';
import { pickPlanningFocusTask } from '@/modules/features/admin/planning/utils/cognitiveGuard';
import { useStore } from '@/modules/core/store';
import { MICRO_STEP_PANEL_TITLE } from '@/core/copy/compassWidgetLabels';
import { CheckCircle2, Circle, Sparkles } from 'lucide-react';
import { EmptyState } from '@/core/ui/EmptyState';
import { HubPanelSkeleton } from '@/core/ui/HubPanelSkeleton';
import { useMorningOrchestration } from '../hooks/useMorningOrchestration';

function taskDisplayLabel(task: PlanningTask): string {
  return (task.microStep?.trim() || task.title).trim();
}

/** Morgonkompassen — exakt ett P3-mikrosteg (Paralys-Brytaren-princip). */
export function DailyTasksList() {
  const user = useStore((state) => state.user);
  const { tasks, loading } = useMorningOrchestration();
  const [completingTaskId, setCompletingTaskId] = useState<string | null>(null);

  const openTodos = useMemo(() => tasks.filter((t) => t.status === 'todo'), [tasks]);
  const focusTask = useMemo(() => pickPlanningFocusTask(openTodos), [openTodos]);

  const handleCompleteTask = async (taskId: string) => {
    if (!user?.uid) return;

    setCompletingTaskId(taskId);
    try {
      await updatePlanningTask(user.uid, taskId, { status: 'done' });
    } catch (error) {
      console.error('Kunde inte markera uppgiften som klar:', error);
      setCompletingTaskId(null);
    }
  };

  if (loading) {
    return <HubPanelSkeleton label="Hämtar dagens steg…" lines={3} className="mt-8" />;
  }

  return (
    <div className="mt-8 space-y-4">
      <div className="flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-accent" />
        <h3 className="font-display-serif text-lg text-text">{MICRO_STEP_PANEL_TITLE}</h3>
      </div>

      {!focusTask ? (
        <EmptyState
          className="border-border/20 bg-surface-2/30 py-5 text-center shadow-none"
          message="Inga öppna steg i Planering."
          action={
            <Link
              to="/planering?tab=handling&picked=1"
              className="inline-flex min-h-11 items-center text-xs text-accent hover:text-accent-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
            >
              Öppna Handling
            </Link>
          }
        />
      ) : (
        <div className="space-y-2">
          <AnimatePresence mode="popLayout">
            <motion.div
              key={focusTask.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.15 } }}
              className="group flex items-center justify-between rounded-xl border border-border/25 bg-surface-2 p-4 transition-colors duration-[var(--ds-duration-fast)] hover:border-accent/30"
            >
              <div className="flex min-w-0 flex-col gap-1">
                <p
                  className={`text-base transition-colors duration-[var(--ds-duration-fast)] ${
                    completingTaskId === focusTask.id ? 'text-text-muted line-through' : 'text-text'
                  }`}
                >
                  {taskDisplayLabel(focusTask)}
                </p>
                {focusTask.microStep && focusTask.title ? (
                  <p className="truncate text-sm text-text-muted">Uppgift: {focusTask.title}</p>
                ) : null}
              </div>
              <button
                type="button"
                onClick={() => void handleCompleteTask(focusTask.id)}
                disabled={completingTaskId === focusTask.id}
                className="ml-4 flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-full text-accent/50 transition-colors hover:bg-accent/10 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 disabled:opacity-50"
                aria-label="Markera som klar"
              >
                {completingTaskId === focusTask.id ? (
                  <CheckCircle2 className="h-6 w-6 text-accent" />
                ) : (
                  <Circle className="h-6 w-6" />
                )}
              </button>
            </motion.div>
          </AnimatePresence>
          {openTodos.length > 1 ? (
            <p className="text-center text-xs text-text-muted">
              +{openTodos.length - 1} till i Handling ·{' '}
              <Link to="/planering?tab=handling&picked=1" className="text-accent/80 hover:text-accent min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40">
                Visa alla
              </Link>
            </p>
          ) : null}
        </div>
      )}
    </div>
  );
}
