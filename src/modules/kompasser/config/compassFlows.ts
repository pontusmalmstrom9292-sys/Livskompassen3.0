import type { LucideIcon } from 'lucide-react';
import { Sun, Cloud, Moon } from 'lucide-react';
import type { CompassFlow } from '../utils/compassTime';

export const MORNING_ANCHOR =
  'Min hjärna är inte trasig. Den reagerar helt normalt på en onormal situation.';

export type CompassFlowConfig = {
  id: CompassFlow;
  label: string;
  icon: LucideIcon;
  question: string;
  options: string[];
  heroTitle: string;
  heroLead: string;
};

export const COMPASS_FLOWS: CompassFlowConfig[] = [
  {
    id: 'morning',
    label: 'Morgon',
    icon: Sun,
    question: 'Vilket mikrosteg ger dig lugnast start idag?',
    options: ['Andning 2 min', 'En uppgift', 'Inget — vila'],
    heroTitle: 'Morgonkompass',
    heroLead: 'Ett mikrosteg för lugn start — anpassas efter morgon (05–10).',
  },
  {
    id: 'day',
    label: 'Dag',
    icon: Cloud,
    question: 'Hur mår kroppen just nu?',
    options: ['Stabil', 'Trött', 'Spänd', 'Orolig'],
    heroTitle: 'Dagskompass',
    heroLead: 'Kroppscheck — synlig från 11:00, anpassas efter ditt humör.',
  },
];

export const EVENING_HERO = {
  heroTitle: 'Kvällskompass',
  heroLead: 'Land dagen med KASAM — anpassas efter kväll (17–04).',
  label: 'Kväll',
  icon: Moon,
};

export function getFlowConfig(flow: CompassFlow): CompassFlowConfig | null {
  return COMPASS_FLOWS.find((f) => f.id === flow) ?? null;
}
