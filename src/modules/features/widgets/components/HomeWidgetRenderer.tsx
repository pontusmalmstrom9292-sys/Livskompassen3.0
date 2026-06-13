import { useEffect, useState } from 'react';
import { Clock, PiggyBank, ListTodo, FileText, Check, Trash2, Loader2 } from 'lucide-react';
import { BentoCard } from '@/shared/ui/BentoCard';
import { getBudgetSavings } from '@/core/firebase/economyFirestore';
import type { BudgetSavingsRow } from '@/core/types/firestore';

export type WidgetType = 'countdown' | 'checklist' | 'linked_savings' | 'quick_note';

export interface UserWidget {
  id: string;
  type: WidgetType;
  title: string;
  config: {
    targetDate?: string;
    savingsGoalId?: string;
    checklistItems?: { id: string; text: string; done: boolean }[];
    noteText?: string;
  };
}

type Props = {
  widget: UserWidget;
  userId: string;
  onUpdate: (widgetId: string, updatedConfig: UserWidget['config']) => Promise<void>;
  onDelete: (widgetId: string) => Promise<void>;
};

export function HomeWidgetRenderer({ widget, userId, onUpdate, onDelete }: Props) {
  const [savingsGoals, setSavingsGoals] = useState<BudgetSavingsRow[]>([]);
  const [loadingSavings, setLoadingSavings] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (widget.type !== 'linked_savings' || !userId) return;
    setLoadingSavings(true);
    getBudgetSavings(userId)
      .then(setSavingsGoals)
      .catch(() => setSavingsGoals([]))
      .finally(() => setLoadingSavings(false));
  }, [widget.type, userId]);

  const renderCountdown = () => {
    if (!widget.config.targetDate) return <p className="text-xs text-text-dim">Inget datum satt.</p>;

    const target = new Date(`${widget.config.targetDate}T00:00:00`);
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
            <p className="text-[10px] uppercase tracking-widest text-text-dim mt-1">
              {daysLeft === 1 ? 'dag kvar' : 'dagar kvar'}
            </p>
          </div>
        )}
        <p className="text-xs text-text-muted mt-2">Måldatum: {widget.config.targetDate}</p>
      </div>
    );
  };

  const renderLinkedSavings = () => {
    if (loadingSavings) {
      return (
        <p className="flex items-center justify-center gap-1.5 text-xs text-text-dim py-4">
          <Loader2 className="h-3.5 w-3.5 animate-spin text-accent" /> Läser sparmål…
        </p>
      );
    }

    const goal = savingsGoals.find((g) => g.id === widget.config.savingsGoalId);
    if (!goal) {
      return (
        <p className="text-xs text-text-dim py-2">
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

        <div className="flex justify-between text-[11px] text-text-dim tabular-nums">
          <span>{goal.currentSek} kr</span>
          <span>Mål: {goal.targetSek} kr</span>
        </div>
      </div>
    );
  };

  const toggleChecklistItem = async (itemId: string) => {
    if (busy) return;
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
    if (items.length === 0) return <p className="text-xs text-text-dim py-2">Listan är tom.</p>;

    return (
      <ul className="space-y-1.5" role="list">
        {items.map((item) => (
          <li key={item.id} className="flex items-center gap-2">
            <button
              type="button"
              disabled={busy}
              onClick={() => void toggleChecklistItem(item.id)}
              className={[
                'flex h-6 w-6 shrink-0 items-center justify-center rounded-md border text-accent transition-colors',
                item.done ? 'border-accent bg-accent/10' : 'border-border-strong/60 bg-surface-3/40 hover:border-accent/40'
              ].join(' ')}
              aria-label={item.done ? `Avmarkera: ${item.text}` : `Markera klar: ${item.text}`}
            >
              {item.done && <Check className="h-3.5 w-3.5" />}
            </button>
            <span className={[
              'text-xs leading-none transition-all',
              item.done ? 'text-text-dim line-through decoration-text-dim' : 'text-text-muted'
            ].join(' ')}>
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
    countdown: <Clock className="h-4 w-4" />,
    linked_savings: <PiggyBank className="h-4 w-4" />,
    checklist: <ListTodo className="h-4 w-4" />,
    quick_note: <FileText className="h-4 w-4" />,
  };

  return (
    <BentoCard
      title={widget.title}
      icon={iconMap[widget.type]}
      glow="gold"
      className="group relative rounded-2xl border border-border/30 transition-all hover:border-accent/30"
    >
      <button
        type="button"
        disabled={busy}
        onClick={() => void onDelete(widget.id)}
        className="absolute right-3.5 top-3.5 opacity-0 group-hover:opacity-100 text-text-dim hover:text-danger bg-transparent border-0 cursor-pointer transition-opacity duration-150 p-1"
        aria-label={`Ta bort modulen ${widget.title}`}
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>

      <div className="mt-1">
        {widget.type === 'countdown' && renderCountdown()}
        {widget.type === 'linked_savings' && renderLinkedSavings()}
        {widget.type === 'checklist' && renderChecklist()}
        {widget.type === 'quick_note' && renderQuickNote()}
      </div>
    </BentoCard>
  );
}
