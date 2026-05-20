import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { VIVIR_STEPS, SYNAPSE_INDIGO } from '../constants/vivirSteps';

interface Props {
  answers: Record<string, string>;
  onChange: (answers: Record<string, string>) => void;
  onComplete: () => void;
}

export function VivirStepView({ answers, onChange, onComplete }: Props) {
  const [stepIndex, setStepIndex] = useState(0);
  const step = VIVIR_STEPS[stepIndex];
  const value = answers[step.key] ?? '';

  const setValue = (v: string) => onChange({ ...answers, [step.key]: v });

  const isLast = stepIndex === VIVIR_STEPS.length - 1;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <span
          className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium"
          style={{ backgroundColor: `${SYNAPSE_INDIGO}33`, color: SYNAPSE_INDIGO }}
        >
          {step.letter}
        </span>
        <div>
          <p className="text-xs text-white/40">
            Steg {stepIndex + 1} av {VIVIR_STEPS.length}
          </p>
          <p className="text-sm font-medium text-slate-200">{step.title}</p>
        </div>
      </div>

      <p className="text-sm text-slate-300">{step.prompt}</p>

      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={step.placeholder}
        rows={3}
        className="w-full rounded-xl border border-white/10 bg-black/30 p-3 text-sm resize-none focus:outline-none"
        style={{ borderColor: value ? `${SYNAPSE_INDIGO}44` : undefined }}
      />

      <div className="flex gap-2">
        {stepIndex > 0 && (
          <button
            type="button"
            onClick={() => setStepIndex((i) => i - 1)}
            className="flex items-center gap-1 rounded-full border border-white/10 px-4 py-2 text-xs text-slate-400"
          >
            <ChevronLeft className="h-4 w-4" /> Tillbaka
          </button>
        )}
        {!isLast ? (
          <button
            type="button"
            disabled={!value.trim()}
            onClick={() => setStepIndex((i) => i + 1)}
            className="flex items-center gap-2 rounded-full border px-5 py-2 text-xs uppercase tracking-widest disabled:opacity-50"
            style={{ borderColor: `${SYNAPSE_INDIGO}66`, color: SYNAPSE_INDIGO }}
          >
            Nästa <ChevronRight className="h-4 w-4" />
          </button>
        ) : (
          <button
            type="button"
            disabled={!value.trim()}
            onClick={onComplete}
            className="flex items-center gap-2 rounded-full border px-5 py-2 text-xs uppercase tracking-widest disabled:opacity-50"
            style={{ borderColor: `${SYNAPSE_INDIGO}66`, color: SYNAPSE_INDIGO }}
          >
            Jämför med valvet
          </button>
        )}
      </div>
    </div>
  );
}
