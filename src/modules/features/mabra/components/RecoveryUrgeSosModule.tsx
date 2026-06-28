import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowLeft, X } from 'lucide-react';
import {
  BREATH_PHASE_SECONDS,
  GROUNDING_STEPS,
  RECOVERY_SOS_ANCHOR_COPY,
} from '@/features/dailyLife/wellbeing/mabra/constants';

type BreathPhase = keyof typeof BREATH_PHASE_SECONDS;
type SosScreen = 'anchor' | 'breathing' | 'grounding';

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

/** Kat 8 / Fas 23C — offline-först SOS Ankare (Obsidian Calm, Zero Footprint, ingen logg). */
export function RecoveryUrgeSosModule({ onClose }: Props) {
  const [screen, setScreen] = useState<SosScreen>('anchor');
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
    if (screen !== 'breathing') {
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
  }, [screen, clearTimer]);

  useEffect(() => {
    setGroundStep(0);
  }, [screen]);

  const groundStepData = GROUNDING_STEPS[groundStep];
  const isLastGroundStep = groundStep === GROUNDING_STEPS.length - 1;

  const handleGroundNext = () => {
    if (isLastGroundStep) {
      setGroundStep(0);
      return;
    }
    setGroundStep((i) => i + 1);
  };

  const handleBackToAnchor = () => {
    clearTimer();
    setScreen('anchor');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="SOS Ankare — akut stöd"
      className="fixed inset-0 z-[60] flex flex-col bg-gradient-to-b from-bg via-surface to-surface-2"
    >
      <header className="flex shrink-0 items-center justify-between border-b-[0.5px] border-border px-4 py-3 sm:px-6">
        {screen === 'anchor' ? (
          <p className="font-display-serif text-[10px] uppercase tracking-[0.22em] text-text-dim">
            SOS Ankare
          </p>
        ) : (
          <button
            type="button"
            onClick={handleBackToAnchor}
            className="inline-flex items-center gap-1.5 rounded-xl border-[0.5px] border-border/60 px-2 py-1.5 text-xs text-text-muted transition-colors hover:border-accent/30 hover:bg-surface-3 hover:text-text"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={1.5} aria-hidden />
            Tillbaka
          </button>
        )}
        <button
          type="button"
          onClick={onClose}
          className="rounded-xl border-[0.5px] border-border/60 p-2 text-text-muted transition-colors hover:border-accent/30 hover:bg-surface-3 hover:text-text"
          aria-label="Stäng SOS Ankare"
        >
          <X className="h-5 w-5" strokeWidth={1.5} />
        </button>
      </header>

      <div className="calm-scroll-island flex flex-1 flex-col items-center px-4 py-6 sm:px-6">
        {screen === 'anchor' ? (
          <div className="flex w-full max-w-sm flex-1 flex-col justify-center gap-6">
            <p className="text-center font-display-serif text-lg leading-relaxed text-accent">
              {RECOVERY_SOS_ANCHOR_COPY.anchorLine}
            </p>
            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={() => setScreen('breathing')}
                className="ds-btn ds-btn--accent flex flex-col items-center gap-1 py-4"
              >
                <span>{RECOVERY_SOS_ANCHOR_COPY.breatheLabel}</span>
                <span className="text-xs font-normal normal-case tracking-normal opacity-80">
                  {RECOVERY_SOS_ANCHOR_COPY.breatheLead}
                </span>
              </button>
              <button
                type="button"
                onClick={() => setScreen('grounding')}
                className="ds-btn ds-btn--secondary flex flex-col items-center gap-1 py-4"
              >
                <span>{RECOVERY_SOS_ANCHOR_COPY.groundLabel}</span>
                <span className="text-xs font-normal normal-case tracking-normal opacity-80">
                  {RECOVERY_SOS_ANCHOR_COPY.groundLead}
                </span>
              </button>
              <button type="button" onClick={onClose} className="ds-btn ds-btn--ghost py-3 text-sm">
                {RECOVERY_SOS_ANCHOR_COPY.closeLabel}
              </button>
            </div>
          </div>
        ) : screen === 'breathing' ? (
          <div className="flex w-full max-w-md flex-1 flex-col items-center justify-center">
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
          </div>
        ) : (
          <div className="flex w-full max-w-md flex-1 flex-col items-center justify-center">
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
              <button type="button" onClick={handleGroundNext} className="ds-btn ds-btn--secondary w-full max-w-sm">
                {isLastGroundStep ? 'Börja om' : 'Gå vidare'}
              </button>
            </div>
          </div>
        )}

        <p className="mt-auto pt-6 text-center text-[11px] text-text-dim">
          {RECOVERY_SOS_ANCHOR_COPY.emergencyHint}{' '}
          <span className="text-danger">{RECOVERY_SOS_ANCHOR_COPY.emergencyNumber}</span>
        </p>
      </div>
    </div>
  );
}
