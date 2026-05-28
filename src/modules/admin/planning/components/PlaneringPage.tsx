import { useMemo } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Calendar, ChevronLeft } from 'lucide-react';
import { TabBar, type TabBarItem } from '../../../core/ui/TabBar';
import { HubPageShell } from '../../../core/layout/HubPageShell';
import { PLANERING_TAGLINE, PLANERING_WORK_TABS } from '../constants';
import type { PlaneringTab } from '../types';
import { parsePlaneringTab, PLANERING_HUB_LEAD, PLANERING_VIEW_TITLES } from '../planeringHubConfig';
import { PlanningKanbanBoard } from './PlanningKanbanBoard';
import { PlaneringFokusPanel } from './PlaneringFokusPanel';
import { PlaneringInkorgPanel } from './PlaneringInkorgPanel';
import { PlaneringHub } from './PlaneringHub';
import { PlaneringHubLayoutPicker } from './PlaneringHubLayoutPicker';
import { PlaneringQuickListPanel } from './PlaneringQuickListPanel';
import { RoutinesPanel } from './RoutinesPanel';
import { usePlaneringHubLayout } from '../usePlaneringHubLayout';

const WORK_TABS = new Set<PlaneringTab>(['handling', 'fokus', 'inkorg']);

export function PlaneringPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { layoutId, setLayoutId } = usePlaneringHubLayout();
  const tab = parsePlaneringTab(searchParams.get('tab'));
  const isHub = tab === 'hub';
  const isWorkTab = WORK_TABS.has(tab);

  const title = PLANERING_VIEW_TITLES[tab];
  const lead = isHub ? PLANERING_HUB_LEAD : PLANERING_TAGLINE;

  const panel = useMemo(() => {
    switch (tab) {
      case 'hub':
        return <PlaneringHub />;
      case 'inkop':
        return <PlaneringQuickListPanel />;
      case 'handling':
        return <PlanningKanbanBoard />;
      case 'fokus':
        return <PlaneringFokusPanel />;
      case 'inkorg':
        return <PlaneringInkorgPanel />;
      default:
        return null;
    }
  }, [tab]);

  return (
    <HubPageShell
      eyebrow="Planering"
      title={title}
      lead={lead}
      headerAside={
        <button
          type="button"
          className="btn-pill--ghost shrink-0 p-2"
          title="Kalender (kommer)"
          aria-label="Kalender — kommer snart"
        >
          <Calendar className="h-4 w-4 text-accent/70" />
        </button>
      }
    >
      {!isHub && (
        <Link to="/planering" className="planering-back-link">
          <ChevronLeft className="h-4 w-4" />
          Alla verktyg
        </Link>
      )}

      {(isHub || tab === 'handling') && (
        <div id="planering-rutiner">
          <RoutinesPanel />
        </div>
      )}

      {isHub && (
        <PlaneringHubLayoutPicker activeId={layoutId} onSelect={setLayoutId} />
      )}

      {isWorkTab && (
        <TabBar<PlaneringTab>
          tabs={PLANERING_WORK_TABS as TabBarItem<PlaneringTab>[]}
          active={tab}
          onChange={(id) => navigate(`/planering?tab=${id}`)}
        />
      )}

      <div className={isHub ? 'planering-view planering-view--hub' : 'planering-view'}>
        {panel}
      </div>
    </HubPageShell>
  );
}
