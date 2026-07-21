import { useEffect, useState } from 'react';
import { WidgetButton } from '../components/WidgetButton';
import { WidgetCard } from '../components/WidgetCard';
import { WidgetHeader } from '../components/WidgetHeader';
import { dispatchWidgetGesture, triggerWidgetHaptic } from '../core/WidgetActions';
import { getCached, setCached } from '../core/WidgetCache';
import { finishCompanionCapture } from '../core/finishCompanionCapture';
import { queueWidgetSync } from '../core/WidgetSync';
import { routeWidgetAction } from '../core/WidgetRouter';
import { useCompanionOnline } from '../core/useCompanionOnline';
import { WidgetPalette, WidgetTouch, WidgetMaterial } from '../core/WidgetTheme';
import { useStudioWidgetConfig } from '../studio/useStudioWidgetConfig';
import { widgetCardClass } from '../studio/studioIdleClass';

const WIDGET_ID = 'daily_tasks';
const FADE_MS = 300;

export type DailyTask = { id: string; title: string; done?: boolean };

const DEFAULT_TASKS: DailyTask[] = [
  { id: 't1', title: 'Drick ett glas vatten' },
  { id: 't2', title: 'Ett mejl till skolan' },
  { id: 't3', title: 'Fem minuters paus' },
];

/**
 * Dagens Uppgifter — max three (or one in AI single_task), cache-first complete.
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
  return (
    <WidgetCard
      size={cfg?.size ?? 'small'}
      material={cfg?.material ?? 'sapphire'}
      className={widgetCardClass(cfg?.animation)}
      data-widget={WIDGET_ID}
    >
      <WidgetHeader
        title="Dagens uppgifter"
        subtitle={status ?? 'Nästa steg'}
        offline={!online}
        icon={<span aria-hidden>📋</span>}
      />
      <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: '0.45rem' }}>
        {shown.length === 0 ? (
          <li
            style={{
              color: WidgetPalette.mutedText,
              fontSize: '0.9rem',
              lineHeight: 1.4,
              display: 'grid',
              gap: '0.55rem',
            }}
          >
            <span>Allt klart för nu. Bra jobbat.</span>
            <WidgetButton variant="quiet" size="min" onClick={() => void openPlanering()}>
              Öppna Planering
            </WidgetButton>
          </li>
        ) : (
          shown.map((task) => (
            <li
              key={task.id}
              className={fadingId === task.id ? 'cw-task-fade' : undefined}
            >
              <button
                type="button"
                onClick={() => void complete(task.id)}
                aria-label={`Markera klar: ${task.title}`}
                disabled={fadingId != null}
                className={
                  pulseHint && shown[0]?.id === task.id && !fadingId ? 'cw-pulse-cta' : undefined
                }
                style={{
                  width: '100%',
                  minHeight: WidgetTouch.minDp,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  textAlign: 'left',
                  borderRadius: 12,
                  border: `1px solid color-mix(in srgb, ${WidgetPalette.premiumGold} 20%, transparent)`,
                  background: WidgetPalette.deepSpaceBlue,
                  boxShadow: WidgetMaterial.insetShadow,
                  color: WidgetPalette.textPrimary,
                  padding: '0.55rem 0.75rem',
                  cursor: fadingId ? 'wait' : 'pointer',
                  opacity: fadingId && fadingId !== task.id ? 0.55 : 1,
                }}
              >
                <span
                  aria-hidden
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: 6,
                    border: `1.5px solid ${WidgetPalette.premiumGold}`,
                    flexShrink: 0,
                    background:
                      fadingId === task.id
                        ? `color-mix(in srgb, ${WidgetPalette.premiumGold} 35%, transparent)`
                        : 'transparent',
                  }}
                />
                <span style={{ fontSize: '0.92rem', lineHeight: 1.3 }}>{task.title}</span>
              </button>
            </li>
          ))
        )}
      </ul>
      <div className="cw-trust-row" aria-live="polite">
        {status ?? (online ? 'Ett steg i taget' : 'Offline — sparas lokalt')}
      </div>
    </WidgetCard>
  );
}
