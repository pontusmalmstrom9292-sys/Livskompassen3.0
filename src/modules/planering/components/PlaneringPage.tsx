import { useCallback, useMemo } from 'react';
import { Calendar } from 'lucide-react';
import { Navigate, useSearchParams } from 'react-router-dom';
import { TabBar } from '../../core/ui/TabBar';
import { CognitiveLoadStrip } from '../../core/ui/CognitiveLoadStrip';
import { PLANERING_TAGLINE, PLANERING_TABS } from '../constants';
import type { PlaneringTab } from '../types';
import { PlanningKanbanBoard } from './PlanningKanbanBoard';
import { PlaneringFokusPanel } from './PlaneringFokusPanel';
import { PlaneringInkorgPanel } from './PlaneringInkorgPanel';
import { HubPageShell } from '../../core/layout/HubPageShell';
import { RoutinesPanel } from './RoutinesPanel';

function parsePlaneringTab(raw: string | null): PlaneringTab {
  if (raw === 'fokus' || raw === 'inkorg') return raw;
  return 'handling';
}

const TAB_TITLES: Record<PlaneringTab, string> = {
  handling: 'Handling',
  fokus: 'Fokus',
  inkorg: 'Inkorg',
};

export function PlaneringPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');
  const tab = parsePlaneringTab(tabParam);

  const setTab = useCallback(
    (next: PlaneringTab) => {
      setSearchParams(next === 'handling' ? {} : { tab: next }, { replace: true });
    },
    [setSearchParams],
  );

  if (tabParam && tabParam !== 'handling' && tabParam !== 'fokus' && tabParam !== 'inkorg') {
    return <Navigate to="/planering" replace />;
  }

  const title = TAB_TITLES[tab];

  const panel = useMemo(() => {
    switch (tab) {
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
      lead={PLANERING_TAGLINE}
      headerAside={
        <button
          type="button"
          className="btn-pill--ghost shrink-0 p-2"
          title="Kalender (kommer)"
          aria-label="Kalender — kommer i Fas 2"
        >
          <Calendar className="h-4 w-4 text-accent/70" />
        </button>
      }
    >
      <CognitiveLoadStrip hint="En kolumn, ett kort — eller bara Fokus-fliken." />

      <RoutinesPanel />

      <TabBar<PlaneringTab> tabs={PLANERING_TABS} active={tab} onChange={setTab} />

      {panel}
    </HubPageShell>
  );
}
