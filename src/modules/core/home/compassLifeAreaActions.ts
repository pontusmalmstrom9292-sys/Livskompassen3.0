import type { CompassFlow } from '../../kompasser/utils/compassTime';
import type { HomeActionId } from './homeActionCategories';

export type LifeAreaId = 'utveckling' | 'vila' | 'praktik' | 'relation';

export type LifeAreaActivation = {
  id: string;
  area: LifeAreaId;
  label: string;
  hint: string;
  homeAction?: HomeActionId;
  path?: string;
  search?: string;
  factKey?: string;
};

export const LIFE_AREA_META: Record<
  LifeAreaId,
  { label: string; desc: string }
> = {
  utveckling: { label: 'Utveckling', desc: 'Lär dig något nytt' },
  vila: { label: 'Vila', desc: 'Återhämtning utan prestation' },
  praktik: { label: 'Praktik', desc: 'Ett steg i vardagen' },
  relation: { label: 'Relation', desc: 'Gränser & familj' },
};

const FUN_FACTS = [
  'Hjärnan använder ungefär en femtedel av kroppens energi i vila — trötthet efter stress är biologiskt normalt.',
  'Kort promenad (även 5 min) kan sänka kortisol märkbart samma dag.',
  'Sömn före midnatt ger ofta mer djupsömn än samma timmar efter midnatt.',
  'Att skriva en neutral mening om en händelse minskar ofta återkommande grubblande.',
  'Mikrosteg under 2 minuter aktiverar ofta start utan att trigga paralys.',
  'Vagusnerven påverkas av långsam utandning — 4 sek in, 6–8 sek ut.',
];

export function pickCompassFact(seed: string): string {
  let h = 0;
  for (let i = 0; i < seed.length; i += 1) {
    h = (h + seed.charCodeAt(i) * (i + 1)) | 0;
  }
  return FUN_FACTS[Math.abs(h) % FUN_FACTS.length]!;
}

function morningActivations(option: string): LifeAreaActivation[] {
  switch (option) {
    case 'Andning 2 min':
      return [
        {
          id: 'utv-faktum',
          area: 'utveckling',
          label: 'Rolig fakta',
          hint: 'Ett kort faktum om kropp & hjärna',
          factKey: `morning-breath-${option}`,
        },
        {
          id: 'vila-mabra',
          area: 'vila',
          label: 'Andning',
          hint: '4-7-8 i Måbra',
          path: '/mabra',
        },
        {
          id: 'praktik-minne',
          area: 'praktik',
          label: 'Intention',
          hint: 'En rad i Kunskap',
          path: '/vardagen',
          search: '?tab=kunskap',
        },
      ];
    case 'En uppgift':
      return [
        {
          id: 'utv-quiz',
          area: 'utveckling',
          label: 'Frågesport',
          hint: 'Valvet ställer en fråga',
          homeAction: 'quiz',
        },
        {
          id: 'praktik-uppgift',
          area: 'praktik',
          label: 'Ny uppgift',
          hint: 'Ett mikrosteg',
          homeAction: 'uppgift',
        },
        {
          id: 'utv-lucka',
          area: 'utveckling',
          label: 'Lucka',
          hint: 'Fyll i vad som saknas',
          homeAction: 'lucka',
        },
      ];
    case 'Inget — vila':
      return [
        {
          id: 'vila-dagbok',
          area: 'vila',
          label: 'Dagbok',
          hint: 'Skriv utan att prestera',
          homeAction: 'dagbok',
        },
        {
          id: 'utv-faktum-rest',
          area: 'utveckling',
          label: 'Rolig fakta',
          hint: 'Lågaffektivt — ingen prestation',
          factKey: `morning-rest-${option}`,
        },
        {
          id: 'rel-hamn',
          area: 'relation',
          label: 'Hamnen',
          hint: 'Om kontakt med ex känns tung',
          path: '/hamn',
        },
      ];
    default:
      return [];
  }
}

function dayActivations(option: string): LifeAreaActivation[] {
  switch (option) {
    case 'Trött':
      return [
        {
          id: 'vila-mabra-tired',
          area: 'vila',
          label: 'Paus',
          hint: 'Kort återhämtning',
          path: '/mabra',
        },
        {
          id: 'utv-faktum-tired',
          area: 'utveckling',
          label: 'Rolig fakta',
          hint: 'Om trötthet & stress',
          factKey: `day-tired-${option}`,
        },
      ];
    case 'Spänd':
      return [
        {
          id: 'vila-andning',
          area: 'vila',
          label: 'Andning',
          hint: '4-7-8',
          path: '/mabra',
        },
        {
          id: 'praktik-logg',
          area: 'praktik',
          label: 'Logga',
          hint: 'Neutral rad i Kunskap',
          path: '/vardagen',
          search: '?tab=kunskap',
        },
      ];
    case 'Orolig':
      return [
        {
          id: 'rel-hamn-anx',
          area: 'relation',
          label: 'Hamnen',
          hint: 'BIFF / Grey Rock',
          path: '/hamn',
        },
        {
          id: 'utv-quiz-anx',
          area: 'utveckling',
          label: 'Frågesport',
          hint: 'Fokus bort från oro',
          homeAction: 'quiz',
        },
        {
          id: 'vila-speglar',
          area: 'vila',
          label: 'Speglar',
          hint: 'Känsla vs fakta',
          path: '/dagbok',
          search: '?tab=speglar',
        },
      ];
    case 'Stabil':
      return [
        {
          id: 'utv-quiz-stable',
          area: 'utveckling',
          label: 'Frågesport',
          hint: 'Bygg vidare på stabil dag',
          homeAction: 'quiz',
        },
        {
          id: 'praktik-uppgift-stable',
          area: 'praktik',
          label: 'Uppgift',
          hint: 'Ett litet steg',
          homeAction: 'uppgift',
        },
        {
          id: 'rel-familj',
          area: 'relation',
          label: 'Familjen',
          hint: 'Logg för pojkarna',
          path: '/familjen',
        },
      ];
    default:
      return [];
  }
}

const DEFAULT_PREVIEW: LifeAreaActivation[] = [
  {
    id: 'preview-utv',
    area: 'utveckling',
    label: '—',
    hint: 'Frågesport, fakta eller lucka',
  },
  {
    id: 'preview-vila',
    area: 'vila',
    label: '—',
    hint: 'Dagbok eller Måbra',
  },
  {
    id: 'preview-praktik',
    area: 'praktik',
    label: '—',
    hint: 'Mikrosteg eller vardag',
  },
  {
    id: 'preview-rel',
    area: 'relation',
    label: '—',
    hint: 'Hamn eller Familjen',
  },
];

/** Deterministiska aktiveringar efter kompass-svar (ingen LLM). */
export function resolveLifeAreaActivations(
  flow: CompassFlow,
  option: string | null,
  saved: boolean,
): LifeAreaActivation[] {
  if (!saved || !option) return DEFAULT_PREVIEW;
  if (flow === 'morning') return morningActivations(option);
  if (flow === 'day') return dayActivations(option);
  if (flow === 'evening') {
    return [
      {
        id: 'vila-dagbok-eve',
        area: 'vila',
        label: 'Dagbok',
        hint: 'Land dagen',
        homeAction: 'dagbok',
      },
      {
        id: 'utv-faktum-eve',
        area: 'utveckling',
        label: 'Rolig fakta',
        hint: 'Lätt avslutning',
        factKey: 'evening-kasam',
      },
    ];
  }
  return [];
}

export function activationsByArea(
  activations: LifeAreaActivation[],
): Map<LifeAreaId, LifeAreaActivation[]> {
  const map = new Map<LifeAreaId, LifeAreaActivation[]>();
  for (const id of Object.keys(LIFE_AREA_META) as LifeAreaId[]) {
    map.set(id, []);
  }
  for (const a of activations) {
    map.get(a.area)?.push(a);
  }
  return map;
}
