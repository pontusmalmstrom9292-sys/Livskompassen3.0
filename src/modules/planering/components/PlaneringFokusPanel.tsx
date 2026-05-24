import { usePlanningTasks } from '../hooks/usePlanningTasks';

/** Ett aktivt kort — Paralys-Brytaren. */
export function PlaneringFokusPanel() {
  const { tasks, loading } = usePlanningTasks();
  const focus =
    tasks.find((t) => t.status === 'todo' && t.microStep) ??
    tasks.find((t) => t.status === 'todo') ??
    tasks.find((t) => t.status === 'waiting');

  if (loading) return <p className="text-sm text-text-dim">Laddar…</p>;
  if (!focus) {
    return (
      <p className="rounded-xl border border-white/10 bg-surface/30 p-4 text-sm text-text-muted">
        Inga öppna uppgifter i Handling. Lägg till ett kort under fliken Handling.
      </p>
    );
  }

  return (
    <div className="elongated-module elongated-module--gold p-5 text-center">
      <p className="text-[10px] uppercase tracking-widest text-text-dim">Ditt mikrosteg nu</p>
      <p className="mt-2 font-display text-xl text-accent">
        {focus.microStep ?? focus.title}
      </p>
      {focus.microStep && (
        <p className="mt-2 text-xs text-text-muted">Uppgift: {focus.title}</p>
      )}
      {focus.dueAt && (
        <p className="mt-3 text-[10px] uppercase tracking-widest text-text-dim">
          Deadline {focus.dueAt}
        </p>
      )}
    </div>
  );
}
