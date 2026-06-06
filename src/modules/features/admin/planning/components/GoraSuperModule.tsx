import { PlanningKanbanBoard } from './PlanningKanbanBoard';
import { PlaneringFokusPanel } from './PlaneringFokusPanel';
import { PlaneringFramstegPanel } from './PlaneringFramstegPanel';

export type GoraSuperVariant = 'handling' | 'fokus' | 'framsteg';

export type GoraSuperModuleProps = {
  variant: GoraSuperVariant;
};

/**
 * Canonical router för Handling / Fokus / Framsteg.
 * PlanningKanbanBoard (P3) lives under variant=handling.
 */
export function GoraSuperModule({ variant }: GoraSuperModuleProps) {
  switch (variant) {
    case 'fokus':
      return <PlaneringFokusPanel />;
    case 'framsteg':
      return <PlaneringFramstegPanel />;
    case 'handling':
    default:
      return <PlanningKanbanBoard />;
  }
}
