import type { ChromeV4Category } from '../ui/chromeIcons';

export type OrbitRing = 'cardinal' | 'intercardinal';

export type OrbitSlotConfig = {
  id: string;
  icon: ChromeV4Category;
  label: string;
  shortLabel: string;
  blurb: string;
  to: string;
  /** Degrees clockwise from north (12 o'clock). */
  angle: number;
  ring: OrbitRing;
};

/** Yttre ring — huvudzoner. Inner ring — livsmoduler. */
export const HERO_ORBIT_SLOTS: OrbitSlotConfig[] = [
  {
    id: 'rutiner',
    icon: 'rutiner',
    label: 'Rutiner och kompasser',
    shortLabel: 'Rutiner',
    blurb: 'Morgon · dag · kväll',
    to: '/vardagen?tab=kompasser',
    angle: 0,
    ring: 'cardinal',
  },
  {
    id: 'planering',
    icon: 'planering',
    label: 'Planering',
    shortLabel: 'Planering',
    blurb: 'Handling · kanban',
    to: '/planering',
    angle: 45,
    ring: 'intercardinal',
  },
  {
    id: 'ekonomi',
    icon: 'ekonomi',
    label: 'Ekonomi',
    shortLabel: 'Ekonomi',
    blurb: 'Veckopeng · matlåda',
    to: '/vardagen?tab=ekonomi',
    angle: 90,
    ring: 'cardinal',
  },
  {
    id: 'familjen',
    icon: 'familjen',
    label: 'Familjen',
    shortLabel: 'Familjen',
    blurb: 'Barn · middagsfråga',
    to: '/familjen',
    angle: 135,
    ring: 'intercardinal',
  },
  {
    id: 'mabra',
    icon: 'utveckling',
    label: 'Personlig utveckling',
    shortLabel: 'Utveckling',
    blurb: 'Övningar · MåBra',
    to: '/mabra',
    angle: 180,
    ring: 'cardinal',
  },
  {
    id: 'dagbok',
    icon: 'dagbok',
    label: 'Dagbok',
    shortLabel: 'Dagbok',
    blurb: 'Neutral rad · spegling',
    to: '/dagbok',
    angle: 225,
    ring: 'intercardinal',
  },
  {
    id: 'kunskap',
    icon: 'kunskap',
    label: 'Kunskap',
    shortLabel: 'Kunskap',
    blurb: 'Kunskapsbank · bakom Valv-PIN',
    to: '/dagbok?tab=bevis&vaultTab=kunskapsbank',
    angle: 270,
    ring: 'cardinal',
  },
  {
    id: 'valv',
    icon: 'valv',
    label: 'Valv',
    shortLabel: 'Valv',
    blurb: 'Bevis · mönster · orkester',
    to: '/dagbok?tab=bevis',
    angle: 315,
    ring: 'intercardinal',
  },
];

export type HeroQuickPick = {
  id: string;
  label: string;
  to: string;
};

/** Direktnavigering under skivan — utan expanderade paneler. */
export const HERO_QUICK_PICKS: HeroQuickPick[] = [
  { id: 'checkin', label: 'Check-in', to: '/' },
  { id: 'dagbok', label: 'Dagbok', to: '/dagbok' },
  { id: 'uppgift', label: 'Uppgift', to: '/planering' },
  { id: 'hamn', label: 'Hamn', to: '/hamn' },
  { id: 'kompis', label: 'Kompis', to: '/kompis' },
];

export const COMPASS_CARDINALS = [
  { id: 'n', label: 'N', angle: 0 },
  { id: 'o', label: 'Ö', angle: 90 },
  { id: 's', label: 'S', angle: 180 },
  { id: 'v', label: 'V', angle: 270 },
] as const;

export function orbitRadiusPercent(ring: OrbitRing): number {
  return ring === 'cardinal' ? 42 : 31;
}
