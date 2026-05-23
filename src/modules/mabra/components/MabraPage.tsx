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
import { MabraProjectHub } from './MabraProjectHub';
import { VitHubPreview } from './VitHubPreview';
import { MABRA_PROJECTS, type MabraPlanKind, type MabraProjectId } from '../constants/mabraProjects';
import { AkutLanding } from './AkutLanding';
import { DurationPicker } from './DurationPicker';
import { BreathingExercise } from './BreathingExercise';
import { GroundingExercise } from './GroundingExercise';
import { ReframingExercise } from './ReframingExercise';
import { ValuesCompass } from './ValuesCompass';
import { MabraComplete } from './MabraComplete';
import { KbtTransformatorPanel } from './KbtTransformatorPanel';

export function MabraPage() {
  const user = useStore((s) => s.user);
  const [step, setStep] = useState<MabraFlowStep>('hub');
  const [hub, setHub] = useState<MabraSymptomHub | null>(null);
  const [durationMinutes, setDurationMinutes] = useState<MabraDurationMinutes>(DEFAULT_MABRA_DURATION);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [completedExerciseType, setCompletedExerciseType] = useState<MabraExerciseType>('breathing');
  const [addonBreathing, setAddonBreathing] = useState(false);
  const [valuesSavedHint, setValuesSavedHint] = useState(false);
  const [activeProjectId, setActiveProjectId] = useState<MabraProjectId | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<MabraPlanKind | null>(null);
  const sessionStartedAt = useRef<number | null>(null);

  const activeProject = activeProjectId
    ? MABRA_PROJECTS.find((p) => p.id === activeProjectId) ?? null
    : null;

  const resetFlow = useCallback(() => {
    setStep('hub');
    setHub(null);
    setActiveProjectId(null);
    setSelectedPlan(null);
    setDurationMinutes(DEFAULT_MABRA_DURATION);
    setSaveError(null);
    setAddonBreathing(false);
    setValuesSavedHint(false);
    sessionStartedAt.current = null;
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
    <div className="space-y-4">
      <header className="px-0.5">
        <p className="home-page__eyebrow">MåBra</p>
        <h1 className="home-page__title text-xl">För dig — ett steg i taget</h1>
        <p className="home-page__lead text-xs">
          Akut-stöd, egna projekt och Vit hub i Valvet. Inte mot någon annan.
        </p>
      </header>

      <div className="space-y-4">
        {step === 'hub' && (
          <>
            <MabraProjectHub
              onSelectAkut={handleHubSelect}
              onSelectProject={(id) => {
                setActiveProjectId(id);
                setSelectedPlan(null);
                setStep('project_plan');
              }}
              onOpenValues={() => {
                setValuesSavedHint(false);
                setStep('values');
              }}
            />
            {valuesSavedHint && (
              <p className="text-center text-sm text-text-muted">{VALUES_COMPASS_COPY.savedHint}</p>
            )}
            <div>
              <p className="home-page__eyebrow mb-2">Automatiska tankar</p>
              <KbtTransformatorPanel />
            </div>
          </>
        )}

        {step === 'project_plan' && activeProject && (
          <VitHubPreview
            project={activeProject}
            selectedPlan={selectedPlan}
            onSelectPlan={setSelectedPlan}
            onBack={() => {
              setStep('hub');
              setActiveProjectId(null);
              setSelectedPlan(null);
            }}
          />
        )}

        {step === 'values' && userId && (
          <BentoCard title={VALUES_COMPASS_COPY.title} icon={<Sparkles className="h-4 w-4" />}>
          <ValuesCompass
            userId={userId}
            onDone={() => {
              setValuesSavedHint(true);
              setStep('hub');
            }}
            onExit={resetFlow}
          />
          </BentoCard>
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
          <BentoCard title="Klart" icon={<Sparkles className="h-4 w-4" />}>
            <MabraComplete hub={hub} exerciseType={completedExerciseType} onDone={resetFlow} />
            {saveError && <p className="mt-2 text-sm text-text-dim">{saveError}</p>}
          </BentoCard>
        )}
      </div>
    </div>
  );
}
