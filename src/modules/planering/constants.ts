import type { PlanningTaskStatus } from './types';
import type { PlaneringTab } from './types';

export const PLANERING_TAGLINE = 'Håll fokus. En sak i taget.';

export const KANBAN_COLUMNS: { id: PlanningTaskStatus; label: string }[] = [
  { id: 'todo', label: 'Att göra' },
  { id: 'waiting', label: 'Väntar' },
  { id: 'done', label: 'Klart' },
];

export const PLANERING_TABS: { id: PlaneringTab; label: string }[] = [
  { id: 'handling', label: 'Handling' },
  { id: 'fokus', label: 'Fokus' },
  { id: 'inkorg', label: 'Inkorg' },
];

export const SOURCE_LABELS: Record<string, string> = {
  email: 'Mejl',
  school: 'Skola',
  calendar: 'Kalender',
  manual: 'Manuell',
  authority: 'Myndighet',
};
