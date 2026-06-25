import { useState } from 'react';
import { Loader2, Zap } from 'lucide-react';
import {
  fetchMicroSteps,
  type MicroStep,
} from '@/features/dailyLife/wellbeing/compasses/api/compassService';
import {
  PLANERING_PARALYS_CALM,
  PLANERING_PARALYS_ONE_STEP,
} from '../constants';

type Props = {
  taskTitle: string;
  onSelectAtom?: (atom: string) => void;
  /** 23D — visa endast första mikrosteg via user_overwhelm-synapse. */
  singleStep?: boolean;
};

export function ParalysBreakerWidget({
  taskTitle,
  onSelectAtom,
  singleStep = true,
}: Props) {
  const [step, setStep] = useState<MicroStep | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleBreakdown = async () => {
    const trimmed = taskTitle.trim();
    if (trimmed.length < 3) {
      setError('Skriv kort vad som känns tungt.');
      return;
    }
    if (loading) return;
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
      onSelectAtom?.(first.instruction);
    } catch {
      setError('Kunde inte hämta mikrosteg just nu.');
    } finally {
      setLoading(false);
    }
  };

  if (step) {
    return (
      <div className="mt-3 space-y-2 rounded-xl border border-accent/20 bg-accent/5 p-3 animate-in fade-in duration-300">
        <p className="text-[10px] uppercase tracking-widest text-text-dim text-left">
          {singleStep ? PLANERING_PARALYS_ONE_STEP : 'Dina mikrosteg'}
        </p>
        <p className="text-sm text-text leading-relaxed text-left">{step.instruction}</p>
        <p className="text-[10px] text-text-dim text-left">
          ~{step.estimatedSeconds}s · {step.physicalAnchor}
        </p>
        <p className="text-xs text-text-muted text-left">{PLANERING_PARALYS_CALM}</p>
        <button
          type="button"
          onClick={() => setStep(null)}
          className="mt-1 text-[10px] text-text-dim hover:text-text transition-colors w-full text-center"
        >
          Dölj
        </button>
      </div>
    );
  }

  return (
    <div className="mt-2 text-left">
      <button
        type="button"
        onClick={() => void handleBreakdown()}
        disabled={loading || taskTitle.trim().length < 3}
        className="flex items-center gap-1.5 text-xs text-text-dim hover:text-accent transition-colors disabled:opacity-50"
      >
        {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Zap className="h-3 w-3" />}
        <span>{loading ? 'Hämtar steg…' : PLANERING_PARALYS_ONE_STEP}</span>
      </button>
      {error && <p className="text-danger text-[10px] mt-1 text-left">{error}</p>}
    </div>
  );
}
