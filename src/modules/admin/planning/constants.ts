import type { PlanningTaskStatus } from './types';
import type { PlaneringTab } from './types';

export const PLANERING_TAGLINE = 'Ett verktyg i taget.';

export const KANBAN_COLUMNS: { id: PlanningTaskStatus; label: string }[] = [
  { id: 'todo', label: 'Att göra' },
  { id: 'waiting', label: 'Väntar' },
  { id: 'done', label: 'Klart' },
];

/** Flikar inom arbetsläge (inte på hub). */
export const PLANERING_WORK_TABS: {
  id: Extract<PlaneringTab, 'handling' | 'fokus' | 'framsteg' | 'inkorg'>;
  label: string;
}[] = [
  { id: 'handling', label: 'Handling' },
  { id: 'fokus', label: 'Fokus' },
  { id: 'framsteg', label: 'Framsteg' },
  { id: 'inkorg', label: 'Inkorg' },
];

export const SOURCE_LABELS: Record<string, string> = {
  email: 'Mejl',
  school: 'Skola',
  calendar: 'Kalender',
  manual: 'Manuell',
  authority: 'Myndighet',
};
