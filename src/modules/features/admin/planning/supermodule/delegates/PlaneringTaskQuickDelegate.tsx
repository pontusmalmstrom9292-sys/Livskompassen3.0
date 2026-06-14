import { useState, type FormEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { usePlanningTasks } from '../../hooks/usePlanningTasks';
import type { PlanningTaskStatus } from '../../types';

export type PlaneringTaskQuickDelegateProps = {
  onSaved?: () => void;
};

const STATUS_OPTIONS: { value: PlanningTaskStatus; label: string }[] = [
  { value: 'todo', label: 'Att göra' },
  { value: 'waiting', label: 'Väntar' },
];

/**
 * Fas 9C — snabb uppgift utan Kanban-kolumner.
 * Speglar quick-add i PlanningKanbanBoard via samma usePlanningTasks-hook.
 */
export function PlaneringTaskQuickDelegate({ onSaved }: PlaneringTaskQuickDelegateProps) {
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('projectId') ?? undefined;
  const { user, addTask, error, setError } = usePlanningTasks();
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState<PlanningTaskStatus>('todo');
  const [dueAt, setDueAt] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  if (!user) {
    return (
      <p className="text-sm text-text-muted p-4 text-center">
        Logga in för att spara uppgifter i Planering.
      </p>
    );
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;

    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      await addTask({
        title: trimmed,
        status,
        projectId,
        dueAt: dueAt.trim() || undefined,
        source: 'manual',
      });
      setTitle('');
      setDueAt('');
      setSaved(true);
      onSaved?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kunde inte spara uppgift.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <header className="space-y-1">
        <p className="font-display-serif text-xs uppercase tracking-[0.2em] text-accent">
          Snabb uppgift
        </p>
        <p className="text-xs text-text-dim">
          Ett steg i taget — sparas direkt i din planeringslista.
          {projectId ? ' Kopplad till aktivt projekt.' : ''}
        </p>
      </header>

      <label className="block space-y-1">
        <span className="text-xs uppercase tracking-wider text-text-dim">Titel</span>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Vad behöver göras?"
          className="w-full rounded-xl border border-border bg-surface-2 px-3 py-2 text-sm text-text placeholder:text-text-dim focus:border-accent/40 focus:outline-none"
          autoComplete="off"
        />
      </label>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block space-y-1">
          <span className="text-xs uppercase tracking-wider text-text-dim">Kolumn</span>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as PlanningTaskStatus)}
            className="w-full rounded-xl border border-border bg-surface-2 px-3 py-2 text-sm text-text focus:border-accent/40 focus:outline-none"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>

        <label className="block space-y-1">
          <span className="text-xs uppercase tracking-wider text-text-dim">Förfaller (valfritt)</span>
          <input
            type="date"
            value={dueAt}
            onChange={(e) => setDueAt(e.target.value)}
            className="w-full rounded-xl border border-border bg-surface-2 px-3 py-2 text-sm text-text focus:border-accent/40 focus:outline-none"
          />
        </label>
      </div>

      {error && (
        <p className="text-xs text-red-400" role="alert">
          {error}
        </p>
      )}

      {saved && (
        <p className="text-xs text-success" role="status">
          Uppgift sparad.
        </p>
      )}

      <button
        type="submit"
        disabled={saving || !title.trim()}
        className="inline-flex items-center gap-2 rounded-xl border border-accent/40 bg-surface-3 px-4 py-2 text-xs font-medium text-accent transition-colors hover:border-accent/60 disabled:opacity-50"
      >
        {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
        Spara uppgift
      </button>
    </form>
  );
}
