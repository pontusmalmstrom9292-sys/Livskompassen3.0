import { useMemo, useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Brain, ListTodo, ToggleLeft, ToggleRight } from 'lucide-react';
import { Button } from '@/design-system';
import { BentoCard } from '@/shared/ui/BentoCard';
import { HubPanelSkeleton } from '@/core/ui/HubPanelSkeleton';
import { KANBAN_COLUMNS } from '../constants';
import { usePlanningTasks } from '../hooks/usePlanningTasks';
import { useCognitiveGuard } from '../hooks/useCognitiveGuard';
import type { PlanningTask, PlanningTaskStatus } from '../types';
import { PlanningKanbanColumn } from './PlanningKanbanColumn';
import { PlanningTaskDetail } from './PlanningTaskDetail';

import { CognitiveGuardView } from './CognitiveGuardView';
import { usePlanningKanbanGate } from '../hooks/usePlanningKanbanGate';
import { PlaneringParalysEntry } from './PlaneringParalysEntry';

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

  const { isAdvancedKanban, isLoading: kanbanGateLoading } = usePlanningKanbanGate();

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

  const firstTodo = useMemo(
    () => visibleTasks.find((t) => t.status === 'todo'),
    [visibleTasks],
  );

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
    return <HubPanelSkeleton label="Laddar uppgifter…" lines={4} />;
  }

  return (
    <div className="planering-kanban-board planering-kanban-bento space-y-4">
      <div className="planering-guard-bar">
        <div className="flex items-center gap-2">
          <Brain
            className={[
              'h-4 w-4',
              isOverloaded && cognitiveGuardEnabled ? 'text-accent animate-pulse' : 'text-text-muted',
            ].join(' ')}
          />
          <span className="font-medium text-text-muted">
            {isOverloaded ? `${activeTasks.length} oavslutade uppgifter` : 'Kognitivt skydd'}
          </span>
        </div>
        <button
          type="button"
          onClick={toggleGuard}
          className="flex min-h-11 cursor-pointer items-center gap-1.5 border-0 bg-transparent text-text-muted transition-colors hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent/50"
          title={cognitiveGuardEnabled ? 'Avaktivera kognitiv avlastning' : 'Aktivera kognitiv avlastning'}
        >
          <span>Överbelastningsskydd:</span>
          {cognitiveGuardEnabled ? (
            <ToggleRight className="h-5 w-5 text-accent" />
          ) : (
            <ToggleLeft className="h-5 w-5 text-text-muted" />
          )}
        </button>
      </div>

      {projectId && (
        <p className="rounded-2xl border border-accent/25 bg-accent/5 px-4 py-2 text-xs text-text-muted">
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

      {!kanbanGateLoading && !isAdvancedKanban && (
        <p className="rounded-2xl border border-border/30 bg-surface-2/70 px-4 py-3 text-sm text-text-muted">
          Förenklad planering — ett mikrosteg i taget. Avancerad Kanban låses upp när kognitiv
          kapacitet ökar (evolution_hub).
        </p>
      )}

      {isOverloaded && cognitiveGuardEnabled && focusTask ? (
        <CognitiveGuardView
          focusTask={focusTask}
          microStepInput={microStepInput}
          busyTaskId={busyTaskId}
          setMicroStepInput={setMicroStepInput}
          handleSaveMicroStep={handleSaveMicroStep}
          handleCompleteFocusTask={handleCompleteFocusTask}
          toggleGuard={toggleGuard}
        />
      ) : (
        <BentoCard
          glow="gold"
          noHover
          bare
          className="planering-bento-card planering-bento-card--full !p-6"
        >
          <div className="planering-kanban-board__lead">
            <div className="planering-bento-icon-box planering-bento-icon-box--amber">
              <ListTodo className="h-6 w-6" aria-hidden />
            </div>
            <div className="planering-kanban-board__copy">
              <h2 className="planering-bento-title">Dagens uppgifter</h2>
              <p className="planering-bento-text">
                Prioritera det som för dig närmare dina mål.
              </p>
            </div>
          </div>

          <PlaneringParalysEntry
            defaultTaskTitle={firstTodo?.title}
            onApplyStep={
              firstTodo
                ? async (step) => {
                    await setMicroStep(firstTodo.id, step);
                  }
                : undefined
            }
          />

          <div className="planering-kanban-board__columns planering-kanban-bento__columns">
            {(isAdvancedKanban ? KANBAN_COLUMNS : KANBAN_COLUMNS.filter((c) => c.id === 'todo')).map(
              (col) => (
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

          <p className="planering-kanban-board__footer planering-bento-footer">
            {isAdvancedKanban ? 'Att göra · Väntar · Klart' : 'Att göra — förenklat läge'}
          </p>
        </BentoCard>
      )}

      {quickColumn && (
        <div className="planering-quick-add">
          <p className="text-[10px] uppercase tracking-widest text-text-muted">
            Ny uppgift · {KANBAN_COLUMNS.find((c) => c.id === quickColumn)?.label}
          </p>
          <input
            value={quickTitle}
            onChange={(e) => setQuickTitle(e.target.value)}
            placeholder="Titel…"
            className="input-glass mt-2 w-full text-sm"
            autoFocus
          />
          <label className="mt-2 block text-left text-[10px] uppercase tracking-widest text-text-muted">
            Deadline (valfritt)
            <input
              type="date"
              value={quickDueAt}
              onChange={(e) => setQuickDueAt(e.target.value)}
              className="input-glass mt-1 w-full text-sm"
            />
          </label>
          <div className="mt-2 flex gap-2">
            <Button
              variant="accent"
              size="sm"
              className="flex-1 min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
              disabled={saving || !quickTitle.trim()}
              onClick={() => void submitQuickAdd()}
            >
              Spara
            </Button>
            <Button variant="ghost" size="sm" className="min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40" onClick={() => setQuickColumn(null)}>
              Avbryt
            </Button>
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
