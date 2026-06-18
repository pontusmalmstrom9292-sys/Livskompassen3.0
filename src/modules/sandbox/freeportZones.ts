/** Zon-definitioner för Design Freeport — Modell A navigation. */

export type FreeportZoneId = 'hjartat' | 'vardagen' | 'familjen';

export type FreeportZoneMode = {
  id: string;
  label: string;
  description: string;
};

export type FreeportZoneDef = {
  id: FreeportZoneId;
  label: string;
  lead: string;
  modes: FreeportZoneMode[];
};

/** Modes från befintliga *InputModes.ts — ingen GPT-lista. */
export const FREEPORT_ZONES: FreeportZoneDef[] = [
  {
    id: 'hjartat',
    label: 'Hjärtat',
    lead: 'Dagbok, speglar, arkiv',
    modes: [
      { id: 'reflektion', label: 'Reflektera', description: 'Steg för steg' },
      { id: 'quick_mirror', label: 'Snabb spegling', description: 'Känsla + spegling' },
      { id: 'arkiv', label: 'Arkiv', description: 'Läsa tidigare' },
    ],
  },
  {
    id: 'vardagen',
    label: 'Vardagen',
    lead: 'Planering, MåBra, ekonomi',
    modes: [
      { id: 'task_quick', label: 'Snabb uppgift', description: 'Att göra' },
      { id: 'inkast', label: 'Inkast', description: 'Smart fångst' },
      { id: 'quick_list', label: 'Inköpslista', description: 'Snabb lista' },
      { id: 'checkin', label: 'MåBra check-in', description: 'Humör och energi' },
    ],
  },
  {
    id: 'familjen',
    label: 'Familjen',
    lead: 'Barnfokus, livslogg, BIFF',
    modes: [
      { id: 'barnfokus', label: 'Barnfokus', description: 'Dagens fråga' },
      { id: 'livslogg_stund', label: 'Ny stund', description: 'Positiv stund' },
      { id: 'fysiologi', label: 'Fysiologi', description: 'Sömn, aptit' },
      { id: 'inkast', label: 'Inkast', description: 'Familje-inkast' },
    ],
  },
];

export function getFreeportZone(id: FreeportZoneId): FreeportZoneDef {
  return FREEPORT_ZONES.find((z) => z.id === id) ?? FREEPORT_ZONES[0];
}
