import { useEffect, useMemo } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { planeringInkorgHref } from '../planeringInkorgViews';
import { Calendar, LayoutGrid } from 'lucide-react';
import { HubPageShell } from '@/core/layout/HubPageShell';
import { GoraHubTabBar } from '@/core/navigation/GoraHubTabBar';
import { PLANERING_TAGLINE, PLANERING_MORE_TABS } from '../constants';
import type { PlaneringTab } from '../types';
import { parsePlaneringTab, PLANERING_HUB_LEAD, PLANERING_VIEW_TITLES } from '../planeringHubConfig';
import { PlanningKanbanBoard } from './PlanningKanbanBoard';
import { PlaneringEmailRulesPanel } from './PlaneringEmailRulesPanel';
import { PlaneringSuperModule } from './PlaneringSuperModule';
import { PlaneringHubLayoutPicker } from './PlaneringHubLayoutPicker';
import { PlaneringNextStepSelect } from './PlaneringNextStepSelect';
import { PlaneringQuickListPanel } from './PlaneringQuickListPanel';
import { PlaneringHub } from './PlaneringHub';
import { usePlaneringHubLayout } from '../usePlaneringHubLayout';
import { LivBackLink } from '@/modules/shell/LivBackLink';
import { GoraModulValjare } from './GoraModulValjare';
import { GoraSuperModule } from './GoraSuperModule';
import { VerktygDrawer } from './VerktygDrawer';
import { RoutinesPanel } from './RoutinesPanel';
import {
  hasSeenGoraModulValjare,
  markGoraModulValjareSeen,
} from '../utils/goraModulValjareStorage';

const GORA_SUPER_TABS = new Set<PlaneringTab>(['handling', 'fokus', 'framsteg']);
const WORK_TABS = new Set<PlaneringTab>(['handling', 'fokus', 'framsteg', 'inkorg', 'regler']);

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
  const showModulValjare = isStart || (tab === 'handling' && !picked && !hasSeenGoraModulValjare());

  useEffect(() => {
    if (searchParams.get('picked') === '1') {
      markGoraModulValjareSeen();
    }
  }, [searchParams]);

  const title = PLANERING_VIEW_TITLES[tab];
  const lead = isStart || showModulValjare ? PLANERING_HUB_LEAD : PLANERING_TAGLINE;

  const panel = useMemo(() => {
    if (showModulValjare) return <GoraModulValjare />;
    switch (tab) {
      case 'hub':
        return <PlaneringHub />;
      case 'inkop':
        return <PlaneringQuickListPanel />;
      case 'handling':
        return (
          <>
            <GoraSuperModule variant="handling" />
            <div id="planering-rutiner" className="mt-4">
              <RoutinesPanel defaultOpen={location.hash === '#planering-rutiner'} />
            </div>
          </>
        );
      case 'fokus':
        return <GoraSuperModule variant="fokus" />;
      case 'framsteg':
        return <GoraSuperModule variant="framsteg" />;
      case 'inkorg':
        return <PlaneringSuperModule variant="inkorg" />;
      case 'regler':
        return <PlaneringEmailRulesPanel />;
      default:
        return null;
    }
  }, [tab, showModulValjare, location.hash]);

  void PlanningKanbanBoard;
  void PLANERING_MORE_TABS;

  return (
    <HubPageShell
      eyebrow="Göra"
      title={title}
      lead={lead}
      headerAside={
        <div className="flex items-center gap-2">
          <LivBackLink />
          <Link
            to={planeringInkorgHref('kalender')}
            className="btn-pill--ghost shrink-0 p-2"
            title="Kalender i Inkorg"
            aria-label="Öppna kalender i Inkorg"
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
      <GoraHubTabBar />

      {!showModulValjare && !isHub && !isStart && GORA_SUPER_TABS.has(tab) && (
        <>
          {/* Fler verktyg */}
          <VerktygDrawer activeTab={tab} />
        </>
      )}

      {isHub && (
        <PlaneringHubLayoutPicker activeId={layoutId} onSelect={setLayoutId} compact />
      )}

      {isWorkTab && !showModulValjare && <PlaneringNextStepSelect />}

      <div className={isHub ? 'planering-view planering-view--hub' : 'planering-view'}>
        {panel}
      </div>
    </HubPageShell>
  );
}
