import { useEffect, useMemo, useState } from 'react';
import type { BreathPhase, BreathingExercise } from './breathingExercises';
import { startAuraFlowNative, stopAuraFlowNative } from '@/modules/shared/utils/nativeMindAura';

export type BreathingVisual = {
  ringScale: number;
  ringOpacity: number;
  bgScale: number;
  bgOpacity: number;
};

function visualForPhase(phase: BreathPhase): BreathingVisual {
  if (phase === 'in') {
    return { ringScale: 1.8, ringOpacity: 0.2, bgScale: 1.4, bgOpacity: 0.1 };
  }
  if (phase === 'hold_in') {
    return { ringScale: 1.8, ringOpacity: 0.3, bgScale: 1.4, bgOpacity: 0.15 };
  }
  return { ringScale: 1, ringOpacity: 0, bgScale: 1, bgOpacity: 0 };
}

export function useBreathingCycle(exercise: BreathingExercise, active: boolean) {
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [phase, setPhase] = useState<BreathPhase>('idle');

  useEffect(() => {
    if (!active || exercise.phases.length === 0) {
      setPhase('idle');
      setPhaseIndex(0);
      stopAuraFlowNative();
      return;
    }

    startAuraFlowNative();

    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    let cancelled = false;

    const runAt = (index: number) => {
      if (cancelled) return;
      const step = exercise.phases[index];
      if (!step) return;
      setPhaseIndex(index);
      setPhase(step.phase);
      timeoutId = setTimeout(() => {
        if (cancelled) return;
        runAt((index + 1) % exercise.phases.length);
      }, step.duration);
    };

    runAt(0);

    return () => {
      cancelled = true;
      if (timeoutId) clearTimeout(timeoutId);
      stopAuraFlowNative();
    };
  }, [active, exercise.id, exercise.phases]);

  const activeStep = active ? exercise.phases[phaseIndex] : undefined;
  const activeDuration = phase === 'idle' ? 500 : (activeStep?.duration ?? 1000);
  const activeText =
    activeStep && phase !== 'idle'
      ? `${activeStep.text} (${activeStep.duration / 1000} s)`
      : '';

  const visual = useMemo(() => visualForPhase(phase), [phase]);

  return { phase, phaseIndex, activeStep, activeDuration, activeText, visual };
}
