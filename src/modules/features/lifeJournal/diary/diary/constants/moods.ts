import type { JournalStep } from '../types/journal';

export type MoodTone = 'calm' | 'warm' | 'cool' | 'gold' | 'rose' | 'slate' | 'amber' | 'indigo';

export type MoodDef = {
  id: string;
  label: string;
  emoji: string;
  tone: MoodTone;
};

/** Känslor — sparas som `label` i journal (bakåtkompatibelt). */
export const MOOD_CATALOG: MoodDef[] = [
  { id: 'lugn', label: 'Lugn', emoji: '🙂', tone: 'calm' },
  { id: 'glad', label: 'Glad', emoji: '😊', tone: 'warm' },
  { id: 'trott', label: 'Trött', emoji: '😴', tone: 'slate' },
  { id: 'spand', label: 'Spänd', emoji: '😬', tone: 'amber' },
  { id: 'oro', label: 'Oro', emoji: '😟', tone: 'indigo' },
  { id: 'arg', label: 'Arg', emoji: '😤', tone: 'rose' },
  { id: 'lag', label: 'Låg', emoji: '😔', tone: 'slate' },
  { id: 'tom', label: 'Tom', emoji: '😶', tone: 'cool' },
  { id: 'hoppfull', label: 'Hoppfull', emoji: '🌱', tone: 'gold' },
  { id: 'stolt', label: 'Stolt', emoji: '💪', tone: 'warm' },
  { id: 'tacksam', label: 'Tacksam', emoji: '💛', tone: 'gold' },
  { id: 'overvaldigad', label: 'Överväldigad', emoji: '🌊', tone: 'indigo' },
];

export const MOOD_OPTIONS = MOOD_CATALOG.map((m) => m.label) as readonly string[];

export type MoodOption = (typeof MOOD_OPTIONS)[number];

export function getMoodDef(label: string): MoodDef | undefined {
  return MOOD_CATALOG.find((m) => m.label === label);
}

/** Humör som ofta behöver kropp/Mabra först — diskret länk. */
export const HEAVY_MOODS = new Set(['Låg', 'Spänd', 'Oro', 'Arg', 'Överväldigad']);

export const JOURNAL_STEPS: { key: JournalStep; label: string; emoji: string }[] = [
  { key: 'mood', label: 'Känsla', emoji: '✦' },
  { key: 'text', label: 'Skriv', emoji: '✎' },
  { key: 'save', label: 'Kolla', emoji: '👀' },
  { key: 'done', label: 'Klart', emoji: '✓' },
];
