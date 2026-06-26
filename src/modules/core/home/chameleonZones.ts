/** Zon-definitioner för Design Freeport — Modell A navigation. */

export type ChameleonZoneId = 'hjartat' | 'vardagen' | 'familjen';

export type ChameleonZoneMode = {
  id: string;
  label: string;
  description: string;
};

export type ChameleonZoneDef = {
  id: ChameleonZoneId;
  label: string;
  lead: string;
  modes: ChameleonZoneMode[];
};

/** Modes från befintliga *InputModes.ts — ingen GPT-lista. */
export const CHAMELEON_ZONES: ChameleonZoneDef[] = [
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

export function getChameleonZone(id: ChameleonZoneId): ChameleonZoneDef {
  return CHAMELEON_ZONES.find((z) => z.id === id) ?? CHAMELEON_ZONES[0];
}
