import { useMemo } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { planeringInkorgHref } from '../planeringInkorgViews';
import { Calendar, ChevronLeft } from 'lucide-react';
import { TabBar, type TabBarItem } from '../../../core/ui/TabBar';
import { HubPageShell } from '../../../core/layout/HubPageShell';
import { PLANERING_TAGLINE, PLANERING_WORK_TABS } from '../constants';
import type { PlaneringTab } from '../types';
import { parsePlaneringTab, PLANERING_HUB_LEAD, PLANERING_VIEW_TITLES } from '../planeringHubConfig';
import { PlanningKanbanBoard } from './PlanningKanbanBoard';
import { PlaneringFokusPanel } from './PlaneringFokusPanel';
import { PlaneringEmailRulesPanel } from './PlaneringEmailRulesPanel';
import { PlaneringFramstegPanel } from './PlaneringFramstegPanel';
import { PlaneringInkorgPanel } from './PlaneringInkorgPanel';
import { PlaneringHub } from './PlaneringHub';
import { PlaneringHubLayoutPicker } from './PlaneringHubLayoutPicker';
import { PlaneringQuickListPanel } from './PlaneringQuickListPanel';
import { RoutinesPanel } from './RoutinesPanel';
import { usePlaneringHubLayout } from '../usePlaneringHubLayout';

const WORK_TABS = new Set<PlaneringTab>(['handling', 'fokus', 'framsteg', 'inkorg', 'regler']);

export function PlaneringPage() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
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
      case 'framsteg':
        return <PlaneringFramstegPanel />;
      case 'inkorg':
        return <PlaneringInkorgPanel />;
      case 'regler':
        return <PlaneringEmailRulesPanel />;
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
        <Link
          to={planeringInkorgHref('kalender')}
          className="btn-pill--ghost shrink-0 p-2"
          title="Kalender i Inkorg"
          aria-label="Öppna kalender i Inkorg"
        >
          <Calendar className="h-4 w-4 text-accent/70" />
        </Link>
      }
    >
      {!isHub && (
        <Link to="/planering" className="planering-back-link">
          <ChevronLeft className="h-4 w-4" />
          Alla verktyg
        </Link>
      )}

      {tab === 'handling' && (
        <div id="planering-rutiner">
          <RoutinesPanel defaultOpen={location.hash === '#planering-rutiner'} />
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
