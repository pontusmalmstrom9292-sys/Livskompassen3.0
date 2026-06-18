import './planering.css';
import { lazy, Suspense, useEffect, useMemo } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Calendar, LayoutGrid, PenLine } from 'lucide-react';
import { clsx } from 'clsx';
import { HubPageShell } from '@/core/layout/HubPageShell';
import { GoraHubTabBar } from '@/core/navigation/GoraHubTabBar';
import { BentoCard } from '@/shared/ui/BentoCard';
import { PLANERING_TAGLINE, PLANERING_MORE_TABS } from '../constants';
import type { PlaneringTab } from '../types';
import { parsePlaneringTab, PLANERING_HUB_LEAD, PLANERING_VIEW_TITLES } from '../planeringHubConfig';
import { PlanningKanbanBoard } from './PlanningKanbanBoard';
import { usePlaneringHubLayout } from '../usePlaneringHubLayout';
import { LivBackLink } from '@/modules/shell/LivBackLink';
import { PlaneringNextStepSelect } from './PlaneringNextStepSelect';
import { PlaneringMoreTabsBar } from './PlaneringMoreTabsBar';
import { PlaneringErrorBoundary } from './PlaneringErrorBoundary';
import { PlaneringBentoShell } from './PlaneringBentoShell';
import {
  hasSeenGoraModulValjare,
  markGoraModulValjareSeen,
} from '../utils/goraModulValjareStorage';
import {
  isPlaneringInputMode,
  type PlaneringInputMode,
} from '../supermodule/planeringInputModes';

const PlaneringInputSuperModule = lazy(() =>
  import('../supermodule/PlaneringInputSuperModule').then((m) => ({
    default: m.PlaneringInputSuperModule,
  })),
);

const GoraModulValjare = lazy(() =>
  import('./GoraModulValjare').then((m) => ({ default: m.GoraModulValjare })),
);
const GoraSuperModule = lazy(() =>
  import('./GoraSuperModule').then((m) => ({ default: m.GoraSuperModule })),
);
const PlaneringSuperModule = lazy(() =>
  import('./PlaneringSuperModule').then((m) => ({ default: m.PlaneringSuperModule })),
);
const PlaneringHub = lazy(() =>
  import('./PlaneringHub').then((m) => ({ default: m.PlaneringHub })),
);
const PlaneringHubLayoutPicker = lazy(() =>
  import('./PlaneringHubLayoutPicker').then((m) => ({ default: m.PlaneringHubLayoutPicker })),
);
const PlaneringQuickListPanel = lazy(() =>
  import('./PlaneringQuickListPanel').then((m) => ({ default: m.PlaneringQuickListPanel })),
);
const PlaneringNotePinPanel = lazy(() =>
  import('./PlaneringNotePinPanel').then((m) => ({ default: m.PlaneringNotePinPanel })),
);
const PlaneringEmailRulesPanel = lazy(() =>
  import('./PlaneringEmailRulesPanel').then((m) => ({ default: m.PlaneringEmailRulesPanel })),
);
const VerktygDrawer = lazy(() =>
  import('./VerktygDrawer').then((m) => ({ default: m.VerktygDrawer })),
);
const RoutinesPanel = lazy(() =>
  import('./RoutinesPanel').then((m) => ({ default: m.RoutinesPanel })),
);

const WORK_TABS = new Set<PlaneringTab>(['handling', 'fokus', 'framsteg', 'inkorg', 'regler']);

function PlaneringPanelFallback() {
  return <p className="text-sm text-text-dim">Laddar Handling…</p>;
}

/** PlaneringPage — P3 Kanban via GoraSuperModule. Fler verktyg via VerktygDrawer. */
export function PlaneringPage() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { layoutId, setLayoutId } = usePlaneringHubLayout();
  const tab = parsePlaneringTab(searchParams.get('tab'));
  const picked = searchParams.get('picked') === '1';
  const isHub = tab === 'hub';
  const isStart = tab === 'start';
  const isWorkTab = WORK_TABS.has(tab);
  const showModulValjare =
    tab === 'start' || (tab === 'handling' && !picked && !hasSeenGoraModulValjare());
  const rawInputMode = searchParams.get('inputMode');
  const embeddedInputMode: PlaneringInputMode | null =
    rawInputMode && isPlaneringInputMode(rawInputMode) ? rawInputMode : null;
  const showEmbeddedInputHub = tab === 'handling' && embeddedInputMode !== null && !showModulValjare;

  useEffect(() => {
    if (searchParams.get('picked') === '1') {
      markGoraModulValjareSeen();
    }
  }, [searchParams]);

  useEffect(() => {
    if (tab === 'handling' && !showModulValjare) {
      markGoraModulValjareSeen();
    }
  }, [tab, showModulValjare]);

  const title = PLANERING_VIEW_TITLES[tab];
  const lead = isStart || showModulValjare ? PLANERING_HUB_LEAD : PLANERING_TAGLINE;

  const panel = useMemo(() => {
    if (showModulValjare) {
      return (
        <Suspense fallback={<PlaneringPanelFallback />}>
          <GoraModulValjare />
        </Suspense>
      );
    }
    switch (tab) {
      case 'hub':
        return (
          <Suspense fallback={<PlaneringPanelFallback />}>
            <PlaneringHub />
          </Suspense>
        );
      case 'inkop':
        return (
          <Suspense fallback={<PlaneringPanelFallback />}>
            <div className="space-y-4">
              <PlaneringQuickListPanel />
              <PlaneringNotePinPanel />
            </div>
          </Suspense>
        );
      case 'handling':
        return (
          <>
            {showEmbeddedInputHub ? (
              <Suspense fallback={<PlaneringPanelFallback />}>
                <PlaneringInputSuperModule initialMode={embeddedInputMode ?? undefined} />
              </Suspense>
            ) : null}
            <Suspense fallback={<PlaneringPanelFallback />}>
              <GoraSuperModule variant="handling" />
            </Suspense>
            <div id="planering-rutiner" className="mt-4">
              <Suspense fallback={null}>
                <RoutinesPanel defaultOpen={location.hash === '#planering-rutiner'} />
              </Suspense>
            </div>
          </>
        );
      case 'fokus':
        return (
          <Suspense fallback={<PlaneringPanelFallback />}>
            <GoraSuperModule variant="fokus" />
          </Suspense>
        );
      case 'framsteg':
        return (
          <Suspense fallback={<PlaneringPanelFallback />}>
            <GoraSuperModule variant="framsteg" />
          </Suspense>
        );
      case 'inkorg':
        return (
          <Suspense fallback={<PlaneringPanelFallback />}>
            <PlaneringSuperModule variant="inkorg" />
          </Suspense>
        );
      case 'regler':
        return (
          <Suspense fallback={<PlaneringPanelFallback />}>
            <PlaneringEmailRulesPanel />
          </Suspense>
        );
      default:
        return null;
    }
  }, [tab, showModulValjare, location.hash, showEmbeddedInputHub, embeddedInputMode]);

  void PlanningKanbanBoard;
  void PLANERING_MORE_TABS;

  return (
    <PlaneringErrorBoundary>
      <HubPageShell
        eyebrow="Vardagen"
        title={title}
        lead={lead}
        headerAside={
          <div className="flex items-center gap-2">
            <LivBackLink />
            <Link
              to="/planering/input"
              className="btn-pill--ghost shrink-0 p-2"
              title="Snabbinmatning"
              aria-label="Öppna planeringsinmatningshub"
            >
              <PenLine className="h-4 w-4 text-accent/70" />
            </Link>
            <Link
              to="/planering/kalender"
              className="btn-pill--ghost shrink-0 p-2"
              title="Veckokalender"
              aria-label="Öppna veckokalender"
            >
              <Calendar className="h-4 w-4 text-accent/70" />
            </Link>
            {!showModulValjare && !isStart && (
              <button
                type="button"
                onClick={() => navigate('/planering?tab=start')}
                className="btn-pill--ghost shrink-0 p-2"
                title="Välj verktyg"
                aria-label="Öppna modulväljare"
              >
                <LayoutGrid className="h-4 w-4 text-accent/70" />
              </button>
            )}
          </div>
        }
      >
        <PlaneringBentoShell showZonePill={!showModulValjare}>
          <GoraHubTabBar />

          {isWorkTab && !showModulValjare && <PlaneringMoreTabsBar activeTab={tab} />}

          {!showModulValjare && !isHub && !isStart && isWorkTab && (
            <Suspense fallback={null}>
              <VerktygDrawer activeTab={tab} />
            </Suspense>
          )}

          {isHub && (
            <Suspense fallback={<PlaneringPanelFallback />}>
              <PlaneringHubLayoutPicker activeId={layoutId} onSelect={setLayoutId} compact />
            </Suspense>
          )}

          {isWorkTab && !showModulValjare && <PlaneringNextStepSelect />}

          <BentoCard
            glow="gold"
            bare
            noHover
            className={clsx(
              'planering-view-panel min-h-0',
              isHub ? 'planering-view planering-view--hub !p-4 sm:!p-5' : 'planering-view !p-4 sm:!p-5',
            )}
          >
            {panel}
          </BentoCard>
        </PlaneringBentoShell>
      </HubPageShell>
    </PlaneringErrorBoundary>
  );
}
