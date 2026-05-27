import { useMemo } from 'react';
import { Calendar } from 'lucide-react';
import { TabBar, type TabBarItem } from '../../core/ui/TabBar';
import { CognitiveLoadStrip } from '../../core/ui/CognitiveLoadStrip';
import { PLANERING_TAGLINE } from '../constants';
import type { PlaneringTab } from '../types';
import { PlanningKanbanBoard } from './PlanningKanbanBoard';
import { PlaneringFokusPanel } from './PlaneringFokusPanel';
import { PlaneringInkorgPanel } from './PlaneringInkorgPanel';
import { HubPageShell } from '../../core/layout/HubPageShell';
import { RoutinesPanel } from './RoutinesPanel';
import { useHubTab } from '../../core/navigation/hooks/useHubTab';

const TAB_TITLES: Record<PlaneringTab, string> = {
  handling: 'Handling',
  fokus: 'Fokus',
  inkorg: 'Inkorg',
};

export function PlaneringPage() {
  const { tabs, activeTab, setTab } = useHubTab('planering');
  const tab = activeTab as PlaneringTab;

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

      <TabBar<PlaneringTab>
        tabs={tabs as TabBarItem<PlaneringTab>[]}
        active={tab}
        onChange={(id) => setTab(id)}
      />

      {panel}
    </HubPageShell>
  );
}
