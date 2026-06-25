import { Brain, Loader2, Check } from 'lucide-react';
import { BentoCard } from '@/shared/ui/BentoCard';
import { MICRO_STEP_PANEL_TITLE } from '@/core/copy/compassWidgetLabels';
import type { PlanningTask } from '../types';
import { ParalysBreakerWidget } from './ParalysBreakerWidget';

interface CognitiveGuardViewProps {
  focusTask: PlanningTask;
  microStepInput: string;
  busyTaskId: string | null;
  setMicroStepInput: (val: string) => void;
  handleSaveMicroStep: (taskId: string) => void;
  handleCompleteFocusTask: (taskId: string) => void;
  toggleGuard: () => void;
}

export function CognitiveGuardView({
  focusTask,
  microStepInput,
  busyTaskId,
  setMicroStepInput,
  handleSaveMicroStep,
  handleCompleteFocusTask,
  toggleGuard,
}: CognitiveGuardViewProps) {
  return (
    <div className="space-y-4 animate-fade-in">
      <BentoCard
        title="Kognitivt skydd aktivt (Pansarläget)"
        description="Överbelastningsskydd · Ett steg i taget"
        icon={<Brain className="h-4 w-4 text-accent" />}
        className="border-accent/30 shadow-accent-glow"
      >
        <p className="text-xs text-text-dim leading-relaxed mb-4">
          Du har många oavslutade uppgifter just nu. För att förhindra stressparalys har vi tillfälligt gömt
          dina andra kolumner. Gör klart denna enda sak först för att bygga positivt momentum.
        </p>

        <div className="rounded-xl border border-border bg-surface-3/30 p-4 space-y-3">
          <span className="text-[10px] uppercase tracking-widest text-accent">Primärt fokus</span>
          <h3 className="text-base font-semibold text-text leading-snug">{focusTask.title}</h3>
          {focusTask.summary && <p className="text-xs text-text-muted">{focusTask.summary}</p>}
          {focusTask.dueAt && (
            <p className="text-[10px] uppercase tracking-widest text-danger">
              Deadline: {focusTask.dueAt}
            </p>
          )}
        </div>

        <div className="mt-4 space-y-3 border-t border-border pt-4">
          <label className="block text-xs text-text-muted">
            Ditt nästa mikrosteg ({MICRO_STEP_PANEL_TITLE.toLowerCase()})
            <span className="block text-[10px] text-text-dim mt-0.5">
              Bryt ner uppgiften till minsta möjliga handling för att komma igång.
            </span>
            <div className="flex gap-2 mt-2">
              <input
                value={microStepInput}
                onChange={(e) => setMicroStepInput(e.target.value)}
                placeholder="T.ex. Öppna webbläsaren, Skriv rubriken..."
                className="input-glass text-xs py-2 flex-1"
                disabled={busyTaskId === focusTask.id}
              />
              <button
                type="button"
                onClick={() => handleSaveMicroStep(focusTask.id)}
                disabled={busyTaskId === focusTask.id}
                className="btn-pill--secondary text-xs shrink-0"
              >
                {busyTaskId === focusTask.id ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  'Spara'
                )}
              </button>
            </div>
          </label>

          <ParalysBreakerWidget
            taskTitle={focusTask.title}
            onSelectAtom={setMicroStepInput}
          />

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={() => handleCompleteFocusTask(focusTask.id)}
              disabled={busyTaskId === focusTask.id}
              className="btn-pill--success flex-1 text-xs justify-center"
            >
              {busyTaskId === focusTask.id ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Check className="h-3.5 w-3.5" />
              )}
              Markera klar
            </button>
            <button
              type="button"
              onClick={toggleGuard}
              className="btn-pill--ghost text-xs flex-1 justify-center"
            >
              Visa hela tavlan ändå
            </button>
          </div>
        </div>
      </BentoCard>
    </div>
  );
}
