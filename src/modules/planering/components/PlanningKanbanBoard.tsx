import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { KANBAN_COLUMNS } from '../constants';
import { usePlanningTasks } from '../hooks/usePlanningTasks';
import type { PlanningTask, PlanningTaskStatus } from '../types';
import { PlanningKanbanColumn } from './PlanningKanbanColumn';
import { PlanningTaskDetail } from './PlanningTaskDetail';

export function PlanningKanbanBoard() {
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('projectId')?.trim() || undefined;
  const { user, tasks, loading, error, setError, addTask, moveTask, setMicroStep } =
    usePlanningTasks();
  const visibleTasks = useMemo(
    () => (projectId ? tasks.filter((t) => t.projectId === projectId) : tasks),
    [tasks, projectId],
  );
  const [selected, setSelected] = useState<PlanningTask | null>(null);
  const [quickTitle, setQuickTitle] = useState('');
  const [quickColumn, setQuickColumn] = useState<PlanningTaskStatus | null>(null);
  const [saving, setSaving] = useState(false);

  const tasksByStatus = (status: PlanningTaskStatus) =>
    visibleTasks.filter((t) => t.status === status);

  const openQuickAdd = (status: PlanningTaskStatus) => {
    setQuickColumn(status);
    setQuickTitle('');
  };

  const submitQuickAdd = async () => {
    if (!quickColumn || !quickTitle.trim()) return;
    setSaving(true);
    setError(null);
    try {
      await addTask({ title: quickTitle.trim(), status: quickColumn, projectId });
      setQuickColumn(null);
      setQuickTitle('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kunde inte spara uppgift.');
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return <p className="text-sm text-text-muted">Logga in för att spara uppgifter i Planering.</p>;
  }

  if (loading) {
    return <p className="text-sm text-text-dim">Laddar uppgifter…</p>;
  }

  return (
    <div className="space-y-4">
      {projectId && (
        <p className="rounded-xl border border-accent/25 bg-accent/5 px-3 py-2 text-xs text-text-muted">
          Visar uppgifter för projekt.{' '}
          <Link to={`/projekt/${projectId}`} className="text-accent">
            Öppna projekt
          </Link>
          {' · '}
          <Link to="/planering" className="text-accent">
            Visa alla
          </Link>
        </p>
      )}
      {error && <p className="text-sm text-danger">{error}</p>}

      <div className="-mx-1 flex gap-3 overflow-x-auto pb-2">
        {KANBAN_COLUMNS.map((col) => (
          <PlanningKanbanColumn
            key={col.id}
            label={col.label}
            status={col.id}
            tasks={tasksByStatus(col.id)}
            onAdd={openQuickAdd}
            onSelectTask={setSelected}
          />
        ))}
      </div>

      {quickColumn && (
        <div className="rounded-xl border-2 border-accent/30 bg-surface/50 p-3">
          <p className="text-[10px] uppercase tracking-widest text-text-dim">
            Ny uppgift · {KANBAN_COLUMNS.find((c) => c.id === quickColumn)?.label}
          </p>
          <input
            value={quickTitle}
            onChange={(e) => setQuickTitle(e.target.value)}
            placeholder="Titel…"
            className="input-glass mt-2 w-full text-sm"
            autoFocus
          />
          <div className="mt-2 flex gap-2">
            <button
              type="button"
              disabled={saving || !quickTitle.trim()}
              onClick={() => void submitQuickAdd()}
              className="btn-pill--accent flex-1 text-xs"
            >
              Spara
            </button>
            <button
              type="button"
              onClick={() => setQuickColumn(null)}
              className="btn-pill--ghost text-xs"
            >
              Avbryt
            </button>
          </div>
        </div>
      )}

      {selected && (
        <PlanningTaskDetail
          task={selected}
          onClose={() => setSelected(null)}
          onMove={async (status) => {
            await moveTask(selected.id, status);
            setSelected({ ...selected, status });
          }}
          onSaveMicroStep={async (step) => {
            await setMicroStep(selected.id, step);
            setSelected({ ...selected, microStep: step });
          }}
        />
      )}
    </div>
  );
}
