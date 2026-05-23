import { Sparkles } from 'lucide-react';
import { useCallback, useRef, useState } from 'react';
import { BentoCard } from '../../core/ui/BentoCard';
import { useStore } from '../../core/store';
import { saveMabraSession } from '../../core/firebase/firestore';
import {
  BREATHING_ADDON_COPY,
  DEFAULT_MABRA_DURATION,
  exerciseTypeForHub,
  VALUES_COMPASS_COPY,
} from '../constants';
import type {
  MabraDurationMinutes,
  MabraExerciseType,
  MabraFlowStep,
  MabraSymptomHub,
} from '../types';
import { SymptomHub } from './SymptomHub';
import { AkutLanding } from './AkutLanding';
import { DurationPicker } from './DurationPicker';
import { BreathingExercise } from './BreathingExercise';
import { GroundingExercise } from './GroundingExercise';
import { ReframingExercise } from './ReframingExercise';
import { ValuesCompass } from './ValuesCompass';
import { MabraComplete } from './MabraComplete';
import { MabraReflectionSection } from './MabraReflectionSection';
import type { CognitivePlayId } from './CognitivePlaysList';
import type { EmotionCompassValue } from './EmotionCompass';

export function MabraPage() {
  const user = useStore((s) => s.user);
  const [step, setStep] = useState<MabraFlowStep>('hub');
  const [sessionMood, setSessionMood] = useState<EmotionCompassValue | null>(null);
  const [hub, setHub] = useState<MabraSymptomHub | null>(null);
  const [durationMinutes, setDurationMinutes] = useState<MabraDurationMinutes>(DEFAULT_MABRA_DURATION);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [completedExerciseType, setCompletedExerciseType] = useState<MabraExerciseType>('breathing');
  const [addonBreathing, setAddonBreathing] = useState(false);
  const [valuesSavedHint, setValuesSavedHint] = useState(false);
  const sessionStartedAt = useRef<number | null>(null);

  const resetFlow = useCallback(() => {
    setStep('hub');
    setHub(null);
    setDurationMinutes(DEFAULT_MABRA_DURATION);
    setSaveError(null);
    setAddonBreathing(false);
    setValuesSavedHint(false);
    sessionStartedAt.current = null;
  }, []);

  const handleCognitivePlay = useCallback((play: CognitivePlayId) => {
    setAddonBreathing(false);
    setSaveError(null);
    if (play === 'grounding') {
      setHub('find_self');
      setStep('exercise');
      return;
    }
    if (play === 'breathing') {
      setHub('panic_rsd');
      setDurationMinutes(1);
      setStep('exercise');
      return;
    }
    setHub('self_critical');
    sessionStartedAt.current = Date.now();
    setStep('exercise');
  }, []);

  const handleHubSelect = (selected: MabraSymptomHub) => {
    setHub(selected);
    setAddonBreathing(false);
    if (selected === 'self_critical') {
      sessionStartedAt.current = Date.now();
    } else {
      sessionStartedAt.current = null;
    }
    if (selected === 'panic_rsd') {
      setStep('akut');
    } else {
      setStep('exercise');
    }
  };

  const userId = user?.uid;

  const handleExerciseComplete = useCallback(
    async (exerciseType: MabraExerciseType, elapsedSeconds: number) => {
      setCompletedExerciseType(exerciseType);
      setStep('complete');
      setAddonBreathing(false);
      if (!userId) return;
      setSaveError(null);
      try {
        await saveMabraSession(userId, {
          exerciseType,
          durationSeconds: elapsedSeconds,
          hubSymptom: hub ?? undefined,
        });
      } catch {
        setSaveError('Kunde inte spara sessionen — övningen är klar ändå.');
      }
    },
    [userId, hub],
  );

  const finishReframingSession = useCallback(() => {
    const started = sessionStartedAt.current ?? Date.now();
    const elapsedSeconds = Math.round((Date.now() - started) / 1000);
    void handleExerciseComplete('reframing', elapsedSeconds);
  }, [handleExerciseComplete]);

  const handleBreathingComplete = useCallback(
    (elapsedSeconds: number) => {
      if (addonBreathing) {
        finishReframingSession();
        return;
      }
      void handleExerciseComplete('breathing', elapsedSeconds);
    },
    [addonBreathing, finishReframingSession, handleExerciseComplete],
  );

  const handleGroundingComplete = useCallback(
    (elapsedSeconds: number) => {
      void handleExerciseComplete('grounding', elapsedSeconds);
    },
    [handleExerciseComplete],
  );

  const handleReframingComplete = useCallback(() => {
    setStep('breathing_addon');
  }, []);

  const activeExerciseType = hub && !addonBreathing ? exerciseTypeForHub(hub) : null;

  return (
    <div className="space-y-6">
      <BentoCard
        title="Måbra-sidan"
        icon={<Sparkles className="h-4 w-4" />}
        description="Proaktivt självarbete — KBT, värderingar, små vanor"
      >
        <p className="mb-4 text-sm text-text-muted">
          En trygg plats för dig — inte mot någon annan. Ett steg i taget.
        </p>

        {step === 'hub' && (
          <>
            <MabraReflectionSection
              mood={sessionMood}
              onMoodChange={setSessionMood}
              onStartPlay={handleCognitivePlay}
            />
            <SymptomHub
              onSelect={handleHubSelect}
              onOpenValues={() => {
                setValuesSavedHint(false);
                setStep('values');
              }}
            />
            {valuesSavedHint && (
              <p className="text-center text-sm text-text-muted">{VALUES_COMPASS_COPY.savedHint}</p>
            )}
          </>
        )}

        {step === 'values' && userId && (
          <ValuesCompass
            userId={userId}
            onDone={() => {
              setValuesSavedHint(true);
              setStep('hub');
            }}
            onExit={resetFlow}
          />
        )}

        {step === 'values' && !userId && (
          <p className="py-4 text-center text-sm text-text-muted">Logga in för att spara värderingar.</p>
        )}

        {step === 'akut' && hub === 'panic_rsd' && (
          <AkutLanding onContinue={() => setStep('duration')} onExit={resetFlow} />
        )}

        {step === 'duration' && hub === 'panic_rsd' && (
          <DurationPicker
            hub={hub}
            value={durationMinutes}
            onChange={setDurationMinutes}
            onStart={() => setStep('exercise')}
            onBack={() => setStep('akut')}
          />
        )}

        {step === 'exercise' && hub && (activeExerciseType === 'breathing' || addonBreathing) && (
          <BreathingExercise
            variant={addonBreathing || hub === 'self_critical' ? 'self_critical' : 'panic_rsd'}
            durationMinutes={addonBreathing ? 1 : durationMinutes}
            onComplete={handleBreathingComplete}
            onExit={resetFlow}
          />
        )}

        {step === 'exercise' && hub && activeExerciseType === 'grounding' && (
          <GroundingExercise onComplete={handleGroundingComplete} onExit={resetFlow} />
        )}

        {step === 'exercise' && hub && activeExerciseType === 'reframing' && (
          <ReframingExercise onComplete={handleReframingComplete} onExit={resetFlow} />
        )}

        {step === 'breathing_addon' && (
          <div className="flex flex-col items-center space-y-6 py-4">
            <div className="w-full max-w-sm rounded-xl border border-border-strong bg-surface/40 px-5 py-6 text-center">
              <p className="text-base text-accent">{BREATHING_ADDON_COPY.prompt}</p>
              <p className="mt-2 text-sm text-text-muted">{BREATHING_ADDON_COPY.detail}</p>
            </div>
            <div className="flex w-full max-w-sm flex-col gap-2">
              <button
                type="button"
                onClick={() => {
                  setAddonBreathing(true);
                  setStep('exercise');
                }}
                className="btn-pill--secondary"
              >
                {BREATHING_ADDON_COPY.startLabel}
              </button>
              <button type="button" onClick={finishReframingSession} className="btn-pill--ghost text-sm">
                {BREATHING_ADDON_COPY.skipLabel}
              </button>
            </div>
          </div>
        )}

        {step === 'complete' && (
          <>
            <MabraComplete hub={hub} exerciseType={completedExerciseType} onDone={resetFlow} />
            {saveError && <p className="mt-2 text-sm text-text-dim">{saveError}</p>}
          </>
        )}
      </BentoCard>
    </div>
  );
}
