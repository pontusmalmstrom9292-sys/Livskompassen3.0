import { useCallback, useEffect, useRef, useState } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { useSpeechToText } from '@/core/hooks/useSpeechToText';
import { REFRAMING_STEPS } from '../constants';
import { shouldRedirectMabraCoachToSpeglar } from '../lib/mabraCoachGuard';
import { writePendingExerciseNote } from '../supermodule/mabraExerciseNoteStorage';
import type { MabraSymptomHub } from '../types';
import { MabraSpeglarGuardHint } from './MabraSpeglarGuardHint';

type Props = {
  onComplete: () => void;
  onExit: () => void;
  hubSymptom?: MabraSymptomHub | null;
};

export function ReframingExercise({ onComplete, onExit, hubSymptom }: Props) {
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [guardDismissed, setGuardDismissed] = useState(false);
  const onCompleteRef = useRef(onComplete);
  const stepKeyRef = useRef<string>(REFRAMING_STEPS[0].stepKey);
  const answersRef = useRef(answers);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  const step = REFRAMING_STEPS[stepIndex];
  stepKeyRef.current = step.stepKey;
  const isLast = stepIndex === REFRAMING_STEPS.length - 1;
  const stepValue = answers[step.stepKey] ?? '';
  const showSpeglarGuard =
    shouldRedirectMabraCoachToSpeglar(stepValue) && !guardDismissed;

  const appendTranscript = useCallback((chunk: string) => {
    if (!chunk) return;
    const key = stepKeyRef.current;
    const current = (answersRef.current[key] ?? '').trim();
    setAnswers((prev) => ({
      ...prev,
      [key]: current ? `${current} ${chunk}` : chunk,
    }));
  }, []);

  const { supported, isListening, interim, error, start, stop } = useSpeechToText({
    lang: 'sv-SE',
    onFinal: appendTranscript,
  });

  useEffect(() => {
    stop();
  }, [stepIndex, stop]);

  useEffect(
    () => () => {
      stop();
      setAnswers({});
    },
    [stop],
  );

  const finish = useCallback(() => {
    stop();
    const snapshot = answersRef.current;
    const hasText = Object.values(snapshot).some((line) => line.trim().length > 0);
    if (hasText) {
      writePendingExerciseNote({
        exerciseType: 'reframing',
        hubSymptom: hubSymptom ?? undefined,
        answers: { ...snapshot },
        capturedAtIso: new Date().toISOString(),
      });
    }
    onCompleteRef.current();
  }, [stop, hubSymptom]);

  const handleNext = () => {
    stop();
    if (isLast) {
      finish();
      return;
    }
    setGuardDismissed(false);
    setStepIndex((i) => i + 1);
  };

  const handleExit = () => {
    stop();
    onExit();
  };

  return (
    <div className="flex flex-col items-center space-y-6 py-4">
      <div className="w-full max-w-sm rounded-xl border border-border-strong bg-surface/40 px-5 py-6">
        <p className="text-xs uppercase tracking-widest text-text-dim">{step.label}</p>
        <p className="mt-3 text-base text-accent">{step.prompt}</p>
        <p className="mt-2 text-sm text-text-muted">{step.detail}</p>
        <textarea
          rows={3}
          value={stepValue}
          onChange={(e) => {
            setGuardDismissed(false);
            setAnswers((prev) => ({
              ...prev,
              [step.stepKey]: e.target.value,
            }));
          }}
          className="mt-4 w-full resize-none rounded-lg border border-border-strong bg-surface/60 px-3 py-2 text-sm text-text-default placeholder:text-text-dim focus:border-accent/40 focus:outline-none"
          placeholder={step.inputMode === 'text_optional' ? 'Valfritt…' : 'Skriv här…'}
          aria-label={step.prompt}
        />
        {supported && (
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={isListening ? stop : start}
              className="btn-pill--ghost text-sm"
              aria-pressed={isListening}
            >
              {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              {isListening ? 'Stoppa röst' : 'Tala in (sv-SE)'}
            </button>
            {interim && <span className="text-xs text-text-dim">Hör: {interim}</span>}
          </div>
        )}
        {error && <p className="mt-1 text-xs text-danger">{error}</p>}
        {showSpeglarGuard && (
          <MabraSpeglarGuardHint
            className="mt-3"
            onStay={() => setGuardDismissed(true)}
          />
        )}
      </div>
      <p className="text-sm text-text-dim">
        Steg {stepIndex + 1} av {REFRAMING_STEPS.length}
      </p>
      <div className="flex w-full max-w-sm flex-col gap-2">
        <button type="button" onClick={handleNext} className="btn-pill--secondary">
          {isLast ? 'Klar' : 'Gå vidare'}
        </button>
        <button type="button" onClick={handleExit} className="btn-pill--ghost text-sm">
          Avsluta nu
        </button>
      </div>
    </div>
  );
}
