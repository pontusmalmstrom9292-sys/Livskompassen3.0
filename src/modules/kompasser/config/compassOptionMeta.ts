import type { LucideIcon } from 'lucide-react';
import {
  Wind,
  ListChecks,
  Moon,
  ShieldCheck,
  BatteryLow,
  Activity,
  CloudRain,
} from 'lucide-react';

export type CompassOptionTone = 'emerald' | 'lavender' | 'gold' | 'indigo' | 'amber';

export type CompassOptionMeta = {
  icon: LucideIcon;
  hint: string;
  tone: CompassOptionTone;
  /** Span both columns in the 2-column hub grid */
  wide?: boolean;
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
  'Inget — vila': {
    icon: Moon,
    hint: 'Ingen prestation',
    tone: 'gold',
    wide: true,
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
};

export function getCompassOptionMeta(option: string): CompassOptionMeta | null {
  return COMPASS_OPTION_META[option] ?? null;
}
