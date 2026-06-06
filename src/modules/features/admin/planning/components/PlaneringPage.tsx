import { useMemo } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { planeringInkorgHref } from '../planeringInkorgViews';
import { Calendar, ChevronLeft } from 'lucide-react';
import { TabBar, type TabBarItem } from '@/core/ui/TabBar';
import { HubPageShell } from '@/core/layout/HubPageShell';
import { GoraHubTabBar } from '@/core/navigation/GoraHubTabBar';
import { PLANERING_MORE_TABS, PLANERING_TAGLINE } from '../constants';
import type { PlaneringTab } from '../types';
import { parsePlaneringTab, PLANERING_HUB_LEAD, PLANERING_VIEW_TITLES } from '../planeringHubConfig';
import { PlanningKanbanBoard } from './PlanningKanbanBoard';
import { PlaneringFokusPanel } from './PlaneringFokusPanel';
import { PlanningIntegrationPanel } from './PlanningIntegrationPanel';
import { PlaneringEmailRulesPanel } from './PlaneringEmailRulesPanel';
import { PlaneringFramstegPanel } from './PlaneringFramstegPanel';
import { PlaneringInkorgPanel } from './PlaneringInkorgPanel';
import { PlaneringHub } from './PlaneringHub';
import { PlaneringHubLayoutPicker } from './PlaneringHubLayoutPicker';
import { PlaneringNextStepSelect } from './PlaneringNextStepSelect';
import { PlaneringQuickListPanel } from './PlaneringQuickListPanel';
import { RoutinesPanel } from './RoutinesPanel';
import { usePlaneringHubLayout } from '../usePlaneringHubLayout';
import { LivBackLink } from '@/modules/shell/LivBackLink';

const MORE_TABS = new Set<PlaneringTab>(['fokus', 'framsteg', 'regler']);
const WORK_TABS = new Set<PlaneringTab>(['handling', 'fokus', 'framsteg', 'inkorg', 'regler']);

export function PlaneringPage() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { layoutId, setLayoutId } = usePlaneringHubLayout();
  const tab = parsePlaneringTab(searchParams.get('tab'));
  const isHub = tab === 'hub';
  const isWorkTab = WORK_TABS.has(tab);
  const isMoreTab = MORE_TABS.has(tab);

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
        return (
          <div className="space-y-6">
            <PlanningIntegrationPanel />
            <details className="group rounded-xl border border-border/30 bg-surface/20 p-4">
              <summary className="cursor-pointer text-xs font-medium text-text-dim hover:text-accent list-none [&::-webkit-details-marker]:hidden">
                Avancerad redigering (prioritet, matchtyper, ta bort)
              </summary>
              <div className="mt-4 border-t border-border/30 pt-4">
                <PlaneringEmailRulesPanel />
              </div>
            </details>
          </div>
        );
      default:
        return null;
    }
  }, [tab]);

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
        </div>
      }
    >
      <GoraHubTabBar />

      {!isHub && (
        <Link to="/planering?tab=hub" className="planering-back-link">
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
        <PlaneringHubLayoutPicker activeId={layoutId} onSelect={setLayoutId} compact />
      )}

      {isMoreTab && (
        <>
          <p className="text-xs text-white/45 mb-1">Fler verktyg</p>
          <TabBar<PlaneringTab>
            tabs={PLANERING_MORE_TABS as TabBarItem<PlaneringTab>[]}
            active={tab}
            onChange={(id) => navigate(`/planering?tab=${id}`)}
          />
        </>
      )}

      {isWorkTab && <PlaneringNextStepSelect />}

      {tab === 'handling' && (
        <nav className="flex flex-wrap gap-2 text-sm" aria-label="Fler planeringsverktyg">
          {PLANERING_MORE_TABS.map(({ id, label }) => (
            <Link
              key={id}
              to={`/planering?tab=${id}`}
              className="btn-pill--ghost px-3 py-1 text-white/70 hover:text-accent"
            >
              {label}
            </Link>
          ))}
        </nav>
      )}

      <div className={isHub ? 'planering-view planering-view--hub' : 'planering-view'}>
        {panel}
      </div>
    </HubPageShell>
  );
}
