import type { JournalStep } from '../types/journal';

export const MOOD_OPTIONS = ['Lugn', 'Trött', 'Spänd', 'Hoppfull', 'Låg'] as const;

export type MoodOption = (typeof MOOD_OPTIONS)[number];

export const JOURNAL_STEPS: { key: JournalStep; label: string }[] = [
  { key: 'mood', label: 'Humör' },
  { key: 'text', label: 'Text' },
  { key: 'save', label: 'Bekräfta' },
  { key: 'done', label: 'Klar' },
];
