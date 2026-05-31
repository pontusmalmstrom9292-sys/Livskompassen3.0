import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ParalysPanel } from '../../../wellbeing/compasses/components/ParalysPanel';
import { usePlanningTasks } from '../hooks/usePlanningTasks';
import type { PlanningTaskStatus } from '../types';

export function PlaneringFokusPanel() {
  const [showParalys, setShowParalys] = useState(false);
  const { tasks, loading, moveTask } = usePlanningTasks();
  const focus =
    tasks.find((t) => t.status === 'todo' && t.microStep) ??
    tasks.find((t) => t.status === 'todo') ??
    tasks.find((t) => t.status === 'waiting');

  const handleMove = async (status: PlanningTaskStatus) => {
    if (!focus) return;
    await moveTask(focus.id, status);
  };

  if (loading) return <p className="text-sm text-text-dim">Laddar…</p>;
  if (!focus) {
    return (
      <p className="rounded-xl border border-white/10 bg-surface/30 p-4 text-sm text-text-muted">
        Inga öppna uppgifter i Handling. Lägg till ett kort under fliken Handling.
      </p>
    );
  }

  return (
    <div className="elongated-module elongated-module--gold space-y-4 p-5 text-center">
      <p className="text-[10px] uppercase tracking-widest text-text-dim">Ditt mikrosteg nu</p>
      <p className="font-display text-xl text-accent">{focus.microStep ?? focus.title}</p>
      {focus.microStep && <p className="text-xs text-text-muted">Uppgift: {focus.title}</p>}
      {focus.dueAt && (
        <p className="text-[10px] uppercase tracking-widest text-text-dim">Deadline {focus.dueAt}</p>
      )}

      <div className="flex flex-wrap justify-center gap-2 pt-2">
        {focus.status === 'todo' && (
          <button
            type="button"
            className="btn-pill--secondary text-xs"
            onClick={() => void handleMove('waiting')}
          >
            Markera väntar
          </button>
        )}
        {focus.status !== 'done' && (
          <button
            type="button"
            className="btn-pill--accent text-xs"
            onClick={() => void handleMove('done')}
          >
            Klar
          </button>
        )}
      </div>

      <Link to="/planering?tab=handling" className="btn-pill--ghost inline-flex text-xs">
        Redigera i Handling
      </Link>

      {!focus.microStep && (
        <div className="pt-4 border-t border-white/10 text-left">
          <button
            type="button"
            className="btn-pill--ghost text-xs"
            onClick={() => setShowParalys((o) => !o)}
          >
            {showParalys ? 'Dölj Paralys-Brytaren' : 'Behöver du ett mikrosteg?'}
          </button>
          {showParalys && (
            <div className="mt-3">
              <ParalysPanel onDone={() => setShowParalys(false)} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
