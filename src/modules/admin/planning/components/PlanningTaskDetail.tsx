import { useState } from 'react';
import { X } from 'lucide-react';
import { KANBAN_COLUMNS } from '../constants';
import type { PlanningTask, PlanningTaskStatus } from '../types';

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

        <p className="mt-4 text-[10px] uppercase tracking-widest text-text-dim">Flytta till</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {KANBAN_COLUMNS.map((col) => (
            <button
              key={col.id}
              type="button"
              disabled={task.status === col.id}
              onClick={() => onMove(col.id)}
              className={`rounded-full px-3 py-1 text-xs ${
                task.status === col.id ? 'chip--active' : 'chip--idle'
              }`}
            >
              {col.label}
            </button>
          ))}
        </div>

        <label className="mt-4 block text-[10px] uppercase tracking-widest text-text-dim">
          Mikrosteg (Paralys-Brytaren)
          <input
            value={microStep}
            onChange={(e) => setMicroStep(e.target.value)}
            placeholder="T.ex. Läs 2 sidor"
            className="input-glass mt-1 w-full text-sm"
          />
        </label>
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
