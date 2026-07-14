/** @locked MOD-WIDGET — låst modul; unlock via docs/evaluations/*-unlock-MOD-WIDGET.md */
import { useEffect, useState } from 'react';
import { Clock, ListTodo, PiggyBank, FileText, Loader2 } from 'lucide-react';
import { Input, TextArea } from '@/design-system';
import { getBudgetSavings } from '@/core/firebase/economyFirestore';
import type { BudgetSavingsRow, UserWidget } from '@/core/types/firestore';
import { WidgetButton } from './WidgetButton';

type WidgetType = UserWidget['type'];

const TYPE_OPTIONS: {
  id: WidgetType;
  label: string;
  icon: typeof Clock;
}[] = [
  { id: 'countdown', label: 'Nedräkning', icon: Clock },
  { id: 'checklist', label: 'Checklista', icon: ListTodo },
  { id: 'linked_savings', label: 'Sparmål', icon: PiggyBank },
  { id: 'quick_note', label: 'Snabbnotis', icon: FileText },
];

type Props = {
  userId: string;
  nextOrder: number;
  onSave: (widget: Omit<UserWidget, 'userId' | 'ownerId' | 'createdAt'>) => Promise<void>;
  onCancel: () => void;
};

function defaultChecklistItems() {
  return [
    { id: `item-${Date.now()}-1`, text: 'Steg ett', done: false },
    { id: `item-${Date.now()}-2`, text: 'Steg två', done: false },
    { id: `item-${Date.now()}-3`, text: 'Steg tre', done: false },
  ];
}

export function WidgetModulerAddForm({ userId, nextOrder, onSave, onCancel }: Props) {
  const [type, setType] = useState<WidgetType>('countdown');
  const [title, setTitle] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [noteText, setNoteText] = useState('');
  const [savingsGoalId, setSavingsGoalId] = useState('');
  const [savingsGoals, setSavingsGoals] = useState<BudgetSavingsRow[]>([]);
  const [loadingGoals, setLoadingGoals] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (type !== 'linked_savings') return;
    setLoadingGoals(true);
    getBudgetSavings(userId)
      .then((rows) => {
        setSavingsGoals(rows);
        setSavingsGoalId((prev) => prev || rows[0]?.id || '');
      })
      .catch(() => setSavingsGoals([]))
      .finally(() => setLoadingGoals(false));
  }, [type, userId]);

  const handleSubmit = async () => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setError('Ge modulen ett namn.');
      return;
    }

    let config: UserWidget['config'] = {};
    if (type === 'countdown') {
      if (!targetDate) {
        setError('Välj ett måldatum.');
        return;
      }
      config = { targetDate };
    } else if (type === 'checklist') {
      config = { checklistItems: defaultChecklistItems() };
    } else if (type === 'linked_savings') {
      if (!savingsGoalId) {
        setError('Välj ett sparmål i Ekonomi först.');
        return;
      }
      config = { savingsGoalId };
    } else {
      config = { noteText: noteText.trim() || '—' };
    }

    setBusy(true);
    setError(null);
    try {
      await onSave({
        type,
        title: trimmedTitle,
        pinnedToHome: false,
        order: nextOrder,
        config,
      });
      onCancel();
    } catch {
      setError('Kunde inte spara modulen. Försök igen.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="widget-moduler-add space-y-4" aria-label="Lägg till modul">
      <div className="widget-moduler-add__types" role="group" aria-label="Modultyp">
        {TYPE_OPTIONS.map((opt) => {
          const Icon = opt.icon;
          const active = type === opt.id;
          return (
            <WidgetButton
              key={opt.id}
              type="button"
              variant={active ? 'accent' : 'secondary'}
              className="widget-moduler-add__type"
              onClick={() => {
                setType(opt.id);
                setError(null);
              }}
            >
              <Icon className="h-3.5 w-3.5 shrink-0" strokeWidth={1.5} aria-hidden />
              {opt.label}
            </WidgetButton>
          );
        })}
      </div>

      <label className="block space-y-1.5">
        <span className="text-[11px] uppercase tracking-widest text-text-dim">Namn</span>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="t.ex. Semester, Veckolista…"
          maxLength={100}
        />
      </label>

      {type === 'countdown' ? (
        <label className="block space-y-1.5">
          <span className="text-[11px] uppercase tracking-widest text-text-dim">Måldatum</span>
          <Input type="date" value={targetDate} onChange={(e) => setTargetDate(e.target.value)} />
        </label>
      ) : null}

      {type === 'linked_savings' ? (
        <label className="block space-y-1.5">
          <span className="text-[11px] uppercase tracking-widest text-text-dim">Sparmål</span>
          {loadingGoals ? (
            <p className="flex items-center gap-1.5 text-xs text-text-dim">
              <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden /> Läser sparmål…
            </p>
          ) : savingsGoals.length === 0 ? (
            <p className="text-xs text-text-dim">Inga sparmål i Ekonomi ännu.</p>
          ) : (
            <select
              className="widget-moduler-add__select"
              value={savingsGoalId}
              onChange={(e) => setSavingsGoalId(e.target.value)}
            >
              {savingsGoals.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.title}
                </option>
              ))}
            </select>
          )}
        </label>
      ) : null}

      {type === 'quick_note' ? (
        <label className="block space-y-1.5">
          <span className="text-[11px] uppercase tracking-widest text-text-dim">Text</span>
          <TextArea
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder="Kort påminnelse eller citat…"
            rows={3}
          />
        </label>
      ) : null}

      {error ? <p className="text-xs text-danger">{error}</p> : null}

      <div className="flex flex-col gap-2 sm:flex-row">
        <WidgetButton type="button" variant="accent" fullWidth disabled={busy} onClick={() => void handleSubmit()}>
          {busy ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden /> Sparar…
            </>
          ) : (
            'Lägg till'
          )}
        </WidgetButton>
        <WidgetButton type="button" variant="ghost" fullWidth disabled={busy} onClick={onCancel}>
          Avbryt
        </WidgetButton>
      </div>
    </div>
  );
}
