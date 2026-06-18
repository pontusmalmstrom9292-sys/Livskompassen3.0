import { useCallback, useEffect, useRef, useState } from 'react';
import { MB_PLAY_54321_STEPS } from '../content/grounding54321Play';

type Props = {
  onComplete: (elapsedSeconds: number) => void;
  onExit: () => void;
};

export function GroundingExercise({ onComplete, onExit }: Props) {
  const [stepIndex, setStepIndex] = useState(0);
  const startedAt = useRef(Date.now());
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  const step = MB_PLAY_54321_STEPS[stepIndex];
  const isLast = stepIndex === MB_PLAY_54321_STEPS.length - 1;

  const finish = useCallback(() => {
    const elapsedSeconds = Math.round((Date.now() - startedAt.current) / 1000);
    onCompleteRef.current(elapsedSeconds);
  }, []);

  const handleNext = () => {
    if (isLast) {
      finish();
      return;
    }
    setStepIndex((i) => i + 1);
  };

  return (
    <div className="flex flex-col items-center space-y-6 py-4">
      <p className="text-xs uppercase tracking-widest text-text-dim">5–4–3–2–1</p>
      <div className="w-full max-w-sm rounded-xl border border-border-strong bg-surface/40 px-5 py-6 text-center">
        <p className="text-3xl font-medium tabular-nums text-accent">{step.count}</p>
        <p className="mt-2 text-xs uppercase tracking-widest text-text-dim">{step.sense}</p>
        <p className="mt-4 text-base text-accent">{step.prompt}</p>
        <p className="mt-2 text-sm text-text-muted">{step.detail}</p>
      </div>
      <p className="text-sm text-text-dim">
        Steg {stepIndex + 1} av {MB_PLAY_54321_STEPS.length}
      </p>
      <div className="flex w-full max-w-sm flex-col gap-2">
        <button type="button" onClick={handleNext} className="btn-pill--secondary">
          {isLast ? 'Klar' : 'Gå vidare'}
        </button>
        <button type="button" onClick={onExit} className="btn-pill--ghost text-sm">
          Avsluta nu
        </button>
      </div>
    </div>
  );
}
