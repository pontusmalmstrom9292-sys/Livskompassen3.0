/** @locked MOD-VARD-MABRA — låst modul; unlock via docs/evaluations/*-unlock-MOD-VARD-MABRA.md */
import { lazy, memo, Suspense, useCallback, useEffect, useRef } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/design-system';
import { useShallow } from 'zustand/react/shallow';
import { useStore } from '@/core/store';
import { useMabraStore } from '../store/mabraStore';
import { saveMabraSession } from '@/core/firebase/firestore';
import { MabraVitHub } from '../components/MabraVitHub';
import { DagligMixPanel } from '../components/DagligMixPanel';
import { VitCurriculumPanel } from '../components/VitCurriculumPanel';
import { MaterialPackShortcuts, useLifeHubPreset } from '@/core/lifeOs';
import { ModuleHelpFromRegistry } from '@/core/help/ModuleHelpFromRegistry';
import { pickDailyReflectionCard } from '../lib/pickDagligMix';
import { MabraLowEnergyToggle } from '../components/MabraLowEnergyToggle';
import { CURRICULUMS } from '../content/curriculumCatalog';
import { MabraVitProjectsPanel } from '../components/MabraVitProjectsPanel';
import { MabraHubCollapsible } from '../components/MabraHubCollapsible';
import { MabraNutritionHubPrimary } from '../components/MabraNutritionHubPrimary';
import { readAllVitProjectLastSeen, writeVitProjectLastSeen } from '../lib/vitProjectLastSeen';
import { MabraModulValjare, type MabraModulChoice } from '../components/MabraModulValjare';
import { hasSeenMabraModulValjare } from '../lib/mabraModulValjareStorage';
import { MabraRecoveryBanner } from '@/features/mabra/components/MabraRecoveryBanner';
import { HubErrorBoundary } from '@/shared/ui/HubErrorBoundary';
import { HubPanelSkeleton } from '@/core/ui/HubPanelSkeleton';
import { getMabraRsdErrorCopy } from '../lib/mabraRsdErrorCopy';
import { VALUES_COMPASS_COPY, exerciseTypeForHub } from '../constants';
import type { MabraHubAction, MabraHubItem } from '../mabraHubRegistry';
import type { MabraSymptomHub } from '../types';
import type { MabraProjectId } from '../constants/mabraProjects';
import { PinnedPlaneringModuleSlot } from '@/features/admin/planning/components/PinnedPlaneringModuleSlot';
import { NAV_PATHS } from '@/core/navigation/navTruth';

const MabraGoalPanelLazy = lazy(() =>
  import('../components/MabraGoalPanel').then((m) => ({ default: m.MabraGoalPanel })),
);
const MabraHistoryViewLazy = lazy(() =>
  import('../components/MabraHistoryView').then((m) => ({ default: m.MabraHistoryView })),
);

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

export const MabraHubView = memo(function MabraHubView() {
  const user = useStore((s) => s.user);
  const userId = user?.uid;
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { preset } = useLifeHubPreset();
  
  const {
    setHub,
    setDurationMinutes,
    setAddonBreathing,
    valuesSavedHint, setValuesSavedHint,
    setSelectedPlan,
    hubOpenCategory, setHubOpenCategory,
    hubFocusToken, setHubFocusToken,
    lowEnergyMode, setLowEnergyMode,
    vitLastSeen, setVitLastSeen,
    showHubPicker, setShowHubPicker,
    setSaveError
  } = useMabraStore(
    useShallow((state) => ({
      setHub: state.setHub,
      setDurationMinutes: state.setDurationMinutes,
      setAddonBreathing: state.setAddonBreathing,
      valuesSavedHint: state.valuesSavedHint, setValuesSavedHint: state.setValuesSavedHint,
      setSelectedPlan: state.setSelectedPlan,
      hubOpenCategory: state.hubOpenCategory, setHubOpenCategory: state.setHubOpenCategory,
      hubFocusToken: state.hubFocusToken, setHubFocusToken: state.setHubFocusToken,
      lowEnergyMode: state.lowEnergyMode, setLowEnergyMode: state.setLowEnergyMode,
      vitLastSeen: state.vitLastSeen, setVitLastSeen: state.setVitLastSeen,
      showHubPicker: state.showHubPicker, setShowHubPicker: state.setShowHubPicker,
      setSaveError: state.setSaveError
    }))
  );

  const sessionStartedAt = useRef<number | null>(null);
  const breathingOnlyRef = useRef(false);

  useEffect(() => {
    const onMabraHubIndex =
      location.pathname === '/mabra' ||
      location.pathname === '/mabra/' ||
      (location.pathname === NAV_PATHS.VARDAGEN && searchParams.get('tab') === 'mabra');
    if (onMabraHubIndex && !hasSeenMabraModulValjare()) {
      setShowHubPicker(true);
    }
  }, [location.pathname, searchParams, setShowHubPicker]);

  useEffect(() => {
    if (searchParams.get('project')) {
      setShowHubPicker(false);
    }
  }, [searchParams, setShowHubPicker]);

  const openVitProject = useCallback(
    (projectId: MabraProjectId) => {
      writeVitProjectLastSeen(projectId);
      setVitLastSeen(readAllVitProjectLastSeen() as any);
      setSelectedPlan(null);
      setHubOpenCategory('projekt');
      const next = new URLSearchParams(searchParams);
      next.set('project', projectId);
      setSearchParams(next, { replace: true });
      navigate(`/mabra/projekt/${projectId}`);
    },
    [searchParams, setSearchParams, navigate, setHubOpenCategory, setSelectedPlan, setVitLastSeen],
  );

  useEffect(() => {
    const fromUrl = parseVitProjectParam(searchParams.get('project'));
    if (!fromUrl) return;
    writeVitProjectLastSeen(fromUrl);
    setVitLastSeen(readAllVitProjectLastSeen() as any);
    setSelectedPlan(null);
    setHubOpenCategory('projekt');
    navigate(`/mabra/projekt/${fromUrl}`);
  }, [searchParams, navigate, setHubOpenCategory, setSelectedPlan, setVitLastSeen]);

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
      navigate('/mabra/akut');
    } else {
      const exerciseType = exerciseTypeForHub(selected);
      navigate(`/mabra/ovning/${exerciseType}`);
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
          navigate('/mabra/ovning/breathing');
        } else {
          setHub('panic_rsd');
          setAddonBreathing(false);
          breathingOnlyRef.current = false;
          navigate(action.minutes > 1 ? '/mabra/tid' : '/mabra/ovning/breathing');
        }
        break;
      case 'grounding':
        setHub('find_self');
        setAddonBreathing(false);
        breathingOnlyRef.current = false;
        navigate('/mabra/ovning/grounding');
        break;
      case 'reframing':
        setHub('self_critical');
        setAddonBreathing(false);
        breathingOnlyRef.current = false;
        sessionStartedAt.current = Date.now();
        navigate('/mabra/ovning/reframing');
        break;
      case 'values':
        setValuesSavedHint(false);
        navigate('/mabra/varderingar');
        break;
      case 'project':
        openVitProject(action.projectId);
        break;
      case 'tool':
        if (action.tool === 'recovery_sos') {
          navigate('/mabra/recovery/sos');
        } else if (action.tool === 'micro_play' && action.playBankId) {
          navigate(`/mabra/verktyg/micro_play?playBankId=${action.playBankId}`);
        } else {
          navigate(`/mabra/verktyg/${action.tool}`);
        }
        break;
      default:
        break;
    }
  };

  const handleSelectHubItem = (item: MabraHubItem) => {
    setHubOpenCategory(item.category);
    if (item.id === 'low-checkin') {
      navigate('/mabra/input?inputMode=checkin');
      return;
    }
    if (item.id === 'low-reflection') {
      const { card } = pickDailyReflectionCard({ uid: userId });
      navigate(`/mabra/verktyg/reflection_deck?initialBankId=${card.bankId}`);
      return;
    }
    handleHubAction(item.action);
  };

  const handleModulChoice = useCallback((choice: MabraModulChoice) => {
    setShowHubPicker(false);
    if (choice.kind === 'external_route') {
      navigate(choice.path);
      return;
    }
    if (choice.kind === 'daglig_mix') {
      setHubOpenCategory('lekar');
      navigate('/mabra/verktyg/daglig_mix');
      return;
    }
    if (choice.kind === 'tool') {
      const category =
        choice.tool === 'goals'
          ? 'tankar'
          : choice.tool === 'movement' || choice.tool === 'nutrition'
            ? 'akut'
            : 'lekar';
      setHubOpenCategory(category);
      navigate(`/mabra/verktyg/${choice.tool}`);
      return;
    }
    if (choice.category === 'akut') {
      setHub('panic_rsd');
      setAddonBreathing(false);
      setHubOpenCategory('akut');
      navigate('/mabra/akut');
      return;
    }
    setHubOpenCategory(choice.category);
    setHubFocusToken((n) => n + 1);
  }, [
    navigate,
    setAddonBreathing,
    setHub,
    setHubOpenCategory,
    setHubFocusToken,
    setShowHubPicker,
  ]);

  const openCurriculumReflection = useCallback((bankId: string) => {
    setHubOpenCategory('lekar');
    navigate(`/mabra/verktyg/reflection_deck?initialBankId=${bankId}`);
  }, [navigate, setHubOpenCategory]);

  const openCurriculumPlay = useCallback((bankId: string) => {
    setHubOpenCategory('lekar');
    navigate(`/mabra/verktyg/micro_play?playBankId=${bankId}`);
  }, [navigate, setHubOpenCategory]);

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
    [userId, setSaveError],
  );

  return (
    <div className="mabra-hub-shell space-y-4">
      <MabraRecoveryBanner />
      {showHubPicker && (
        <div className="calm-card glow-bottom-green overflow-hidden rounded-2xl p-4 sm:p-5">
          <MabraModulValjare onSelect={handleModulChoice} onSkip={() => setShowHubPicker(false)} />
        </div>
      )}

      <PinnedPlaneringModuleSlot targetId="mabra.hub" className="mt-2" />

      {!showHubPicker && (
        <div className="flex justify-end">
          <Button
            variant="ghost"
            className="text-xs text-text-dim"
            onClick={() => setShowHubPicker(true)}
          >
            Byt ingång
          </Button>
        </div>
      )}

      {!showHubPicker && (
        <>
          <MabraLowEnergyToggle enabled={lowEnergyMode} onChange={setLowEnergyMode} />

          <MabraVitHub
            openCategory={hubOpenCategory}
            onOpenCategoryChange={setHubOpenCategory}
            onSelectItem={handleSelectHubItem}
            focusToken={hubFocusToken}
            lowEnergyMode={lowEnergyMode}
            profileSlot={
              <div className="flex flex-col items-end gap-2">
                <ModuleHelpFromRegistry moduleId="hub_mabra" preset={preset} />
                <MaterialPackShortcuts preset={preset} hub="mabra" />
              </div>
            }
          />

          {!lowEnergyMode && <MabraNutritionHubPrimary uid={userId} />}

          {!lowEnergyMode && (
            <MabraHubCollapsible title="Mer på hubben" meta="Mix · Mål · Kurser · Historik" defaultOpen={false}>
              <div className="space-y-4">
                <MabraHubCollapsible title="Daglig mix" meta="Ett kort + lek" defaultOpen={false}>
                  <DagligMixPanel uid={userId} onComplete={(p) => void handleDagligMixComplete(p)} />
                </MabraHubCollapsible>
                <MabraHubCollapsible title="Mål och fokus" defaultOpen={false}>
                  <HubErrorBoundary
                    title="Målsättning kunde inte laddas"
                    errorBody={getMabraRsdErrorCopy()}
                    logTag="MabraGoalPanel"
                    glow="green"
                  >
                    <Suspense fallback={<HubPanelSkeleton label="Laddar mål…" lines={3} />}>
                      <MabraGoalPanelLazy />
                    </Suspense>
                  </HubErrorBoundary>
                </MabraHubCollapsible>
                <MabraHubCollapsible title="Dina kurser" meta={`${CURRICULUMS.length} kurser`} defaultOpen={false}>
                  <VitCurriculumPanel onOpenReflection={openCurriculumReflection} onOpenPlay={openCurriculumPlay} />
                </MabraHubCollapsible>
                <MabraHubCollapsible title="Utvecklingsprojekt" meta="Vit-zon" defaultOpen={false}>
                  <MabraVitProjectsPanel lastSeen={vitLastSeen} onOpenProject={openVitProject} />
                </MabraHubCollapsible>
                <MabraHubCollapsible title="Historik" meta="Senaste sessioner" defaultOpen={false}>
                  <HubErrorBoundary
                    title="Historik kunde inte laddas"
                    errorBody={getMabraRsdErrorCopy()}
                    logTag="MabraHistoryView"
                    glow="green"
                  >
                    <Suspense fallback={<HubPanelSkeleton label="Laddar historik…" lines={3} />}>
                      <MabraHistoryViewLazy />
                    </Suspense>
                  </HubErrorBoundary>
                </MabraHubCollapsible>
              </div>
            </MabraHubCollapsible>
          )}

          {valuesSavedHint && <p className="text-center text-sm text-text-muted">{VALUES_COMPASS_COPY.savedHint}</p>}
        </>
      )}
    </div>
  );
});
