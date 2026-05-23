import type { LucideIcon } from 'lucide-react';
import {
  Wind,
  ListChecks,
  Moon,
  Footprints,
  PenLine,
  Anchor,
  ShieldCheck,
  BatteryLow,
  Activity,
  CloudRain,
  Droplets,
  HeartHandshake,
} from 'lucide-react';

export type CompassOptionTone = 'emerald' | 'lavender' | 'gold' | 'indigo' | 'amber';

export type CompassOptionMeta = {
  icon: LucideIcon;
  hint: string;
  tone: CompassOptionTone;
};

export const COMPASS_OPTION_META: Record<string, CompassOptionMeta> = {
  'Andning 2 min': {
    icon: Wind,
    hint: '2 min lugn',
    tone: 'lavender',
  },
  'En uppgift': {
    icon: ListChecks,
    hint: 'Ett steg',
    tone: 'emerald',
  },
  'Rörelse 5 min': {
    icon: Footprints,
    hint: 'Ute eller inne',
    tone: 'indigo',
  },
  'Skriv en rad': {
    icon: PenLine,
    hint: 'Dagbok utan krav',
    tone: 'gold',
  },
  'Läs ankaret': {
    icon: Anchor,
    hint: 'Sanningens ankare',
    tone: 'emerald',
  },
  'Inget — vila': {
    icon: Moon,
    hint: 'Ingen prestation',
    tone: 'gold',
  },
  Stabil: {
    icon: ShieldCheck,
    hint: 'Jordad',
    tone: 'emerald',
  },
  Trött: {
    icon: BatteryLow,
    hint: 'Låg energi',
    tone: 'indigo',
  },
  Spänd: {
    icon: Activity,
    hint: 'Kroppen larmar',
    tone: 'amber',
  },
  Orolig: {
    icon: CloudRain,
    hint: 'Behöver landning',
    tone: 'lavender',
  },
  Hungrig: {
    icon: Droplets,
    hint: 'Första bränsle',
    tone: 'amber',
  },
  'Behöver kontakt': {
    icon: HeartHandshake,
    hint: 'Trygg person',
    tone: 'lavender',
  },
};

export function getCompassOptionMeta(option: string): CompassOptionMeta | null {
  return COMPASS_OPTION_META[option] ?? null;
}
