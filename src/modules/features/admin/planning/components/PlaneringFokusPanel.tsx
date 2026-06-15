import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Target } from 'lucide-react';
import { BentoCard } from '@/shared/ui/BentoCard';
import { ParalysPanel } from '@/features/dailyLife/wellbeing/compasses/components/ParalysPanel';
import { MICRO_STEP_PANEL_TITLE } from '@/core/copy/compassWidgetLabels';
import { usePlanningTasks } from '../hooks/usePlanningTasks';
import { useCognitiveGuard } from '../hooks/useCognitiveGuard';
import { pickNextFocusTask } from '../utils/cognitiveGuard';
import type { PlanningTask, PlanningTaskStatus } from '../types';
import { CognitiveGuardOverloadBanner } from './CognitiveGuardOverloadBanner';

export function PlaneringFokusPanel() {
  const [showParalys, setShowParalys] = useState(false);
  const [manualFocus, setManualFocus] = useState<PlanningTask | null>(null);
  const { tasks, loading, moveTask } = usePlanningTasks();
  const { cognitiveGuardEnabled, activeTasks, focusTask: autoFocus, isOverloaded } =
    useCognitiveGuard(tasks);

  const focusTask = manualFocus ?? autoFocus;
  const nextTask =
    focusTask && activeTasks.length > 1
      ? pickNextFocusTask(activeTasks, focusTask.id)
      : null;

  const handleMove = async (status: PlanningTaskStatus) => {
    if (!focusTask) return;
    await moveTask(focusTask.id, status);
    if (status === 'done' && nextTask) {
      setManualFocus(nextTask);
    }
  };

  if (loading) return <p className="text-sm text-text-dim">Laddar…</p>;

  if (!focusTask) {
    return (
      <BentoCard glow="gold" noHover className="text-sm text-text-muted">
        Inga öppna uppgifter i Handling. Lägg till ett kort under fliken Handling.
      </BentoCard>
    );
  }

  return (
    <div className="space-y-4">
      {isOverloaded && cognitiveGuardEnabled && (
        <CognitiveGuardOverloadBanner activeCount={activeTasks.length} />
      )}

      <BentoCard
        glow="gold"
        noHover
        title="Ditt mikrosteg nu"
        icon={<Target className="h-4 w-4" />}
        className="space-y-4 text-center"
      >
        <p className="font-display text-xl text-accent">{focusTask.microStep ?? focusTask.title}</p>
        {focusTask.microStep && <p className="text-xs text-text-muted">Uppgift: {focusTask.title}</p>}
        {focusTask.dueAt && (
          <p className="text-[10px] uppercase tracking-widest text-text-dim">Deadline {focusTask.dueAt}</p>
        )}

        <div className="flex flex-wrap justify-center gap-2 pt-2">
          {focusTask.status === 'todo' && (
            <button
              type="button"
              className="btn-pill--secondary text-xs"
              onClick={() => void handleMove('waiting')}
            >
              Markera väntar
            </button>
          )}
          {focusTask.status !== 'done' && (
            <button
              type="button"
              className="btn-pill--accent text-xs"
              onClick={() => void handleMove('done')}
            >
              Klar
            </button>
          )}
        </div>

        {nextTask && (
          <button
            type="button"
            className="btn-pill--ghost text-xs"
            onClick={() => setManualFocus(nextTask)}
          >
            Föreslå nästa: {nextTask.microStep ?? nextTask.title}
          </button>
        )}

        <Link to="/planering?tab=handling&picked=1" className="btn-pill--ghost inline-flex text-xs">
          Redigera i Handling
        </Link>

        {!focusTask.microStep && (
          <div className="pt-4 border-t border-white/10 text-left">
            <button
              type="button"
              className="btn-pill--ghost text-xs"
              onClick={() => setShowParalys((o) => !o)}
            >
              {showParalys ? `Dölj ${MICRO_STEP_PANEL_TITLE.toLowerCase()}` : 'Behöver du ett mikrosteg?'}
            </button>
            {showParalys && (
              <div className="mt-3">
                <ParalysPanel onDone={() => setShowParalys(false)} />
              </div>
            )}
          </div>
        )}
      </BentoCard>
    </div>
  );
}
