import { useState } from 'react';
import { Calendar, FolderKanban } from 'lucide-react';
import { Link } from 'react-router-dom';
import { TabBar } from '../../core/ui/TabBar';
import { CognitiveLoadStrip } from '../../core/ui/CognitiveLoadStrip';
import { PLANERING_TAGLINE, PLANERING_TABS } from '../constants';
import type { PlaneringTab } from '../types';
import { PlanningKanbanBoard } from './PlanningKanbanBoard';
import { PlaneringFokusPanel } from './PlaneringFokusPanel';
import { PlaneringInkorgPanel } from './PlaneringInkorgPanel';
import { HubPageShell } from '../../core/layout/HubPageShell';

export function PlaneringPage() {
  const [tab, setTab] = useState<PlaneringTab>('handling');

  return (
    <HubPageShell
      eyebrow="Planering"
      title="Handling"
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

      <div className="flex flex-wrap items-center gap-2">
        <TabBar<PlaneringTab> tabs={PLANERING_TABS} active={tab} onChange={setTab} />
        <Link
          to="/projekt"
          className="ml-auto flex items-center gap-1 text-xs uppercase tracking-widest text-text-dim hover:text-accent"
        >
          <FolderKanban className="h-3 w-3" />
          Projekt
        </Link>
      </div>

      {tab === 'handling' && <PlanningKanbanBoard />}
      {tab === 'fokus' && <PlaneringFokusPanel />}
      {tab === 'inkorg' && <PlaneringInkorgPanel />}
    </HubPageShell>
  );
}
