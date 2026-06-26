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
  { id: 'fokus', label: 'Nästa steg' },
  { id: 'framsteg', label: 'Framsteg' },
  { id: 'regler', label: 'Regler' },
];

export const SOURCE_LABELS: Record<string, string> = {
  email: 'Mejl',
  school: 'Skola',
  calendar: 'Kalender',
  manual: 'Manuell',
  authority: 'Myndighet',
  voice_to_vault: 'Röst',
};

/** Fas 23D — Paralys-Brytaren i P3 (user_overwhelm, ett steg). */
export const PLANERING_PARALYS_ONE_STEP = 'Bara ett steg' as const;

export const PLANERING_PARALYS_LEAD =
  'Listan känns tung? Ett mikrosteg i taget — ingen prestation.' as const;

export const PLANERING_PARALYS_CALM =
  'Bara detta — resten kan vänta.' as const;
