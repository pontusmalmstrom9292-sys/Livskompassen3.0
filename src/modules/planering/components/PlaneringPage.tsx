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

export function PlaneringPage() {
  const [tab, setTab] = useState<PlaneringTab>('handling');

  return (
    <div className="space-y-4">
      <header className="flex items-start justify-between gap-2 px-0.5">
        <div>
          <p className="home-page__eyebrow">Planering</p>
          <h1 className="home-page__title text-xl">Handling</h1>
          <p className="home-page__lead text-xs">{PLANERING_TAGLINE}</p>
        </div>
        <button
          type="button"
          className="btn-pill--ghost shrink-0 p-2"
          title="Kalender (kommer)"
          aria-label="Kalender — kommer i Fas 2"
        >
          <Calendar className="h-4 w-4 text-accent/70" />
        </button>
      </header>

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
    </div>
  );
}
