import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { JadeGuardBanner } from '../../core/ui/JadeGuardBanner';
import { VIVIR_STEPS } from '../constants/vivirSteps';

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
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/20 text-sm font-medium text-accent">
          {step.letter}
        </span>
        <div>
          <p className="text-xs text-text-dim">
            Steg {stepIndex + 1} av {VIVIR_STEPS.length}
          </p>
          <p className="text-sm font-medium text-text-muted">{step.title}</p>
        </div>
      </div>

      <p className="text-sm text-text-muted">{step.prompt}</p>

      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={step.placeholder}
        rows={3}
        className={`input-glass rounded-xl p-3 ${value ? 'border-accent/30' : ''}`}
      />
      <JadeGuardBanner text={value} className="mt-2" />

      <div className="flex gap-2">
        {stepIndex > 0 && (
          <button type="button" onClick={() => setStepIndex((i) => i - 1)} className="btn-pill--ghost">
            <ChevronLeft className="h-4 w-4" /> Tillbaka
          </button>
        )}
        {!isLast ? (
          <button
            type="button"
            disabled={!value.trim()}
            onClick={() => setStepIndex((i) => i + 1)}
            className="btn-pill--secondary disabled:opacity-50"
          >
            Nästa <ChevronRight className="h-4 w-4" />
          </button>
        ) : (
          <button
            type="button"
            disabled={!value.trim()}
            onClick={onComplete}
            className="btn-pill--secondary disabled:opacity-50"
          >
            Jämför med valvet
          </button>
        )}
      </div>
    </div>
  );
}
