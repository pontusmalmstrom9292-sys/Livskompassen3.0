import { Building2, Calendar, Mail, School } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { SOURCE_LABELS } from '../constants';
import type { PlanningTask, PlanningTaskSource } from '../types';

const SOURCE_ICONS: Record<PlanningTaskSource, LucideIcon> = {
  email: Mail,
  school: School,
  calendar: Calendar,
  manual: Building2,
  authority: Building2,
};

type Props = {
  task: PlanningTask;
  onSelect: (task: PlanningTask) => void;
};

export function PlanningTaskCard({ task, onSelect }: Props) {
  const Icon = SOURCE_ICONS[task.source] ?? Building2;

  return (
    <button
      type="button"
      onClick={() => onSelect(task)}
      className="w-full rounded-xl border-2 border-accent/20 bg-surface/40 p-3 text-left transition hover:border-accent/35"
    >
      <div className="flex items-start gap-2">
        <Icon className="mt-0.5 h-4 w-4 shrink-0 text-accent/80" aria-hidden />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-text">{task.title}</p>
          {task.microStep && (
            <p className="mt-1 text-xs text-accent/90 line-clamp-1">→ {task.microStep}</p>
          )}
          {task.summary && (
            <p className="mt-1 line-clamp-2 text-xs text-text-muted">{task.summary}</p>
          )}
          <div className="mt-2 flex flex-wrap gap-2 text-[10px] uppercase tracking-widest text-text-dim">
            <span>{SOURCE_LABELS[task.source] ?? task.source}</span>
            {task.dueAt && <span>{task.dueAt}</span>}
            {task.microStep && <span className="text-accent/80">Mikrosteg</span>}
            {task.projectId && <span className="text-accent/80">Projekt</span>}
          </div>
        </div>
      </div>
    </button>
  );
}
