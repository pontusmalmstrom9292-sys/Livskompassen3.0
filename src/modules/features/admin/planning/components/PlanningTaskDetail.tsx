import { useState } from 'react';
import { X } from 'lucide-react';
import { MICRO_STEP_PANEL_TITLE } from '@/core/copy/compassWidgetLabels';
import { KANBAN_COLUMNS } from '../constants';
import type { PlanningTask, PlanningTaskStatus } from '../types';
import { ParalysBreakerWidget } from './ParalysBreakerWidget';

type Props = {
  task: PlanningTask;
  onClose: () => void;
  onMove: (status: PlanningTaskStatus) => void;
  onSaveMicroStep: (microStep: string) => void;
};

export function PlanningTaskDetail({ task, onClose, onMove, onSaveMicroStep }: Props) {
  const [microStep, setMicroStep] = useState(task.microStep ?? '');

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-4 sm:items-center">
      <div
        className="w-full max-w-md rounded-2xl border-2 border-accent/25 bg-surface p-4 shadow-xl"
        role="dialog"
        aria-labelledby="planning-task-detail-title"
      >
        <div className="mb-3 flex items-start justify-between gap-2">
          <h2 id="planning-task-detail-title" className="font-display text-lg text-accent">
            {task.title}
          </h2>
          <button type="button" onClick={onClose} className="btn-pill--ghost p-1" aria-label="Stäng">
            <X className="h-4 w-4" />
          </button>
        </div>
        {task.summary && <p className="text-sm text-text-muted">{task.summary}</p>}
        {task.dueAt && (
          <p className="mt-2 text-xs text-text-dim">Deadline: {task.dueAt}</p>
        )}

        <label className="mt-4 block text-[10px] uppercase tracking-widest text-text-dim">
          Status
          <select
            value={task.status}
            onChange={(e) => onMove(e.target.value as PlanningTaskStatus)}
            className="input-glass mt-1 w-full rounded-xl px-3 py-2 text-sm"
            aria-label="Flytta uppgift till kolumn"
          >
            {KANBAN_COLUMNS.map((col) => (
              <option key={col.id} value={col.id}>
                {col.label}
              </option>
            ))}
          </select>
        </label>

        <label className="mt-4 block text-[10px] uppercase tracking-widest text-text-dim">
          Mikrosteg ({MICRO_STEP_PANEL_TITLE.toLowerCase()})
          <div className="mt-1 flex gap-2">
            <input
              value={microStep}
              onChange={(e) => setMicroStep(e.target.value)}
              placeholder="T.ex. Läs 2 sidor"
              className="input-glass w-full text-sm"
            />
          </div>
        </label>
        <div className="mt-1">
          <ParalysBreakerWidget taskTitle={task.title} onSelectAtom={setMicroStep} />
        </div>
        <button
          type="button"
          onClick={() => onSaveMicroStep(microStep)}
          className="btn-pill--secondary mt-3 w-full text-sm"
        >
          Spara mikrosteg
        </button>
      </div>
    </div>
  );
}
