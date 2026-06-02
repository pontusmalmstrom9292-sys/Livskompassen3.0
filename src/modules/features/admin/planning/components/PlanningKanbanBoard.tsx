import { useMemo, useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Brain, ToggleLeft, ToggleRight, Check, Loader2 } from 'lucide-react';
import { KANBAN_COLUMNS } from '../constants';
import { usePlanningTasks } from '../hooks/usePlanningTasks';
import { useCognitiveGuard } from '../hooks/useCognitiveGuard';
import type { PlanningTask, PlanningTaskStatus } from '../types';
import { PlanningKanbanColumn } from './PlanningKanbanColumn';
import { PlanningTaskDetail } from './PlanningTaskDetail';
import { BentoCard } from '@/shared/ui/BentoCard';

export function PlanningKanbanBoard() {
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('projectId')?.trim() || undefined;

  const { user, tasks, loading, error, setError, addTask, moveTask, setMicroStep } =
    usePlanningTasks();

  const visibleTasks = useMemo(
    () => (projectId ? tasks.filter((t) => t.projectId === projectId) : tasks),
    [tasks, projectId],
  );

  const {
    cognitiveGuardEnabled,
    toggleGuard,
    activeTasks,
    focusTask,
    isOverloaded,
  } = useCognitiveGuard(visibleTasks);

  const [selected, setSelected] = useState<PlanningTask | null>(null);
  const [quickTitle, setQuickTitle] = useState('');
  const [quickDueAt, setQuickDueAt] = useState('');
  const [quickColumn, setQuickColumn] = useState<PlanningTaskStatus | null>(null);
  const [saving, setSaving] = useState(false);
  const [microStepInput, setMicroStepInput] = useState('');
  const [busyTaskId, setBusyTaskId] = useState<string | null>(null);

  useEffect(() => {
    if (focusTask) {
      setMicroStepInput(focusTask.microStep ?? '');
    }
  }, [focusTask]);

  const tasksByStatus = (status: PlanningTaskStatus) =>
    visibleTasks.filter((t) => t.status === status);

  const openQuickAdd = (status: PlanningTaskStatus) => {
    setQuickColumn(status);
    setQuickTitle('');
    setQuickDueAt('');
  };

  const submitQuickAdd = async () => {
    if (!quickColumn || !quickTitle.trim()) return;
    setSaving(true);
    setError(null);
    try {
      await addTask({
        title: quickTitle.trim(),
        status: quickColumn,
        projectId,
        dueAt: quickDueAt.trim() || undefined,
      });
      setQuickColumn(null);
      setQuickTitle('');
      setQuickDueAt('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kunde inte spara uppgift.');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveMicroStep = async (taskId: string) => {
    setBusyTaskId(taskId);
    try {
      await setMicroStep(taskId, microStepInput.trim());
    } finally {
      setBusyTaskId(null);
    }
  };

  const handleCompleteFocusTask = async (taskId: string) => {
    setBusyTaskId(taskId);
    try {
      await moveTask(taskId, 'done');
    } finally {
      setBusyTaskId(null);
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
      <div className="flex items-center justify-between rounded-xl border border-border bg-surface-2 px-3 py-2 text-xs">
        <div className="flex items-center gap-2">
          <Brain
            className={[
              'h-4 w-4',
              isOverloaded && cognitiveGuardEnabled ? 'text-accent animate-pulse' : 'text-text-dim',
            ].join(' ')}
          />
          <span className="font-medium text-text-muted">
            {isOverloaded ? `${activeTasks.length} oavslutade uppgifter` : 'Kognitivt skydd'}
          </span>
        </div>
        <button
          type="button"
          onClick={toggleGuard}
          className="flex items-center gap-1.5 text-text-dim hover:text-accent bg-transparent border-0 cursor-pointer"
          title={cognitiveGuardEnabled ? 'Avaktivera kognitiv avlastning' : 'Aktivera kognitiv avlastning'}
        >
          <span>Överbelastningsskydd:</span>
          {cognitiveGuardEnabled ? (
            <ToggleRight className="h-5 w-5 text-accent" />
          ) : (
            <ToggleLeft className="h-5 w-5 text-text-dim" />
          )}
        </button>
      </div>

      {projectId && (
        <p className="rounded-xl border border-accent/25 bg-accent/5 px-3 py-2 text-xs text-text-muted">
          Visar uppgifter för projekt.{' '}
          <Link to={`/admin/projects/${projectId}`} className="text-accent">
            Öppna projekt
          </Link>
          {' · '}
          <Link to="/planering" className="text-accent">
            Visa alla
          </Link>
        </p>
      )}

      {error && <p className="text-sm text-danger">{error}</p>}

      {isOverloaded && cognitiveGuardEnabled && focusTask ? (
        <div className="space-y-4 animate-fade-in">
          <BentoCard
            title="Kognitivt skydd aktivt (Pansarläget)"
            description="Överbelastningsskydd · Ett steg i taget"
            icon={<Brain className="h-4 w-4 text-accent" />}
            className="border-accent/30 shadow-accent-glow"
          >
            <p className="text-xs text-text-dim leading-relaxed mb-4">
              Du har många oavslutade uppgifter just nu. För att förhindra stressparalys har vi tillfälligt gömt
              dina andra kolumner. Gör klart denna enda sak först för att bygga positivt momentum.
            </p>

            <div className="rounded-xl border border-border bg-surface-3/30 p-4 space-y-3">
              <span className="text-[10px] uppercase tracking-widest text-accent">Primärt fokus</span>
              <h3 className="text-base font-semibold text-text leading-snug">{focusTask.title}</h3>
              {focusTask.summary && <p className="text-xs text-text-muted">{focusTask.summary}</p>}
              {focusTask.dueAt && (
                <p className="text-[10px] uppercase tracking-widest text-danger">
                  Deadline: {focusTask.dueAt}
                </p>
              )}
            </div>

            <div className="mt-4 space-y-3 border-t border-border pt-4">
              <label className="block text-xs text-text-muted">
                Ditt nästa mikrosteg (Paralys-Brytaren)
                <span className="block text-[10px] text-text-dim mt-0.5">
                  Bryt ner uppgiften till minsta möjliga handling för att komma igång.
                </span>
                <div className="flex gap-2 mt-2">
                  <input
                    value={microStepInput}
                    onChange={(e) => setMicroStepInput(e.target.value)}
                    placeholder="T.ex. Öppna webbläsaren, Skriv rubriken..."
                    className="input-glass text-xs py-2 flex-1"
                    disabled={busyTaskId === focusTask.id}
                  />
                  <button
                    type="button"
                    onClick={() => void handleSaveMicroStep(focusTask.id)}
                    disabled={busyTaskId === focusTask.id}
                    className="btn-pill--secondary text-xs shrink-0"
                  >
                    {busyTaskId === focusTask.id ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      'Spara'
                    )}
                  </button>
                </div>
              </label>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => void handleCompleteFocusTask(focusTask.id)}
                  disabled={busyTaskId === focusTask.id}
                  className="btn-pill--success flex-1 text-xs justify-center"
                >
                  {busyTaskId === focusTask.id ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Check className="h-3.5 w-3.5" />
                  )}
                  Markera klar
                </button>
                <button
                  type="button"
                  onClick={toggleGuard}
                  className="btn-pill--ghost text-xs flex-1 justify-center"
                >
                  Visa hela tavlan ändå
                </button>
              </div>
            </div>
          </BentoCard>
        </div>
      ) : (
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
      )}

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
          <label className="mt-2 block text-left text-[10px] uppercase tracking-widest text-text-dim">
            Deadline (valfritt)
            <input
              type="date"
              value={quickDueAt}
              onChange={(e) => setQuickDueAt(e.target.value)}
              className="input-glass mt-1 w-full text-sm"
            />
          </label>
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
