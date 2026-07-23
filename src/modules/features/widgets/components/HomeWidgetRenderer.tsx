/** @locked MOD-WIDGET — låst modul; unlock via docs/evaluations/*-unlock-MOD-WIDGET.md */
import { useEffect, useState } from 'react';
import { Clock, PiggyBank, ListTodo, FileText, Check, Loader2 } from 'lucide-react';
import { clsx } from 'clsx';
import { getBudgetSavings } from '@/core/firebase/economyFirestore';
import type { BudgetSavingsRow, UserWidgetRow } from '@/core/types/firestore';
import { resolveWidgetStylePreset } from '../config/widgetStylePresets';
import { WidgetDashboardSection } from './WidgetDashboardSection';

export type { UserWidgetRow };

type Props = {
  widget: Pick<
    UserWidgetRow,
    'id' | 'type' | 'title' | 'config' | 'stylePreset' | 'slotId' | 'pinnedToHome' | 'status'
  >;
  userId: string;
  onUpdate?: (widgetId: string, updatedConfig: UserWidgetRow['config']) => Promise<void>;
  /** @deprecated Prefer softActions + archive from board. Kept for compat. */
  onDelete?: (widgetId: string) => Promise<void>;
  /** Hem-slot: ingen redigering/arkivering. */
  readOnly?: boolean;
  /** Board: hide hard-delete; archive handled by parent. */
  softActions?: boolean;
};

export function HomeWidgetRenderer({
  widget,
  userId,
  onUpdate,
  readOnly = false,
  softActions = false,
}: Props) {
  const [savingsGoals, setSavingsGoals] = useState<BudgetSavingsRow[]>([]);
  const [loadingSavings, setLoadingSavings] = useState(false);
  const [busy, setBusy] = useState(false);
  const preset = resolveWidgetStylePreset(widget.stylePreset);
  const interactive = !readOnly && Boolean(onUpdate) && (widget.status ?? 'active') === 'active';

  useEffect(() => {
    if (widget.type !== 'linked_savings' || !userId) return;
    setLoadingSavings(true);
    getBudgetSavings(userId)
      .then(setSavingsGoals)
      .catch(() => setSavingsGoals([]))
      .finally(() => setLoadingSavings(false));
  }, [widget.type, userId]);

  const renderCountdown = () => {
    const dateSource = widget.config.targetDateTime || widget.config.targetDate;
    if (!dateSource) return <p className="text-xs text-text-muted">Inget datum satt.</p>;

    const target = widget.config.targetDateTime
      ? new Date(widget.config.targetDateTime)
      : new Date(`${widget.config.targetDate}T00:00:00`);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const diffMs = target.getTime() - today.getTime();
    const daysLeft = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    const isPast = daysLeft < 0;

    return (
      <div className="text-center py-2">
        {isPast ? (
          <p className="text-sm text-success font-medium">Målet har passerats!</p>
        ) : (
          <div>
            <p className="text-4xl font-display font-bold text-accent tracking-tight tabular-nums">
              {daysLeft}
            </p>
            <p className="text-[10px] uppercase tracking-widest text-text-muted mt-1">
              {daysLeft === 1 ? 'dag kvar' : 'dagar kvar'}
            </p>
          </div>
        )}
        <p className="text-xs text-text-muted mt-2">
          Måldatum: {widget.config.targetDate || widget.config.targetDateTime}
        </p>
      </div>
    );
  };

  const renderLinkedSavings = () => {
    if (loadingSavings) {
      return (
        <p
          className="flex items-center justify-center gap-1.5 text-xs text-text-muted py-4"
          aria-busy="true"
          aria-live="polite"
        >
          <Loader2 className="h-3.5 w-3.5 animate-spin text-accent" aria-hidden /> Läser sparmål…
        </p>
      );
    }

    const goal = savingsGoals.find((g) => g.id === widget.config.savingsGoalId);
    if (!goal) {
      return (
        <p className="text-xs text-text-muted py-2">
          Sparmålet hittades inte eller har raderats i Ekonomi.
        </p>
      );
    }

    const pct = goal.targetSek > 0 ? Math.min(100, Math.round((goal.currentSek / goal.targetSek) * 100)) : 0;

    return (
      <div className="space-y-2.5">
        <div className="flex justify-between text-xs">
          <span className="text-text-muted">{goal.title}</span>
          <span className="text-accent font-medium">{pct}%</span>
        </div>

        <div className="h-1.5 w-full rounded-full bg-surface-3 overflow-hidden border border-border">
          <div
            className="h-full rounded-full bg-accent transition-all duration-500 shadow-accent-glow"
            style={{ width: `${pct}%` }}
          />
        </div>

        <div className="flex justify-between text-[11px] text-text-muted tabular-nums">
          <span>{goal.currentSek} kr</span>
          <span>Mål: {goal.targetSek} kr</span>
        </div>
      </div>
    );
  };

  const toggleChecklistItem = async (itemId: string) => {
    if (!interactive || busy || !onUpdate) return;
    setBusy(true);
    const items = widget.config.checklistItems ?? [];
    const updated = items.map((item) =>
      item.id === itemId ? { ...item, done: !item.done } : item
    );
    try {
      await onUpdate(widget.id, { ...widget.config, checklistItems: updated });
    } finally {
      setBusy(false);
    }
  };

  const renderChecklist = () => {
    const items = widget.config.checklistItems ?? [];
    if (items.length === 0) return <p className="text-xs text-text-muted py-2">Listan är tom.</p>;

    return (
      <ul className="space-y-1.5" role="list">
        {items.map((item) => (
          <li key={item.id} className="flex items-center gap-2">
            <button
              type="button"
              disabled={!interactive || busy}
              onClick={() => void toggleChecklistItem(item.id)}
              className={[
                'widget-home-check flex shrink-0 items-center justify-center rounded-lg border text-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40',
                'min-h-[var(--ds-touch-target,2.75rem)] min-w-[var(--ds-touch-target,2.75rem)]',
                item.done
                  ? 'border-accent bg-accent/10'
                  : 'border-border-strong/60 bg-surface-3/40 hover:border-accent/40',
              ].join(' ')}
              aria-label={item.done ? `Avmarkera: ${item.text}` : `Markera klar: ${item.text}`}
            >
              {item.done && <Check className="h-3.5 w-3.5" />}
            </button>
            <span
              className={[
                'text-xs leading-snug transition-all',
                item.done ? 'text-text-muted line-through decoration-text-dim' : 'text-text-muted',
              ].join(' ')}
            >
              {item.text}
            </span>
          </li>
        ))}
      </ul>
    );
  };

  const renderQuickNote = () => {
    return (
      <p className="text-xs leading-relaxed text-text-muted whitespace-pre-wrap py-1">
        {widget.config.noteText || 'Ingen text sparad.'}
      </p>
    );
  };

  const iconMap = {
    countdown: <Clock className="h-4 w-4" strokeWidth={1.5} aria-hidden />,
    linked_savings: <PiggyBank className="h-4 w-4" strokeWidth={1.5} aria-hidden />,
    checklist: <ListTodo className="h-4 w-4" strokeWidth={1.5} aria-hidden />,
    quick_note: <FileText className="h-4 w-4" strokeWidth={1.5} aria-hidden />,
  } as const;

  const glow = widget.type === 'linked_savings' ? 'blue' : preset.glow;
  const bgPath = widget.config.backgroundPath;
  const displayTitle = (widget.title ?? 'Modul').trim() || 'Modul';
  void softActions;

  if (!widget.id) return null;

  return (
    <WidgetDashboardSection
      title={displayTitle}
      description={widget.config.caption}
      icon={iconMap[widget.type] ?? iconMap.quick_note}
      glow={glow}
      className={clsx(
        'widget-home-module group relative',
        preset.className,
        widget.config.shell && `widget-home-module--shell-${widget.config.shell}`,
        readOnly && 'widget-home-module--readonly',
      )}
    >
      {bgPath ? (
        <div
          className="widget-home-module__bg"
          aria-hidden={!widget.config.backgroundAlt}
          role={widget.config.backgroundAlt ? 'img' : undefined}
          aria-label={widget.config.backgroundAlt}
          style={{ backgroundImage: `url(${bgPath})` }}
        />
      ) : null}

      {widget.type === 'countdown' && renderCountdown()}
      {widget.type === 'linked_savings' && renderLinkedSavings()}
      {widget.type === 'checklist' && renderChecklist()}
      {widget.type === 'quick_note' && renderQuickNote()}
    </WidgetDashboardSection>
  );
}
