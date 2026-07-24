import type { LifeHubPresetId } from '@/core/lifeOs/lifeHubPresets';
import { HOME_SUPERHUB_ROUTES } from './homeSuperhubRoutes';
import { NAV_PATHS } from '@/core/navigation/navTruth';

/** Hem v3 — 12 utvecklingskort (kanon från design-sandbox mockup). */
export type HemV3DevCard = {
  id: string;
  title: string;
  hint: string;
  body: string;
  actionLabel: string;
  to: string;
  search?: string;
};

export const HEM_V3_DEVELOPMENT_CARDS: HemV3DevCard[] = [
  {
    id: 'sjalvkansla',
    title: 'Självkänsla',
    hint: 'Mikrosteg',
    body: 'Skriv en sak du gjorde bra idag — utan att rättfärdiga.',
    actionLabel: 'Dagbok',
    to: HOME_SUPERHUB_ROUTES.hjartatReflektion,
  },
  {
    id: 'trygghet',
    title: 'Trygghet',
    hint: 'Reflektion',
    body: 'Nämn en plats eller person som känns trygg just nu.',
    actionLabel: 'Dagbok',
    to: HOME_SUPERHUB_ROUTES.hjartatReflektion,
  },
  {
    id: 'narvaro',
    title: 'Närvaro',
    hint: 'Kropp',
    body: 'Andas 4–6 tre gånger innan nästa val.',
    actionLabel: 'Mabra',
    to: HOME_SUPERHUB_ROUTES.mabraInput,
  },
  {
    id: 'granser',
    title: 'Gränser',
    hint: 'BIFF',
    body: 'Ett Grey Rock-svar du kan återanvända idag.',
    actionLabel: 'Trygg Hamn',
    to: NAV_PATHS.FAMILJEN,
    search: '?tab=hamn',
  },
  {
    id: 'rsd',
    title: 'RSD',
    hint: 'Speglar',
    body: 'Vad är en neutral alternativ tolkning av det som kändes hårt?',
    actionLabel: 'Speglar',
    to: NAV_PATHS.HJARTAT,
    search: '?tab=speglar',
  },
  {
    id: 'vila',
    title: 'Vila',
    hint: 'Plan',
    body: '20 min utan skärm — inte belöning, bara kapacitet.',
    actionLabel: 'Mabra',
    to: HOME_SUPERHUB_ROUTES.mabraInput,
  },
  {
    id: 'lar-dig',
    title: 'Lär dig',
    hint: 'Reflektion',
    body: 'Allostatic load minskar med regelbunden sömn — ett litet steg räcker.',
    actionLabel: 'Mabra',
    to: HOME_SUPERHUB_ROUTES.mabraInput,
  },
  {
    id: 'quiz',
    title: 'Quiz',
    hint: 'Fråga',
    body: 'Vilket behov stod bakom din senaste reaktion — trygghet eller kontroll?',
    actionLabel: 'Mabra',
    to: HOME_SUPERHUB_ROUTES.mabraInput,
  },
  {
    id: 'prova-nytt',
    title: 'Prova nytt',
    hint: 'Lek',
    body: 'Testa en ny promenadrutt i 10 min — ingen prestation.',
    actionLabel: 'Barnfokus',
    to: NAV_PATHS.FAMILJEN,
    search: '?tab=reflektion',
  },
  {
    id: 'kropp',
    title: 'Kropp',
    hint: 'Mikrosteg',
    body: 'Drick ett glas vatten. Markera att du gjort det.',
    actionLabel: 'Mabra',
    to: HOME_SUPERHUB_ROUTES.mabraInput,
  },
  {
    id: 'relation',
    title: 'Relation',
    hint: 'Socialt',
    body: 'Skicka ett kort meddelande till någon trygg — en rad.',
    actionLabel: 'Familjen',
    to: NAV_PATHS.FAMILJEN,
    search: '?tab=tillsammans',
  },
  {
    id: 'logistik',
    title: 'Logistik',
    hint: 'Planering',
    body: 'Välj ett ärende. Gör bara nästa atomära del.',
    actionLabel: 'Planering',
    to: HOME_SUPERHUB_ROUTES.planeringTask,
  },
];

/** Låg kapacitet — lugna kort först (max 4 synliga). */
export const HEM_V3_LOW_CAPACITY_CARD_IDS = ['narvaro', 'vila', 'kropp', 'trygghet'] as const;

/** Filtrera 12-korts rail efter Life Hub-preset (ingen cross-RAG, inget Valv i publikt läge). */
export function filterDevelopmentCardsForPreset(
  cards: HemV3DevCard[],
  presetId: LifeHubPresetId,
): HemV3DevCard[] {
  if (presetId === 'minimal') return [];
  if (presetId === 'rehab_lag') {
    const rehabIds = new Set([
      'sjalvkansla',
      'trygghet',
      'narvaro',
      'rsd',
      'vila',
      'kropp',
      'lar-dig',
    ]);
    return cards.filter((c) => rehabIds.has(c.id));
  }
  if (presetId === 'vardag_arbete') {
    const workIds = new Set(['logistik', 'vila', 'kropp', 'narvaro']);
    return cards.filter((c) => workIds.has(c.id));
  }
  return cards;
}

export const HEM_V3_SUPERMODS = [
  { id: 'Kompass', label: 'Kompass', icon: '☑' },
  { id: 'Anteckning', label: 'Inkast', icon: '+' },
  { id: 'Dagbok', label: 'Dagbok', icon: '📖' },
  { id: 'Check-in', label: 'Check-in', icon: '◉' },
] as const;

export type HemV3SuperModId = (typeof HEM_V3_SUPERMODS)[number]['id'];

export const HEM_V3_SUPERMOD_COPY: Record<
  HemV3SuperModId,
  { focus: string; focusSub: string; sample: string; placeholder: string }
> = {
  Kompass: {
    focus: 'Vatten, medicin och tre minuters närvaro',
    focusSub: 'Morgonrutin',
    sample: 'Vatten ✓ · Medicin ✓ · 3 min andning.',
    placeholder: 'Morgoncheck — ett steg i taget …',
  },
  Anteckning: {
    focus: 'Fånga en tanke — redigera senare',
    focusSub: 'Snabb-inkast',
    sample: '',
    placeholder: 'Snabb anteckning — sparas i Hjärtat …',
  },
  Dagbok: {
    focus: 'Lugnt samtal med barnen efter skolan',
    focusSub: '18 juni',
    sample: 'Imorse: lite trött men lugn. Barnen verkade trygga.',
    placeholder: 'En rad räcker — neutralt och privat …',
  },
  'Check-in': {
    focus: 'Hur känns kapaciteten just nu?',
    focusSub: 'Kapacitet',
    sample: 'Kapacitet: lugn · sömn ok · ingen brådska.',
    placeholder: 'Hur känns kapaciteten just nu?',
  },
};
