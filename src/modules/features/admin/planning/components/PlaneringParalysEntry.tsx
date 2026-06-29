import { useState } from 'react';
import { Loader2, Zap } from 'lucide-react';
import { Button } from '@/design-system';
import {
  fetchMicroSteps,
  type MicroStep,
} from '@/features/dailyLife/wellbeing/compasses/api/compassService';
import {
  PLANERING_PARALYS_CALM,
  PLANERING_PARALYS_LEAD,
  PLANERING_PARALYS_ONE_STEP,
} from '../constants';

type Props = {
  /** Första todo-uppgift — används som default-kontext. */
  defaultTaskTitle?: string;
  /** Spara mikrosteg på uppgift i P3. */
  onApplyStep?: (step: string) => void | Promise<void>;
};

/** Fas 23D — P3-ingång: ett mikrosteg från user_overwhelm (breakDownResponse). */
export function PlaneringParalysEntry({ defaultTaskTitle, onApplyStep }: Props) {
  const [open, setOpen] = useState(false);
  const [context, setContext] = useState(defaultTaskTitle ?? '');
  const [step, setStep] = useState<MicroStep | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [applying, setApplying] = useState(false);

  const handleFetch = async () => {
    const trimmed = context.trim();
    if (trimmed.length < 3) {
      setError('Skriv kort vad som känns tungt.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const steps = await fetchMicroSteps(trimmed);
      const first = steps[0];
      if (!first) {
        setError('Inget mikrosteg kunde genereras.');
        return;
      }
      setStep(first);
    } catch {
      setError('Kunde inte hämta mikrosteg just nu.');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    if (!step || !onApplyStep) return;
    setApplying(true);
    try {
      await onApplyStep(step.instruction);
      setOpen(false);
      setStep(null);
    } finally {
      setApplying(false);
    }
  };

  const handleDismiss = () => {
    setOpen(false);
    setStep(null);
    setError(null);
  };

  if (!open) {
    return (
      <div className="planering-paralys-entry planering-paralys-entry--collapsed">
        <p className="planering-paralys-entry__lead text-xs text-text-muted">{PLANERING_PARALYS_LEAD}</p>
        <Button
          variant="ghost"
          size="sm"
          className="planering-paralys-entry__toggle mt-2 inline-flex items-center gap-1.5"
          onClick={() => {
            setOpen(true);
            if (defaultTaskTitle && !context.trim()) {
              setContext(defaultTaskTitle);
            }
          }}
        >
          <Zap className="h-3.5 w-3.5" aria-hidden />
          {PLANERING_PARALYS_ONE_STEP}
        </Button>
      </div>
    );
  }

  return (
    <div className="planering-paralys-entry planering-paralys-entry--open space-y-3 rounded-2xl border border-accent/20 bg-accent/5 p-4">
      <p className="planering-paralys-entry__lead text-xs text-text-muted">{PLANERING_PARALYS_LEAD}</p>

      {!step ? (
        <>
          <label className="block text-[10px] uppercase tracking-widest text-text-dim">
            Vad känns tungt?
            <input
              type="text"
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="T.ex. svara på mejl, packa väska…"
              className="input-glass mt-1 w-full text-sm"
            />
          </label>
          {error ? <p className="text-xs text-danger">{error}</p> : null}
          <div className="planering-paralys-entry__actions flex flex-wrap gap-2">
            <Button
              variant="accent"
              size="sm"
              className="inline-flex items-center gap-1.5"
              disabled={loading}
              onClick={() => void handleFetch()}
            >
              {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
              {PLANERING_PARALYS_ONE_STEP}
            </Button>
            <Button variant="ghost" size="sm" onClick={handleDismiss}>
              Stäng
            </Button>
          </div>
        </>
      ) : (
        <>
          <p className="text-sm leading-relaxed text-text">{step.instruction}</p>
          <p className="text-[10px] text-text-dim">
            ~{step.estimatedSeconds}s · {step.physicalAnchor}
          </p>
          <p className="text-xs text-text-muted">{PLANERING_PARALYS_CALM}</p>
          <div className="flex flex-wrap gap-2">
            {onApplyStep ? (
              <Button variant="accent" size="sm" disabled={applying} onClick={() => void handleApply()}>
                {applying ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
                Lägg i Att göra
              </Button>
            ) : null}
            <Button variant="ghost" size="sm" onClick={handleDismiss}>
              Klart
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
