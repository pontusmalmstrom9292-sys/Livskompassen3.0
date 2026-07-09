import { motion } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from '@/design-system';
import {
  BREATH_PHASE_SECONDS,
  BREATHING_VARIANT_COPY,
  PANIC_BREATH_PHASE_LABEL,
} from '../constants';
import type { MabraDurationMinutes, MabraSymptomHub } from '../types';

type BreathPhase = keyof typeof BREATH_PHASE_SECONDS;

const DEFAULT_PHASE_LABEL: Record<BreathPhase, string> = {
  inhale: 'Andas in…',
  hold: 'Håll…',
  exhale: 'Andas ut…',
};

const PHASE_SCALE: Record<BreathPhase, number> = {
  inhale: 1.15,
  hold: 1.15,
  exhale: 0.88,
};

type BreathingVariant = Extract<MabraSymptomHub, 'panic_rsd' | 'self_critical'>;

type Props = {
  durationMinutes: MabraDurationMinutes;
  variant: BreathingVariant;
  onComplete: (elapsedSeconds: number) => void;
  onExit: () => void;
};

function nextPhase(phase: BreathPhase): BreathPhase {
  if (phase === 'inhale') return 'hold';
  if (phase === 'hold') return 'exhale';
  return 'inhale';
}

export function BreathingExercise({ durationMinutes, variant, onComplete, onExit }: Props) {
  const copy = BREATHING_VARIANT_COPY[variant];
  const isPanic = variant === 'panic_rsd';
  const phaseLabel = isPanic ? PANIC_BREATH_PHASE_LABEL : DEFAULT_PHASE_LABEL;
  const [phase, setPhase] = useState<BreathPhase>('inhale');
  const [cycleCount, setCycleCount] = useState(0);
  const [, setTick] = useState(0);
  const startedAt = useRef(Date.now());
  const timeoutRef = useRef<number | null>(null);
  const onCompleteRef = useRef(onComplete);
  const finishRef = useRef<() => void>(() => {});
  const totalMs = durationMinutes * 60 * 1000;

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  const clearTimer = useCallback(() => {
    if (timeoutRef.current != null) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const finish = useCallback(() => {
    clearTimer();
    const elapsedSeconds = Math.round((Date.now() - startedAt.current) / 1000);
    onCompleteRef.current(elapsedSeconds);
  }, [clearTimer]);

  useEffect(() => {
    finishRef.current = finish;
  }, [finish]);

  const handleExit = useCallback(() => {
    clearTimer();
    onExit();
  }, [clearTimer, onExit]);

  useEffect(() => {
    startedAt.current = Date.now();
    setPhase('inhale');
    setCycleCount(0);

    const schedule = (current: BreathPhase) => {
      setPhase(current);
      const delay = BREATH_PHASE_SECONDS[current] * 1000;
      timeoutRef.current = window.setTimeout(() => {
        const elapsed = Date.now() - startedAt.current;
        if (elapsed >= totalMs) {
          finishRef.current();
          return;
        }
        const upcoming = nextPhase(current);
        if (upcoming === 'inhale') {
          setCycleCount((c) => c + 1);
        }
        schedule(upcoming);
      }, delay);
    };

    schedule('inhale');

    return clearTimer;
  }, [durationMinutes, totalMs, clearTimer]);

  useEffect(() => {
    const interval = window.setInterval(() => setTick((t) => t + 1), 1000);
    return () => window.clearInterval(interval);
  }, []);

  const secondsLeft = Math.max(0, Math.ceil((totalMs - (Date.now() - startedAt.current)) / 1000));

  return (
    <div className="flex flex-col items-center space-y-6 py-4">
      <p className="text-xs uppercase tracking-widest text-text-dim">{copy.label}</p>
      <p className="max-w-xs text-center text-sm text-text-muted">{copy.subtitle}</p>
      <motion.div
        initial={{ scale: 0.9, opacity: 0.85 }}
        animate={{ scale: PHASE_SCALE[phase], opacity: 1 }}
        transition={{
          duration: BREATH_PHASE_SECONDS[phase],
          ease: 'easeInOut',
        }}
        className="flex h-40 w-40 items-center justify-center rounded-full border border-accent/30 bg-accent/10"
      >
        <span className="text-center text-sm text-accent">{phaseLabel[phase]}</span>
      </motion.div>
      <p className="text-sm text-text-muted">
        {isPanic ? `Tid kvar: ${secondsLeft}s` : `Cykel ${cycleCount + 1} · ca ${secondsLeft}s kvar`}
      </p>
      <Button variant="ghost" className="text-sm" onClick={handleExit}>
        Avsluta nu
      </Button>
    </div>
  );
}
