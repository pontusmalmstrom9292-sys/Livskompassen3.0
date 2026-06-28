import { useState } from 'react';
import { X } from 'lucide-react';
import { Modal, Button } from '@/design-system';
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
    <Modal
      open
      onClose={onClose}
      title={task.title}
      ariaLabel={task.title}
      panelClassName="max-w-md border-accent/25"
      headerAction={
        <button type="button" onClick={onClose} className="ds-btn ds-btn--ghost p-1" aria-label="Stäng">
          <X className="h-4 w-4" />
        </button>
      }
      hideHeader={false}
    >
      {task.summary && <p className="text-sm text-text-muted">{task.summary}</p>}
      {task.dueAt && <p className="mt-2 text-xs text-text-dim">Deadline: {task.dueAt}</p>}

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
      <ParalysBreakerWidget
        taskTitle={task.title}
        onSelectAtom={(atom) => {
          setMicroStep(atom);
        }}
      />
      <Button type="button" variant="secondary" className="mt-3 w-full" onClick={() => onSaveMicroStep(microStep)}>
        Spara mikrosteg
      </Button>
    </Modal>
  );
}
