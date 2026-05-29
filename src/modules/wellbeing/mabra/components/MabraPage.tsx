import { Sparkles } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { BentoCard } from '../../../core/ui/BentoCard';
import { useStore } from '../../../core/store';
import { saveMabraSession } from '../../../core/firebase/firestore';
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
  MabraToolState,
} from '../types';
import type { MabraHubAction, MabraHubCategory, MabraHubItem } from '../mabraHubRegistry';
import { MabraVitHub } from './MabraVitHub';
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
import { DagligMixPanel } from './DagligMixPanel';
import { VitCurriculumPanel } from './VitCurriculumPanel';
import { HubPageShell } from '../../../core/layout/HubPageShell';
import { MaterialPackShortcuts, useLifeHubPreset } from '../../../core/lifeOs';
import { MabraFeelingCardsTool } from './tools/MabraFeelingCardsTool';
import { MabraReflectionDeckTool } from './tools/MabraReflectionDeckTool';
import { MabraSelfQuizTool } from './tools/MabraSelfQuizTool';
import { MabraMicroPlayTool } from './tools/MabraMicroPlayTool';
import { MabraToolShell } from './tools/MabraToolShell';
import { pickDailyReflectionCard } from '../lib/pickDagligMix';
import { MabraLowEnergyToggle } from './MabraLowEnergyToggle';
import { MabraVitProjectsPanel } from './MabraVitProjectsPanel';
import {
  readAllVitProjectLastSeen,
  writeVitProjectLastSeen,
} from '../lib/vitProjectLastSeen';

const VIT_PROJECT_IDS: MabraProjectId[] = [
  'self_esteem',
  'emotional_memory',
  'learn_together',
  'who_am_i',
];

function parseVitProjectParam(value: string | null): MabraProjectId | null {
  if (!value) return null;
  return VIT_PROJECT_IDS.includes(value as MabraProjectId) ? (value as MabraProjectId) : null;
}

export function MabraPage() {
  const user = useStore((s) => s.user);
  const [searchParams, setSearchParams] = useSearchParams();
  const { preset } = useLifeHubPreset();
  const [step, setStep] = useState<MabraFlowStep>('hub');
  const [hub, setHub] = useState<MabraSymptomHub | null>(null);
  const [durationMinutes, setDurationMinutes] = useState<MabraDurationMinutes>(DEFAULT_MABRA_DURATION);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [completedExerciseType, setCompletedExerciseType] = useState<MabraExerciseType>('breathing');
  const [addonBreathing, setAddonBreathing] = useState(false);
  const [valuesSavedHint, setValuesSavedHint] = useState(false);
  const [activeProjectId, setActiveProjectId] = useState<MabraProjectId | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<MabraPlanKind | null>(null);
  const [tool, setTool] = useState<MabraToolState | null>(null);
  const [hubOpenCategory, setHubOpenCategory] = useState<MabraHubCategory | null>('akut');
  const [hubFocusToken, setHubFocusToken] = useState(0);
  const [lowEnergyMode, setLowEnergyMode] = useState(false);
  const [vitLastSeen, setVitLastSeen] = useState(() => readAllVitProjectLastSeen());
  const sessionStartedAt = useRef<number | null>(null);
  const breathingOnlyRef = useRef(false);

  const activeProject = activeProjectId
    ? MABRA_PROJECTS.find((p) => p.id === activeProjectId) ?? null
    : null;

  const returnToHub = useCallback((category?: MabraHubCategory) => {
    if (category) setHubOpenCategory(category);
    setHubFocusToken((n) => n + 1);
    setStep('hub');
    setTool(null);
  }, []);

  const openVitProject = useCallback(
    (projectId: MabraProjectId) => {
      writeVitProjectLastSeen(projectId);
      setVitLastSeen(readAllVitProjectLastSeen());
      setActiveProjectId(projectId);
      setSelectedPlan(null);
      setStep('project_plan');
      setHubOpenCategory('projekt');
      const next = new URLSearchParams(searchParams);
      next.set('project', projectId);
      setSearchParams(next, { replace: true });
    },
    [searchParams, setSearchParams],
  );

  useEffect(() => {
    const fromUrl = parseVitProjectParam(searchParams.get('project'));
    if (!fromUrl || step !== 'hub') return;
    writeVitProjectLastSeen(fromUrl);
    setVitLastSeen(readAllVitProjectLastSeen());
    setActiveProjectId(fromUrl);
    setSelectedPlan(null);
    setStep('project_plan');
    setHubOpenCategory('projekt');
  }, [searchParams, step]);

  const resetFlow = useCallback(() => {
    setStep('hub');
    setHub(null);
    setActiveProjectId(null);
    setSelectedPlan(null);
    setDurationMinutes(DEFAULT_MABRA_DURATION);
    setSaveError(null);
    setAddonBreathing(false);
    setValuesSavedHint(false);
    setTool(null);
    breathingOnlyRef.current = false;
    sessionStartedAt.current = null;
    setHubFocusToken((n) => n + 1);
    const next = new URLSearchParams(searchParams);
    next.delete('project');
    setSearchParams(next, { replace: true });
  }, [searchParams, setSearchParams]);

  const handleHubSelect = (selected: MabraSymptomHub) => {
    setHub(selected);
    setAddonBreathing(false);
    breathingOnlyRef.current = false;
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

  const handleHubAction = (action: MabraHubAction) => {
    switch (action.type) {
      case 'symptom':
        handleHubSelect(action.hub);
        break;
      case 'breathing':
        setDurationMinutes(action.minutes);
        sessionStartedAt.current = null;
        if (action.variant === 'self_critical') {
          setHub('self_critical');
          setAddonBreathing(true);
          breathingOnlyRef.current = true;
          setStep('exercise');
        } else {
          setHub('panic_rsd');
          setAddonBreathing(false);
          breathingOnlyRef.current = false;
          setStep(action.minutes > 1 ? 'duration' : 'exercise');
        }
        break;
      case 'grounding':
        setHub('find_self');
        setAddonBreathing(false);
        breathingOnlyRef.current = false;
        setStep('exercise');
        break;
      case 'reframing':
        setHub('self_critical');
        setAddonBreathing(false);
        breathingOnlyRef.current = false;
        sessionStartedAt.current = Date.now();
        setStep('exercise');
        break;
      case 'values':
        setValuesSavedHint(false);
        setStep('values');
        break;
      case 'project':
        openVitProject(action.projectId);
        break;
      case 'tool':
        if (action.tool === 'micro_play' && action.playBankId) {
          setTool({ kind: 'micro_play', playBankId: action.playBankId });
        } else if (action.tool === 'feeling_cards') {
          setTool({ kind: 'feeling_cards' });
        } else if (action.tool === 'reflection_deck') {
          setTool({ kind: 'reflection_deck' });
        } else if (action.tool === 'self_quiz') {
          setTool({ kind: 'self_quiz' });
        } else if (action.tool === 'kbt') {
          setTool({ kind: 'kbt' });
        } else if (action.tool === 'daglig_mix') {
          setTool({ kind: 'daglig_mix' });
        }
        setStep('tool');
        break;
      default:
        break;
    }
  };

  const userId = user?.uid;

  const handleSelectHubItem = (item: MabraHubItem) => {
    setHubOpenCategory(item.category);
    if (item.id === 'low-reflection') {
      const { card } = pickDailyReflectionCard({ uid: userId });
      setTool({ kind: 'reflection_deck', initialBankId: card.bankId });
      setStep('tool');
      return;
    }
    handleHubAction(item.action);
  };

  const openDailyReflectionCard = useCallback(() => {
    const { card } = pickDailyReflectionCard({ uid: userId });
    setTool({ kind: 'reflection_deck', initialBankId: card.bankId });
    setStep('tool');
    setHubOpenCategory('lekar');
  }, [userId]);

  const openCurriculumReflection = useCallback((bankId: string) => {
    setTool({ kind: 'reflection_deck', initialBankId: bankId });
    setStep('tool');
    setHubOpenCategory('lekar');
  }, []);

  const openCurriculumPlay = useCallback((bankId: string) => {
    setTool({ kind: 'micro_play', playBankId: bankId });
    setStep('tool');
    setHubOpenCategory('lekar');
  }, []);

  const handleExerciseComplete = useCallback(
    async (exerciseType: MabraExerciseType, elapsedSeconds: number) => {
      setCompletedExerciseType(exerciseType);
      setStep('complete');
      setAddonBreathing(false);
      breathingOnlyRef.current = false;
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
      if (addonBreathing && breathingOnlyRef.current) {
        breathingOnlyRef.current = false;
        setAddonBreathing(false);
        void handleExerciseComplete('breathing', elapsedSeconds);
        return;
      }
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

  const handleDagligMixComplete = useCallback(
    async (payload: {
      cardBankId: string;
      playBankId: string;
      dateKey: string;
      elapsedSeconds: number;
    }) => {
      if (!userId) return;
      setSaveError(null);
      try {
        await saveMabraSession(userId, {
          exerciseType: 'daglig_mix',
          durationSeconds: payload.elapsedSeconds,
          cardBankId: payload.cardBankId,
          playBankId: payload.playBankId,
          mixDateKey: payload.dateKey,
        });
      } catch {
        setSaveError('Kunde inte spara daglig mix — klart ändå lokalt.');
      }
    },
    [userId],
  );

  const activeExerciseType = hub && !addonBreathing ? exerciseTypeForHub(hub) : null;

  return (
    <HubPageShell
      eyebrow="MåBra"
      title="För dig — ett steg i taget"
      lead="Snabbstart och zoner — tillbaka öppnar samma zon igen."
    >
      {step === 'hub' && (
        <>
          <MabraLowEnergyToggle enabled={lowEnergyMode} onChange={setLowEnergyMode} />
          {!lowEnergyMode && (
            <>
              <VitCurriculumPanel
                onOpenReflection={openCurriculumReflection}
                onOpenPlay={openCurriculumPlay}
              />
              <DagligMixPanel uid={userId} onComplete={(p) => void handleDagligMixComplete(p)} />
              <MabraVitProjectsPanel lastSeen={vitLastSeen} onOpenProject={openVitProject} />
            </>
          )}
          <MabraVitHub
            openCategory={hubOpenCategory}
            onOpenCategoryChange={setHubOpenCategory}
            onSelectItem={handleSelectHubItem}
            focusToken={hubFocusToken}
            lowEnergyMode={lowEnergyMode}
            profileSlot={<MaterialPackShortcuts preset={preset} hub="mabra" />}
          />
          {valuesSavedHint && (
            <p className="text-center text-sm text-text-muted">{VALUES_COMPASS_COPY.savedHint}</p>
          )}
        </>
      )}

      {step === 'tool' && tool?.kind === 'feeling_cards' && (
        <MabraFeelingCardsTool onBack={() => returnToHub('lekar')} />
      )}

      {step === 'tool' && tool?.kind === 'reflection_deck' && (
        <MabraReflectionDeckTool
          initialBankId={tool.initialBankId}
          onBack={() => returnToHub('lekar')}
        />
      )}

      {step === 'tool' && tool?.kind === 'self_quiz' && (
        <MabraSelfQuizTool onBack={() => returnToHub('lekar')} />
      )}

      {step === 'tool' && tool?.kind === 'micro_play' && (
        <MabraMicroPlayTool bankId={tool.playBankId} onBack={() => returnToHub('lekar')} />
      )}

      {step === 'tool' && tool?.kind === 'kbt' && (
        <MabraToolShell
          title="Automatiska tankar"
          description="KBT-transformator"
          onBack={() => returnToHub('tankar')}
        >
          <KbtTransformatorPanel />
        </MabraToolShell>
      )}

      {step === 'tool' && tool?.kind === 'daglig_mix' && (
        <MabraToolShell title="Dagens mix" onBack={() => returnToHub('lekar')}>
          <DagligMixPanel uid={userId} onComplete={(p) => void handleDagligMixComplete(p)} />
        </MabraToolShell>
      )}

      {step === 'project_plan' && activeProject && (
        <VitHubPreview
          project={activeProject}
          selectedPlan={selectedPlan}
          onSelectPlan={setSelectedPlan}
          onBack={() => {
            setActiveProjectId(null);
            setSelectedPlan(null);
            returnToHub('projekt');
          }}
        />
      )}

      {step === 'values' && userId && (
        <BentoCard title={VALUES_COMPASS_COPY.title} icon={<Sparkles className="h-4 w-4" />}>
          <ValuesCompass
            userId={userId}
            onDone={() => {
              setValuesSavedHint(true);
              returnToHub('identitet');
            }}
            onExit={resetFlow}
          />
        </BentoCard>
      )}

      {step === 'values' && !userId && (
        <p className="py-4 text-center text-sm text-text-muted">Logga in för att spara värderingar.</p>
      )}

      {step === 'akut' && hub === 'panic_rsd' && (
        <AkutLanding
          onContinue={() => setStep('duration')}
          onExit={() => returnToHub('akut')}
        />
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
          onExit={() => returnToHub('akut')}
        />
      )}

      {step === 'exercise' && hub && activeExerciseType === 'grounding' && (
        <GroundingExercise
          onComplete={handleGroundingComplete}
          onExit={() => returnToHub('akut')}
        />
      )}

      {step === 'exercise' && hub && activeExerciseType === 'reframing' && (
        <ReframingExercise
          onComplete={handleReframingComplete}
          onExit={() => returnToHub('tankar')}
        />
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
                breathingOnlyRef.current = false;
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
          <MabraComplete
            hub={hub}
            exerciseType={completedExerciseType}
            onOpenReflectionCard={openDailyReflectionCard}
            onDone={() => {
              const cat: MabraHubCategory =
                hub === 'find_self' || hub === 'panic_rsd'
                  ? 'akut'
                  : hub === 'self_critical'
                    ? 'tankar'
                    : 'akut';
              returnToHub(cat);
            }}
          />
          {saveError && <p className="mt-2 text-sm text-text-dim">{saveError}</p>}
        </BentoCard>
      )}
    </HubPageShell>
  );
}
