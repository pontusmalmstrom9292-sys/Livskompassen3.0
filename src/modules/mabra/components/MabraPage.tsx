import { Sparkles } from 'lucide-react';
import { useCallback, useState } from 'react';
import { BentoCard } from '../../core/ui/BentoCard';
import { useStore } from '../../core/store';
import { saveMabraSession } from '../../core/firebase/firestore';
import {
  DEFAULT_MABRA_DURATION,
  exerciseTypeForHub,
  hubUsesDurationPicker,
} from '../constants';
import type {
  MabraDurationMinutes,
  MabraExerciseType,
  MabraFlowStep,
  MabraSymptomHub,
} from '../types';
import { SymptomHub } from './SymptomHub';
import { DurationPicker } from './DurationPicker';
import { BreathingExercise } from './BreathingExercise';
import { GroundingExercise } from './GroundingExercise';
import { MabraComplete } from './MabraComplete';

export function MabraPage() {
  const user = useStore((s) => s.user);
  const [step, setStep] = useState<MabraFlowStep>('hub');
  const [hub, setHub] = useState<MabraSymptomHub | null>(null);
  const [durationMinutes, setDurationMinutes] = useState<MabraDurationMinutes>(DEFAULT_MABRA_DURATION);
  const [saveError, setSaveError] = useState<string | null>(null);

  const resetFlow = useCallback(() => {
    setStep('hub');
    setHub(null);
    setDurationMinutes(DEFAULT_MABRA_DURATION);
    setSaveError(null);
  }, []);

  const handleHubSelect = (selected: MabraSymptomHub) => {
    setHub(selected);
    setStep(hubUsesDurationPicker(selected) ? 'duration' : 'exercise');
  };

  const userId = user?.uid;

  const handleExerciseComplete = useCallback(
    async (exerciseType: MabraExerciseType, elapsedSeconds: number) => {
      setStep('complete');
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

  const handleBreathingComplete = useCallback(
    (elapsedSeconds: number) => {
      void handleExerciseComplete('breathing', elapsedSeconds);
    },
    [handleExerciseComplete],
  );

  const handleGroundingComplete = useCallback(
    (elapsedSeconds: number) => {
      void handleExerciseComplete('grounding', elapsedSeconds);
    },
    [handleExerciseComplete],
  );

  const activeExerciseType = hub ? exerciseTypeForHub(hub) : null;

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

        {step === 'hub' && <SymptomHub onSelect={handleHubSelect} />}

        {step === 'duration' &&
          (hub === 'panic_rsd' || hub === 'self_critical') && (
          <DurationPicker
            hub={hub}
            value={durationMinutes}
            onChange={setDurationMinutes}
            onStart={() => setStep('exercise')}
            onBack={resetFlow}
          />
        )}

        {step === 'exercise' && hub && activeExerciseType === 'breathing' && (
          <BreathingExercise
            variant={hub === 'self_critical' ? 'self_critical' : 'panic_rsd'}
            durationMinutes={durationMinutes}
            onComplete={handleBreathingComplete}
            onExit={resetFlow}
          />
        )}

        {step === 'exercise' && hub && activeExerciseType === 'grounding' && (
          <GroundingExercise onComplete={handleGroundingComplete} onExit={resetFlow} />
        )}

        {step === 'complete' && (
          <>
            <MabraComplete onDone={resetFlow} />
            {saveError && <p className="mt-2 text-sm text-text-dim">{saveError}</p>}
          </>
        )}
      </BentoCard>
    </div>
  );
}
