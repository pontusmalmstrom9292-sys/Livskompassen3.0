import type { LucideIcon } from 'lucide-react';
import { BatteryLow, CloudRain, Sun, Wind, Zap } from 'lucide-react';
import type { MoodOption } from './moods';
import { MOOD_REFLECTION_PROMPTS } from './moodPrompts';

export type MoodTone = 'calm' | 'tired' | 'tense' | 'hope' | 'low';

export type MoodQuickAction = {
  id: string;
  label: string;
  hint: string;
  path?: string;
  search?: string;
  /** Fortsätt wizard till text */
  continueWizard?: boolean;
};

export type MoodMeta = {
  tone: MoodTone;
  icon: LucideIcon;
  tagline: string;
  prompt: string;
  actions: MoodQuickAction[];
};

export const MOOD_META: Record<MoodOption, MoodMeta> = {
  Lugn: {
    tone: 'calm',
    icon: Wind,
    tagline: 'Stabil bas — bygg vidare lugnt',
    prompt: MOOD_REFLECTION_PROMPTS.Lugn,
    actions: [
      { id: 'write', label: 'Skriv reflektion', hint: 'Steg 2', continueWizard: true },
      { id: 'kunskap', label: 'Spara i Minne', hint: 'Kunskapsvalvet', path: '/vardagen', search: '?tab=kunskap' },
    ],
  },
  Trött: {
    tone: 'tired',
    icon: BatteryLow,
    tagline: 'Energi låg — minimum räcker',
    prompt: MOOD_REFLECTION_PROMPTS.Trött,
    actions: [
      { id: 'mood-only', label: 'Spara humör', hint: 'Ingen text krävs' },
      { id: 'mabra', label: 'Vila i Måbra', hint: 'Kort paus', path: '/mabra' },
      { id: 'write', label: 'En rad räcker', hint: 'Steg 2', continueWizard: true },
    ],
  },
  Spänd: {
    tone: 'tense',
    icon: Zap,
    tagline: 'Kroppen är aktiv — reglera först',
    prompt: MOOD_REFLECTION_PROMPTS.Spänd,
    actions: [
      { id: 'mabra', label: 'Andning', hint: '4-7-8', path: '/mabra' },
      { id: 'speglar', label: 'Speglar', hint: 'Känsla vs fakta', path: '/dagbok', search: '?tab=speglar' },
      { id: 'write', label: 'Logga kroppen', hint: 'Steg 2', continueWizard: true },
    ],
  },
  Hoppfull: {
    tone: 'hope',
    icon: Sun,
    tagline: 'Lätt framåt — fånga steget',
    prompt: MOOD_REFLECTION_PROMPTS.Hoppfull,
    actions: [
      { id: 'write', label: 'Skriv intention', hint: 'Steg 2', continueWizard: true },
      { id: 'vardagen', label: 'Mikrosteg', hint: 'Kompasser', path: '/vardagen' },
    ],
  },
  Låg: {
    tone: 'low',
    icon: CloudRain,
    tagline: 'Låg energi — var snäll mot dig',
    prompt: MOOD_REFLECTION_PROMPTS.Låg,
    actions: [
      { id: 'mood-only', label: 'Spara humör', hint: 'Klart för idag' },
      { id: 'mabra', label: 'Måbra', hint: 'Reglera', path: '/mabra' },
      { id: 'write', label: 'Skriv minimum', hint: 'Steg 2', continueWizard: true },
    ],
  },
};

export const TEXT_STARTERS = [
  'Idag känner jag att…',
  'Kroppen säger…',
  'Jag behöver…',
  'Ett faktum jag vill minnas:',
] as const;
