import { useState } from 'react';
import { Target } from 'lucide-react';
import { Button, ButtonLink } from '@/design-system';
import { BentoCard } from '@/shared/ui/BentoCard';
import { ParalysPanel } from '@/features/dailyLife/wellbeing/compasses/components/ParalysPanel';
import { MICRO_STEP_PANEL_TITLE } from '@/core/copy/compassWidgetLabels';
import { ParalysBreakerWidget } from './ParalysBreakerWidget';
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
      <BentoCard glow="gold" noHover className="planering-fokus-panel__empty text-sm text-text-muted">
        Inga öppna uppgifter i Handling. Lägg till ett kort under fliken Handling.
      </BentoCard>
    );
  }

  return (
    <div className="planering-fokus-panel space-y-4">
      {isOverloaded && cognitiveGuardEnabled && (
        <CognitiveGuardOverloadBanner activeCount={activeTasks.length} />
      )}

      <BentoCard
        glow="gold"
        noHover
        title="Ditt mikrosteg nu"
        icon={<Target className="h-4 w-4" />}
        className="planering-fokus-panel__card space-y-4 text-center"
      >
        <div className="planering-fokus-panel__lead space-y-1">
          <p className="font-display text-xl text-accent">{focusTask.microStep ?? focusTask.title}</p>
          {focusTask.microStep && <p className="text-xs text-text-muted">Uppgift: {focusTask.title}</p>}
        </div>
        {focusTask.dueAt && (
          <p className="text-[10px] uppercase tracking-widest text-text-dim">Deadline {focusTask.dueAt}</p>
        )}

        <ParalysBreakerWidget taskTitle={focusTask.title} />

        <div className="planering-fokus-panel__actions flex flex-wrap justify-center gap-2 pt-2">
          {focusTask.status === 'todo' && (
            <Button variant="secondary" size="sm" onClick={() => void handleMove('waiting')}>
              Markera väntar
            </Button>
          )}
          {focusTask.status !== 'done' && (
            <Button variant="accent" size="sm" onClick={() => void handleMove('done')}>
              Klar
            </Button>
          )}
        </div>

        {nextTask && (
          <Button variant="ghost" size="sm" onClick={() => setManualFocus(nextTask)}>
            Föreslå nästa: {nextTask.microStep ?? nextTask.title}
          </Button>
        )}

        <ButtonLink to="/planering?tab=handling&picked=1" variant="ghost" size="sm">
          Redigera i Handling
        </ButtonLink>

        {!focusTask.microStep && (
          <div className="planering-fokus-panel__paralys border-t border-white/10 pt-4 text-left">
            <Button variant="ghost" size="sm" onClick={() => setShowParalys((o) => !o)}>
              {showParalys ? `Dölj ${MICRO_STEP_PANEL_TITLE.toLowerCase()}` : 'Behöver du ett mikrosteg?'}
            </Button>
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
