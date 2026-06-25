import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, ChevronRight, LayoutList, Loader2 } from 'lucide-react';
import { clsx } from 'clsx';
import { usePlanningTasks } from '@/features/admin/planning/hooks/usePlanningTasks';
import { homeStepLabel, pickHomeDaySteps } from '@/features/admin/planning/utils/pickHomeDaySteps';
import { HOME_SUPERHUB_ROUTES } from '../homeSuperhubRoutes';

type TabId = 'handling' | 'projekt' | 'inkorg';

const TABS: { id: TabId; label: string }[] = [
  { id: 'handling', label: 'Handling' },
  { id: 'projekt', label: 'Projekt' },
  { id: 'inkorg', label: 'Inkorg' },
];

function weekdayLabel(date: Date): string {
  return date.toLocaleDateString('sv-SE', { weekday: 'long' });
}

export function ExecutivePlaneringCard() {
  const [tab, setTab] = useState<TabId>('handling');
  const { tasks, loading } = usePlanningTasks();
  const steps = useMemo(() => pickHomeDaySteps(tasks, 3), [tasks]);
  const todayLabel = weekdayLabel(new Date());

  return (
    <article className="exec-home-card exec-home-card--planering">
      <header className="exec-home-card__head exec-home-card__head--split">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-accent" strokeWidth={1.5} />
          <p className="exec-home-label mb-0">PLANERING</p>
        </div>
        <span className="exec-planering-date-chip">
          <CalendarDays className="h-3 w-3" strokeWidth={1.5} aria-hidden />
          {todayLabel.charAt(0).toUpperCase() + todayLabel.slice(1)}
        </span>
      </header>

      <div className="exec-planering-tabs mt-3" role="tablist" aria-label="Planering">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            className={clsx('exec-planering-tabs__tab', tab === t.id && 'exec-planering-tabs__tab--active')}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-4 min-h-[4.5rem]">
        {tab === 'handling' ? (
          <>
            <Link
              to={HOME_SUPERHUB_ROUTES.planeringHub}
              className="exec-planering-task-row"
            >
              <span className="exec-planering-task-row__icon" aria-hidden>
                <LayoutList className="h-4 w-4" strokeWidth={1.5} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[10px] uppercase tracking-wider text-text-dim">
                  Dagens uppgifter
                </span>
                <span className="block text-xs text-text-muted">
                  {loading
                    ? 'Laddar…'
                    : steps.length === 0
                      ? 'Inga öppna uppgifter idag.'
                      : `${steps.length} öppna uppgifter`}
                </span>
              </span>
              <ChevronRight className="h-4 w-4 shrink-0 text-accent" strokeWidth={1.75} aria-hidden />
            </Link>
            {!loading && steps.length > 0 ? (
              <ul className="mt-2 space-y-1.5 pl-1">
                {steps.map((task) => (
                  <li key={task.id} className="text-xs text-text-muted">
                    {homeStepLabel(task)}
                  </li>
                ))}
              </ul>
            ) : null}
          </>
        ) : null}

        {tab === 'projekt' ? (
          <div className="space-y-2">
            <p className="text-xs text-text-muted">Projektlistor, anteckningar och bilder.</p>
            <Link to="/projekt" className="exec-home-btn exec-home-btn--primary inline-flex">
              Öppna Projekt
            </Link>
          </div>
        ) : null}

        {tab === 'inkorg' ? (
          <div className="space-y-2">
            <p className="text-xs text-text-muted">Fånga tankar och inkast till Planering.</p>
            <Link
              to={HOME_SUPERHUB_ROUTES.planeringInkast}
              className="exec-home-btn exec-home-btn--primary inline-flex"
            >
              Öppna Inkorg
            </Link>
          </div>
        ) : null}
      </div>
    </article>
  );
}
