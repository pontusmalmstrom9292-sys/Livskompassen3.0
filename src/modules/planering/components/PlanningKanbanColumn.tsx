import { Plus } from 'lucide-react';
import type { PlanningTask, PlanningTaskStatus } from '../types';
import { PlanningTaskCard } from './PlanningTaskCard';

type Props = {
  label: string;
  status: PlanningTaskStatus;
  tasks: PlanningTask[];
  onAdd: (status: PlanningTaskStatus) => void;
  onSelectTask: (task: PlanningTask) => void;
};

export function PlanningKanbanColumn({ label, status, tasks, onAdd, onSelectTask }: Props) {
  return (
    <section className="flex min-w-[10.5rem] flex-1 flex-col gap-2">
      <div className="flex items-center justify-between gap-2 px-0.5">
        <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-accent">{label}</p>
        <span className="rounded-full border border-accent/25 px-2 py-0.5 text-[10px] text-text-dim">
          {tasks.length}
        </span>
      </div>
      <div className="flex flex-col gap-2">
        {tasks.map((task) => (
          <PlanningTaskCard key={task.id} task={task} onSelect={onSelectTask} />
        ))}
      </div>
      <button
        type="button"
        onClick={() => onAdd(status)}
        className="flex items-center justify-center gap-1 rounded-xl border border-dashed border-accent/30 py-2 text-xs text-text-dim hover:border-accent/50 hover:text-accent"
      >
        <Plus className="h-3 w-3" />
        Lägg till
      </button>
    </section>
  );
}
