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
    <section className="planering-kanban-column">
      <div className="planering-kanban-column__header">
        <p className="planering-kanban-column__label">{label}</p>
        <span className="planering-kanban-column__count">{tasks.length}</span>
      </div>
      <div className="flex flex-col gap-2">
        {tasks.map((task) => (
          <PlanningTaskCard key={task.id} task={task} onSelect={onSelectTask} />
        ))}
      </div>
      <button
        type="button"
        onClick={() => onAdd(status)}
        className="planering-task-card__add"
      >
        <Plus className="h-3 w-3" />
        Lägg till
      </button>
    </section>
  );
}
