import { useMemo } from 'react';
import { usePlanningTasks } from '../hooks/usePlanningTasks';
import { countPlanningStats } from '../utils/planningDueDate';

export function PlaneringFramstegPanel() {
  const { tasks, loading } = usePlanningTasks();
  const stats = useMemo(() => countPlanningStats(tasks), [tasks]);

  if (loading) {
    return <p className="text-sm text-text-dim">Laddar…</p>;
  }

  const rows = [
    { label: 'Att göra', value: stats.todo },
    { label: 'Väntar', value: stats.waiting },
    { label: 'Klart', value: stats.done },
    { label: 'Försenade', value: stats.overdue, warn: stats.overdue > 0 },
  ] as const;

  return (
    <div className="elongated-module elongated-module--gold p-5">
      <p className="text-center text-sm text-text-muted">
        En överblick — inga poäng, bara läget just nu.
      </p>
      <ul className="mt-4 grid grid-cols-2 gap-3">
        {rows.map((row) => (
          <li
            key={row.label}
            className="rounded-xl border border-accent/20 bg-surface/40 px-3 py-3 text-center"
          >
            <p className="text-[10px] uppercase tracking-widest text-text-dim">{row.label}</p>
            <p
              className={`mt-1 font-display text-2xl ${
                'warn' in row && row.warn ? 'text-danger' : 'text-accent'
              }`}
            >
              {row.value}
            </p>
          </li>
        ))}
      </ul>
      {stats.overdue > 0 && (
        <p className="mt-4 text-center text-xs text-text-muted">
          Försenade = deadline passerad och inte markerade klara.
        </p>
      )}
    </div>
  );
}
