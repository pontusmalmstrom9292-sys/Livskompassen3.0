import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { updatePlanningTask } from '@/modules/features/admin/planning/api/planningTasksApi';
import type { PlanningTask } from '@/modules/features/admin/planning/types';
import { pickPlanningFocusTask } from '@/modules/features/admin/planning/utils/cognitiveGuard';
import { useStore } from '@/modules/core/store';
import { MICRO_STEP_PANEL_TITLE } from '@/core/copy/compassWidgetLabels';
import { CheckCircle2, Circle, Loader2, Sparkles } from 'lucide-react';
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
    return (
      <div className="flex h-32 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-white/20" />
      </div>
    );
  }

  return (
    <div className="mt-8 space-y-4">
      <div className="flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-accent" />
        <h3 className="font-display-serif text-lg text-text">{MICRO_STEP_PANEL_TITLE}</h3>
      </div>

      {!focusTask ? (
        <div className="rounded-xl border border-white/5 bg-white/5 p-6 text-center">
          <p className="text-sm text-white/40">Inga öppna steg i Planering.</p>
          <Link
            to="/planering?tab=handling&picked=1"
            className="mt-3 inline-block text-xs text-accent hover:text-accent-light"
          >
            Öppna Handling
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          <AnimatePresence mode="popLayout">
            <motion.div
              key={focusTask.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
              className="group flex items-center justify-between rounded-xl border border-white/5 bg-surface-2 p-4 transition-colors hover:border-accent/30"
            >
              <div className="flex min-w-0 flex-col gap-1">
                <p
                  className={`text-base transition-colors ${
                    completingTaskId === focusTask.id ? 'text-white/30 line-through' : 'text-white/90'
                  }`}
                >
                  {taskDisplayLabel(focusTask)}
                </p>
                {focusTask.microStep && focusTask.title ? (
                  <p className="truncate text-sm text-white/40">Uppgift: {focusTask.title}</p>
                ) : null}
              </div>
              <button
                type="button"
                onClick={() => void handleCompleteTask(focusTask.id)}
                disabled={completingTaskId === focusTask.id}
                className="ml-4 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-accent/50 transition-colors hover:bg-accent/10 hover:text-accent disabled:opacity-50"
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
            <p className="text-center text-xs text-white/35">
              +{openTodos.length - 1} till i Handling ·{' '}
              <Link to="/planering?tab=handling&picked=1" className="text-accent/80 hover:text-accent">
                Visa alla
              </Link>
            </p>
          ) : null}
        </div>
      )}
    </div>
  );
}
