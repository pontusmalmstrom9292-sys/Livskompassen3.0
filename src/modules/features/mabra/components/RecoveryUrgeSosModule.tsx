import { useCallback, useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import {
  BREATH_PHASE_SECONDS,
  GROUNDING_STEPS,
} from '@/features/dailyLife/wellbeing/mabra/constants';

type BreathPhase = keyof typeof BREATH_PHASE_SECONDS;
type SosTool = 'breathing' | 'grounding';

const PHASE_LABEL: Record<BreathPhase, string> = {
  inhale: 'Andas in…',
  hold: 'Håll…',
  exhale: 'Andas ut…',
};

const PHASE_SCALE: Record<BreathPhase, number> = {
  inhale: 1.18,
  hold: 1.18,
  exhale: 0.82,
};

function nextPhase(phase: BreathPhase): BreathPhase {
  if (phase === 'inhale') return 'hold';
  if (phase === 'hold') return 'exhale';
  return 'inhale';
}

type Props = {
  onClose: () => void;
};

/** Kat 8 — offline-först SOS / urge surfing (Obsidian Calm, Zero Footprint). */
export function RecoveryUrgeSosModule({ onClose }: Props) {
  const [tool, setTool] = useState<SosTool>('breathing');
  const [phase, setPhase] = useState<BreathPhase>('inhale');
  const [groundStep, setGroundStep] = useState(0);
  const timeoutRef = useRef<number | null>(null);

  const clearTimer = useCallback(() => {
    if (timeoutRef.current != null) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (tool !== 'breathing') {
      clearTimer();
      return;
    }

    setPhase('inhale');

    const schedule = (current: BreathPhase) => {
      setPhase(current);
      const delay = BREATH_PHASE_SECONDS[current] * 1000;
      timeoutRef.current = window.setTimeout(() => {
        schedule(nextPhase(current));
      }, delay);
    };

    schedule('inhale');
    return clearTimer;
  }, [tool, clearTimer]);

  useEffect(() => {
    setGroundStep(0);
  }, [tool]);

  const groundStepData = GROUNDING_STEPS[groundStep];
  const isLastGroundStep = groundStep === GROUNDING_STEPS.length - 1;

  const handleGroundNext = () => {
    if (isLastGroundStep) {
      setGroundStep(0);
      return;
    }
    setGroundStep((i) => i + 1);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Akut stöd — andning och jordning"
      className="fixed inset-0 z-[60] flex flex-col bg-gradient-to-b from-[#020617] via-surface to-surface-2"
    >
      <header className="flex shrink-0 items-center justify-between border-b-[0.5px] border-border px-4 py-3 sm:px-6">
        <p className="font-display-serif text-[10px] uppercase tracking-[0.22em] text-text-dim">
          Akut stöd
        </p>
        <button
          type="button"
          onClick={onClose}
          className="rounded-xl border-[0.5px] border-border/60 p-2 text-text-muted transition-colors hover:border-accent/30 hover:bg-surface-3 hover:text-text"
          aria-label="Stäng akut stöd"
        >
          <X className="h-5 w-5" strokeWidth={1.5} />
        </button>
      </header>

      <div className="calm-scroll-island flex flex-1 flex-col items-center px-4 py-6 sm:px-6">
        <p className="max-w-md text-center text-sm leading-relaxed text-text-muted">
          Det här känns jobbigt. Du behöver inte agera nu.
        </p>

        <div
          role="tablist"
          aria-label="Välj stödverktyg"
          className="mt-6 flex w-full max-w-sm gap-2 rounded-xl border-[0.5px] border-border bg-surface-2/80 p-1"
        >
          <button
            type="button"
            role="tab"
            aria-selected={tool === 'breathing'}
            onClick={() => setTool('breathing')}
            className={`flex-1 rounded-lg px-3 py-2 text-xs uppercase tracking-[0.16em] transition-colors ${
              tool === 'breathing'
                ? 'bg-surface-3 text-accent'
                : 'text-text-dim hover:text-text-muted'
            }`}
          >
            Andning 4-7-8
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tool === 'grounding'}
            onClick={() => setTool('grounding')}
            className={`flex-1 rounded-lg px-3 py-2 text-xs uppercase tracking-[0.16em] transition-colors ${
              tool === 'grounding'
                ? 'bg-surface-3 text-accent'
                : 'text-text-dim hover:text-text-muted'
            }`}
          >
            5-4-3-2-1
          </button>
        </div>

        <div className="mt-8 flex w-full max-w-md flex-1 flex-col items-center justify-center">
          {tool === 'breathing' ? (
            <div className="flex flex-col items-center space-y-6">
              <p className="text-xs uppercase tracking-[0.2em] text-text-dim">4 · 7 · 8</p>
              <div className="relative flex h-52 w-52 items-center justify-center">
                <div
                  aria-hidden
                  className="absolute inset-4 rounded-full bg-accent/[0.07] blur-2xl transition-transform ease-in-out"
                  style={{
                    transform: `scale(${PHASE_SCALE[phase]})`,
                    transitionDuration: `${BREATH_PHASE_SECONDS[phase]}s`,
                  }}
                />
                <div
                  className="relative flex h-36 w-36 items-center justify-center rounded-full border-[0.5px] border-accent/30 bg-accent/[0.08] shadow-[0_0_40px_-8px_rgba(212,175,55,0.25)] transition-transform ease-in-out"
                  style={{
                    transform: `scale(${PHASE_SCALE[phase]})`,
                    transitionDuration: `${BREATH_PHASE_SECONDS[phase]}s`,
                  }}
                >
                  <span className="text-center text-sm text-accent">{PHASE_LABEL[phase]}</span>
                </div>
              </div>
              <p className="max-w-xs text-center text-sm text-text-muted">
                Suget stiger och faller. Du surfar bara.
              </p>
            </div>
          ) : (
            <div className="flex w-full flex-col items-center space-y-6">
              <p className="text-xs uppercase tracking-[0.2em] text-text-dim">Jordning</p>
              <div className="w-full rounded-2xl border-[0.5px] border-border bg-surface-2/70 px-5 py-6 text-center backdrop-blur-sm">
                <p className="font-display text-4xl tabular-nums text-accent">
                  {groundStepData?.count}
                </p>
                <p className="mt-2 font-display-serif text-[10px] uppercase tracking-[0.2em] text-text-dim">
                  {groundStepData?.sense}
                </p>
                <p className="mt-4 text-base text-text">{groundStepData?.prompt}</p>
                <p className="mt-2 text-sm text-text-muted">{groundStepData?.detail}</p>
              </div>
              <p className="text-sm text-text-dim">
                Steg {groundStep + 1} av {GROUNDING_STEPS.length}
              </p>
              <button type="button" onClick={handleGroundNext} className="btn-pill--secondary w-full max-w-sm">
                {isLastGroundStep ? 'Börja om' : 'Gå vidare'}
              </button>
            </div>
          )}
        </div>

        <p className="mt-auto pt-6 text-center text-[11px] text-text-dim">
          Akut fara:{' '}
          <span className="text-danger">113</span>
        </p>
      </div>
    </div>
  );
}
