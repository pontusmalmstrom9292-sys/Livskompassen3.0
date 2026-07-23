import { useMemo, useState } from 'react';
import { Button, ButtonLink } from '@/design-system';
import { CalendarDays, ChevronRight, FileText, LayoutList, List, Loader2 } from 'lucide-react';
import { clsx } from 'clsx';
import { BentoCard } from '@/shared/ui/BentoCard';
import { ElongatedModule } from '@/core/ui/ElongatedModule';
import { usePlanningModulePins } from '../hooks/usePlanningModulePins';
import { usePlanningTasks } from '../hooks/usePlanningTasks';
import type { PlaneringModulePin } from '../planningModulePinStorage';
import type { PlaneringPinTargetId } from '../planningPinRegistry';
import type { PlanningTask } from '../types';
import {
  homeStepLabel,
  pickHomeDaySteps,
} from '../utils/pickHomeDaySteps';
import {
  getQuickList,
  openItems,
  toggleQuickListItem,
} from '../quickListStorage';
import { HOME_SUPERHUB_ROUTES } from '@/core/home/homeSuperhubRoutes';
import './planering.css';

type Props = {
  targetId: PlaneringPinTargetId;
  contextKey?: string;
  className?: string;
};

type HomeTabId = 'handling' | 'projekt' | 'habit' | 'makro';

const HOME_TABS: { id: HomeTabId; label: string }[] = [
  { id: 'handling', label: 'Handling' },
  { id: 'projekt', label: 'Projekt' },
  { id: 'habit', label: 'Vanor' },
  { id: 'makro', label: 'Makro' },
];

function weekdayLabel(date: Date): string {
  return date.toLocaleDateString('sv-SE', { weekday: 'long' });
}

function PinListBody({
  pin,
  compact,
}: {
  pin: PlaneringModulePin;
  compact?: boolean;
}) {
  const [tick, setTick] = useState(0);
  if (pin.content.kind !== 'list') return null;
  const list = getQuickList(pin.content.listId);
  const open = openItems(list).slice(0, compact ? 4 : 8);

  return (
    <ul className={clsx('planering-quicklist', compact && 'planering-quicklist--compact')}>
      {open.length === 0 ? (
        <li className="planering-quicklist__empty">Tom lista — öppna Planering.</li>
      ) : (
        open.map((item) => (
          <li key={`${item.id}-${tick}`} className="planering-quicklist__row">
            <button
              type="button"
              className="planering-quicklist__check min-h-11 min-w-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
              aria-label={`Klar: ${item.text}`}
              onClick={() => {
                if (pin.content.kind !== 'list') return;
                toggleQuickListItem(pin.content.listId, item.id);
                setTick((t) => t + 1);
              }}
            >
              <span className="planering-quicklist__check-ring" />
            </button>
            <span className="planering-quicklist__text">{item.text}</span>
          </li>
        ))
      )}
    </ul>
  );
}

function PinNoteBody({ pin }: { pin: PlaneringModulePin }) {
  if (pin.content.kind !== 'note') return null;
  return (
    <p className="whitespace-pre-wrap text-sm leading-relaxed text-text-muted">{pin.content.body}</p>
  );
}

function HomeHandlingTasks() {
  const { tasks, loading, moveTask, user } = usePlanningTasks();
  const [busyId, setBusyId] = useState<string | null>(null);
  const steps = useMemo(() => pickHomeDaySteps(tasks, 6), [tasks]);

  const handleMarkDone = async (task: PlanningTask) => {
    if (!user || task.status === 'done' || busyId) return;
    setBusyId(task.id);
    try {
      await moveTask(task.id, 'done');
    } finally {
      setBusyId(null);
    }
  };

  if (loading) {
    return (
      <p
        className="flex items-center gap-2 py-2 text-xs text-text-muted"
        aria-busy="true"
        aria-live="polite"
      >
        <Loader2 className="h-3.5 w-3.5 animate-spin text-accent" aria-hidden />
        Laddar dagens uppgifter …
      </p>
    );
  }

  if (steps.length === 0) {
    return (
      <p className="py-2 text-xs leading-relaxed text-text-muted">
        Inga öppna uppgifter idag — fånga ett mikrosteg i Planering.
      </p>
    );
  }

  return (
    <ul className="planering-quicklist planering-quicklist--compact">
      {steps.map((task) => {
        const label = homeStepLabel(task);
        const isBusy = busyId === task.id;
        return (
          <li key={task.id} className="planering-quicklist__row">
            <button
              type="button"
              className={clsx('planering-quicklist__check min-h-11 min-w-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40', isBusy && 'planering-quicklist__check--on')}
              aria-label={`Klar: ${label}`}
              disabled={isBusy}
              onClick={() => void handleMarkDone(task)}
            >
              {isBusy ? (
                <Loader2 className="h-3 w-3 animate-spin text-accent" aria-hidden />
              ) : (
                <span className="planering-quicklist__check-ring" />
              )}
            </button>
            <span className="planering-quicklist__text">{label}</span>
          </li>
        );
      })}
    </ul>
  );
}

function HomePlaneringPanel() {
  const [tab, setTab] = useState<HomeTabId>('handling');
  const todayLabel = weekdayLabel(new Date());

  return (
    <article className="calm-card home-planering-panel gs-hub-card p-4" aria-label="Planering">
      <header className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-accent" strokeWidth={1.5} aria-hidden />
          <p className="mb-0 text-[9px] font-bold uppercase tracking-[0.2em] text-accent">Planering</p>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full border border-border/30 bg-surface-3/60 px-2 py-0.5 text-[10px] capitalize text-text-muted">
          <CalendarDays className="h-3 w-3 text-accent" strokeWidth={1.5} aria-hidden />
          {todayLabel}
        </span>
      </header>

      <div
        className="home-planering-panel__tabs mt-3 flex gap-1 border-b border-border/20 pb-2"
        role="tablist"
        aria-label="Planering-vyer"
      >
        {HOME_TABS.map((t) => (
          <Button
            key={t.id}
            type="button"
            role="tab"
            variant="ghost"
            size="sm"
            aria-selected={tab === t.id}
            className={clsx(
              'min-h-11 flex-1 px-2 text-[10px] font-semibold uppercase tracking-wider focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40',
              tab === t.id && 'border-accent/40 bg-accent/10 text-accent',
            )}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </Button>
        ))}
      </div>

      <div className="mt-3 min-h-[4rem]" role="tabpanel">
        {tab === 'handling' ? (
          <div className="space-y-2">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
              Dagens uppgifter
            </p>
            <HomeHandlingTasks />
          </div>
        ) : null}

        {tab === 'projekt' ? (
          <div className="space-y-2 py-1">
            <p className="text-xs text-text-muted">Projektlistor, anteckningar och bilder.</p>
            <ButtonLink to="/projekt" variant="ghost" size="sm" className="inline-flex min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40">
              Öppna Projekt
              <ChevronRight className="ml-1 h-3.5 w-3.5" aria-hidden />
            </ButtonLink>
          </div>
        ) : null}

        {tab === 'habit' ? (
          <div className="space-y-2 py-1">
            <p className="text-xs text-text-muted">Rutiner och vanor — ett steg i taget.</p>
            <ButtonLink to="/planering?tab=fokus" variant="ghost" size="sm" className="inline-flex min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40">
              Öppna Fokus
              <ChevronRight className="ml-1 h-3.5 w-3.5" aria-hidden />
            </ButtonLink>
          </div>
        ) : null}

        {tab === 'makro' ? (
          <div className="space-y-2 py-1">
            <p className="text-xs text-text-muted">Makron och näring — lugnt överblick.</p>
            <ButtonLink to="/vardagen?tab=mabra" variant="ghost" size="sm" className="inline-flex min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40">
              Öppna MåBra
              <ChevronRight className="ml-1 h-3.5 w-3.5" aria-hidden />
            </ButtonLink>
          </div>
        ) : null}
      </div>

      <ButtonLink
        to={HOME_SUPERHUB_ROUTES.planeringHub}
        variant="ghost"
        size="sm"
        className="mt-3 flex w-full items-center justify-center gap-1 min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
      >
        <LayoutList className="h-3.5 w-3.5" aria-hidden />
        Öppna Planering
      </ButtonLink>
    </article>
  );
}

function SinglePinnedModule({ pin }: { pin: PlaneringModulePin }) {
  const [expanded, setExpanded] = useState(false);
  const Icon = pin.content.kind === 'list' ? List : FileText;
  const editLink = '/planering?tab=inkop';

  if (pin.layout === 'elongated') {
    return (
      <ElongatedModule
        title={pin.title}
        lead={pin.content.kind === 'list' ? 'Lista från Planering' : 'Anteckning'}
        icon={Icon}
        tone="gold"
        expanded={expanded}
        onToggle={() => setExpanded((v) => !v)}
      >
        {pin.content.kind === 'list' ? <PinListBody pin={pin} /> : <PinNoteBody pin={pin} />}
        <ButtonLink to={editLink} variant="ghost" size="sm" className="mt-2 inline-flex min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40">
          Redigera i Planering
        </ButtonLink>
      </ElongatedModule>
    );
  }

  if (pin.layout === 'compact') {
    return (
      <div className="pinned-planering-module pinned-planering-module--compact calm-card gs-hub-card px-3 py-2">
        <p className="text-[10px] uppercase tracking-wider text-accent">{pin.title}</p>
        {pin.content.kind === 'list' ? <PinListBody pin={pin} compact /> : <PinNoteBody pin={pin} />}
      </div>
    );
  }

  const cardClass =
    pin.layout === 'tile'
      ? 'pinned-planering-module--tile'
      : 'pinned-planering-module--card';

  return (
    <BentoCard
      title={pin.title}
      description="Från Planering"
      glow="gold"
      className={clsx('pinned-planering-module calm-card gs-hub-card', cardClass)}
    >
      {pin.content.kind === 'list' ? <PinListBody pin={pin} /> : <PinNoteBody pin={pin} />}
      <ButtonLink
        to={editLink}
        variant="ghost"
        size="sm"
        className="mt-3 flex w-full items-center justify-center gap-1 min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
      >
        Öppna i Planering
        <ChevronRight className="h-4 w-4" />
      </ButtonLink>
    </BentoCard>
  );
}

/** Renderar hem-planering + fästa moduler för en skärmplats. */
export function PinnedPlaneringModuleSlot({ targetId, contextKey, className }: Props) {
  const pins = usePlanningModulePins({ targetId, contextKey });
  const isHome = targetId === 'hem.brass.below-grid';

  if (!isHome && pins.length === 0) return null;

  return (
    <div className={clsx('pinned-planering-slot space-y-3', className)} aria-label="Planering">
      {isHome ? <HomePlaneringPanel /> : null}
      {pins.map((pin) => (
        <SinglePinnedModule key={pin.id} pin={pin} />
      ))}
    </div>
  );
}
