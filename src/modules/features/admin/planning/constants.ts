import type { PlanningTaskStatus } from './types';
import type { PlaneringTab } from './types';

export const PLANERING_TAGLINE = 'Ett verktyg i taget.';

export const KANBAN_COLUMNS: { id: PlanningTaskStatus; label: string }[] = [
  { id: 'todo', label: 'Att göra' },
  { id: 'waiting', label: 'Väntar' },
  { id: 'done', label: 'Klart' },
];

/** Fler verktyg — Handling/Inkorg styrs av GoraHubTabBar (ingen dubbel TabBar). */
export const PLANERING_MORE_TABS: {
  id: Extract<PlaneringTab, 'fokus' | 'framsteg' | 'regler'>;
  label: string;
}[] = [
  { id: 'fokus', label: 'Fokus' },
  { id: 'framsteg', label: 'Framsteg' },
  { id: 'regler', label: 'Regler' },
];

/** @deprecated Använd PLANERING_MORE_TABS — behålls för smoke/import-kompat. */
export const PLANERING_WORK_TABS = PLANERING_MORE_TABS;

export const SOURCE_LABELS: Record<string, string> = {
  email: 'Mejl',
  school: 'Skola',
  calendar: 'Kalender',
  manual: 'Manuell',
  authority: 'Myndighet',
};
