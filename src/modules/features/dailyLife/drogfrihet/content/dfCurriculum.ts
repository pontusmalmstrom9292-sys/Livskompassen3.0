/** @locked MOD-FAM-DROG — låst modul; unlock via docs/evaluations/*-unlock-MOD-FAM-DROG.md */
/**
 * Valfri 12-veckors progression — föreslår, tvingar inte. ADHD: mikrosteg.
 */

export type CurriculumWeek = {
  week: number;
  title_sv: string;
  focus_sv: string;
  tools: string[];
};

export const DF_CURRICULUM_12: readonly CurriculumWeek[] = [
  { week: 1, title_sv: 'Stabilisering', focus_sv: 'Trygghet och kropp', tools: ['SOS', 'HALT', 'dagräknare'] },
  { week: 2, title_sv: 'Mikrosteg', focus_sv: 'Ett litet steg om dagen', tools: ['Idag-kort', 'vatten/rörelse'] },
  { week: 3, title_sv: 'Triggers', focus_sv: 'Kartlägg tid/plats/känsla', tools: ['Min plan', 'PPT'] },
  { week: 4, title_sv: 'Coping-lista', focus_sv: 'Egna 1/3/10-prompter', tools: ['Protokoll', 'distract'] },
  { week: 5, title_sv: 'Tankefällor', focus_sv: 'En fälla i taget', tools: ['Reflektion', 'reality check'] },
  { week: 6, title_sv: 'Urge surfing', focus_sv: 'Rida vågen 2 min', tools: ['Urge surf', 'intensitet'] },
  { week: 7, title_sv: 'Värden', focus_sv: 'Värdeord utan moralism', tools: ['Värdekort', 'coreWhy'] },
  { week: 8, title_sv: 'Ambivalens', focus_sv: 'Beslutsbalans', tools: ['För/emot', 'MI-frågor'] },
  { week: 9, title_sv: 'If–Then', focus_sv: 'Högriskscenarier', tools: ['If–Then', 'natt/helg'] },
  { week: 10, title_sv: 'Stödnät', focus_sv: 'Kontakt utan press', tools: ['Stöd', '90101/1177'] },
  { week: 11, title_sv: 'Lapse-beredskap', focus_sv: 'AVE-skydd', tools: ['Kom tillbaka', '15-min plan'] },
  { week: 12, title_sv: 'Underhåll', focus_sv: 'Låg intensitet, uppdatera plan', tools: ['Veckoreflektion', 'KPI'] },
] as const;
