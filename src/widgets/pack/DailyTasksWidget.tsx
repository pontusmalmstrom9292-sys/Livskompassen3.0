import { useEffect, useState } from 'react';
import { WidgetButton } from '../components/WidgetButton';
import { WidgetCard } from '../components/WidgetCard';
import { WidgetHeader } from '../components/WidgetHeader';
import { WidgetProgress } from '../components/WidgetProgress';
import { dispatchWidgetGesture, triggerWidgetHaptic } from '../core/WidgetActions';
import { getCached, setCached } from '../core/WidgetCache';
import { finishCompanionCapture } from '../core/finishCompanionCapture';
import { queueWidgetSync } from '../core/WidgetSync';
import { routeWidgetAction } from '../core/WidgetRouter';
import { useCompanionOnline } from '../core/useCompanionOnline';
import { useStudioWidgetConfig } from '../studio/useStudioWidgetConfig';
import { widgetCardClass } from '../studio/studioIdleClass';

const WIDGET_ID = 'daily_tasks';
const FADE_MS = 300;

export type DailyTask = { id: string; title: string; done?: boolean; time?: string };

const DEFAULT_TASKS: DailyTask[] = [
  { id: 't1', title: 'Samtal med skolan', time: '09:30' },
  { id: 't2', title: 'Träning', time: '12:00' },
  { id: 't3', title: 'Fem minuters paus', time: '15:00' },
];

function BellGlyph() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M6 9a6 6 0 1 1 12 0c0 4 1.5 5.5 1.5 5.5H4.5S6 13 6 9z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M10 19a2 2 0 0 0 4 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function ClockGlyph() {
  return (
    <svg className="cw-reminder-row__clock" width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 8v4.5l3 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

/**
 * Dagens Uppgifter — max three (or one in AI single_task), cache-first complete.
 * Mockup: påminnelselista + badge + Visa alla.
 */
export function DailyTasksWidget({
  initial,
  maxVisible = 3,
  onComplete,
  /** When true, empty list means “klart” — never fall back to demo tasks. */
  hosted = false,
  pulseHint = false,
}: {
  initial?: DailyTask[];
  maxVisible?: number;
  /** Optional bridge (e.g. Planering moveTask). */
  onComplete?: (id: string) => void | Promise<void>;
  hosted?: boolean;
  pulseHint?: boolean;
}) {
  const cfg = useStudioWidgetConfig(WIDGET_ID);
  const [tasks, setTasks] = useState<DailyTask[]>(() => {
    if (hosted) return initial ?? [];
    return initial ?? DEFAULT_TASKS;
  });
  const [status, setStatus] = useState<string | null>(null);
  const [fadingId, setFadingId] = useState<string | null>(null);
  const online = useCompanionOnline();
  const limit = Math.max(1, Math.min(3, maxVisible));

  useEffect(() => {
    if (hosted) {
      if (initial === undefined) return;
      setTasks(initial.filter((t) => !t.done).slice(0, limit));
      return;
    }
    if (initial?.length) {
      setTasks(initial.filter((t) => !t.done).slice(0, limit));
      return;
    }
    const cached = getCached<DailyTask[]>(`widget:${WIDGET_ID}:tasks`);
    if (cached?.length) setTasks(cached.filter((t) => !t.done).slice(0, limit));
  }, [limit, initial, hosted]);

  const complete = async (id: string) => {
    if (fadingId) return;
    triggerWidgetHaptic('light');
    setFadingId(id);
    setStatus('Sparar…');
    await dispatchWidgetGesture({
      widgetId: WIDGET_ID,
      gesture: 'tap',
      action: 'complete',
      detail: { taskId: id },
    });
    await new Promise<void>((resolve) => {
      window.setTimeout(() => resolve(), FADE_MS);
    });
    const next = tasks.map((t) => (t.id === id ? { ...t, done: true } : t));
    const visible = next.filter((t) => !t.done).slice(0, limit);
    setTasks(visible);
    setFadingId(null);
    await setCached(`widget:${WIDGET_ID}:tasks`, next);
    await queueWidgetSync({
      type: 'complete',
      source: 'widget_tasks',
      payload: { taskId: id, at: Date.now() },
    });
    try {
      await onComplete?.(id);
    } catch {
      /* local already updated */
    }
    finishCompanionCapture(setStatus, visible.length === 0 ? 'Allt klart' : 'Klart', {
      androidScope: 'tasks',
    });
  };

  const openPlanering = async () => {
    await dispatchWidgetGesture({
      widgetId: WIDGET_ID,
      gesture: 'tap',
      action: 'open_module',
    });
    await routeWidgetAction(
      {
        widgetId: WIDGET_ID,
        action: 'open_module',
        detail: { moduleKey: cfg?.moduleKey ?? 'planering' },
      },
      { moduleKey: cfg?.moduleKey ?? 'planering' },
    );
  };

  const shown = tasks.slice(0, limit);
  const badgeCount = shown.length;
  const focusTitle = shown[0]?.title ?? 'Nästa lugna steg';
  const focusProgress = Math.max(8, Math.min(92, Math.round(((3 - shown.length) / 3) * 100 + (shown.length ? 20 : 80))));

  return (
    <WidgetCard
      size={cfg?.size ?? 'small'}
      material={cfg?.material ?? 'sapphire'}
      className={[
        'cw-card--hero',
        widgetCardClass(cfg?.animation),
        pulseHint ? 'cw-soft-focus' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      data-widget={WIDGET_ID}
    >
      <WidgetHeader
        title="Fokus"
        subtitle={status ?? 'Dagens riktning'}
        offline={!online}
        icon={<BellGlyph />}
        trailing={
          badgeCount > 0 ? (
            <span className="cw-header-badge" aria-label={`${badgeCount} kvar`}>
              {badgeCount}
            </span>
          ) : undefined
        }
      />
      <div className="cw-focus-block">
        <p className="cw-focus-block__label">Dagens fokus</p>
        <p className="cw-focus-block__title">{focusTitle}</p>
        <WidgetProgress value={focusProgress} label="Fokusprogress" />
        <p className="cw-focus-block__pct" aria-hidden>
          {focusProgress}%
        </p>
      </div>
      <ul className="cw-reminder-list">
        {shown.length === 0 ? (
          <li className="cw-empty" style={{ listStyle: 'none' }}>
            <p className="cw-empty__title">Fokus</p>
            <p className="cw-empty__message">Allt klart för nu. Bra jobbat.</p>
            <div className="cw-empty__actions">
              <WidgetButton variant="quiet" size="min" onClick={() => void openPlanering()}>
                Öppna Planering
              </WidgetButton>
            </div>
          </li>
        ) : (
          shown.map((task, i) => (
            <li key={task.id} className={fadingId === task.id ? 'cw-task-fade' : undefined}>
              <button
                type="button"
                onClick={() => void complete(task.id)}
                aria-label={`Markera klar: ${task.title}`}
                disabled={fadingId != null}
                className={[
                  'cw-reminder-row',
                  'cw-row-hit',
                  pulseHint && shown[0]?.id === task.id && !fadingId ? 'cw-pulse-cta' : '',
                  'min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40',
                ]
                  .filter(Boolean)
                  .join(' ')}
                style={{
                  cursor: fadingId ? 'wait' : 'pointer',
                  opacity: fadingId && fadingId !== task.id ? 0.55 : 1,
                }}
              >
                <ClockGlyph />
                <span className="cw-reminder-row__meta">
                  <span className="cw-reminder-row__time">{task.time ?? `Steg ${i + 1}`}</span>
                  <span className="cw-reminder-row__title">{task.title}</span>
                </span>
                <span
                  className={[
                    'cw-reminder-row__check',
                    fadingId === task.id ? 'cw-reminder-row__check--done' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  aria-hidden
                />
              </button>
            </li>
          ))
        )}
      </ul>
      <div className="cw-focus-timer" aria-label="Fokuspass visuellt">
        <div>
          <p className="cw-focus-timer__label">Fokuspass · 1 av 4</p>
          <p className="cw-focus-timer__value">25:00</p>
        </div>
        <button
          type="button"
          className="cw-focus-timer__play min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
          aria-label="Öppna Planering för fokuspass"
          onClick={() => void openPlanering()}
        >
          ▶
        </button>
      </div>
      {shown.length > 0 ? (
        <button
          type="button"
          className="cw-link-cta min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
          onClick={() => void openPlanering()}
        >
          Visa alla
        </button>
      ) : null}
      <div className="cw-trust-row cw-trust-row--split" aria-live="polite">
        <span>{status ?? (online ? 'Fokus idag' : 'Offline — sparas lokalt')}</span>
        <span className="cw-streak">Streak</span>
      </div>
    </WidgetCard>
  );
}
