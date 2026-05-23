export const CHILD_ALIASES = ['Kasper', 'Arvid'] as const;
export type ChildAlias = (typeof CHILD_ALIASES)[number];

export const SIGNAL_LABELS = {
  somn: 'Sömn',
  angest: 'Ångest',
  aptit: 'Aptit',
} as const;

export const BALANS_WINDOW_DAYS = 7;

/** Livslogg-kategorier — `tredjepart` för skola/BVC/soc (Kladd: Ann/Lena). */
export const LIVSLOGG_CATEGORIES = [
  { value: 'vardag', label: 'Vardag' },
  { value: 'middag', label: 'Middag (glädje)' },
  { value: 'skola', label: 'Skola' },
  { value: 'tredjepart', label: 'Tredjepart (skola/resurs)' },
  { value: 'halsa', label: 'Hälsa' },
  { value: 'overlamning', label: 'Överlämning' },
] as const;

/** Roterande middagsfrågor — lekfull ton, inga vuxenkonflikter. */
export const MIDDAGS_QUESTIONS = [
  'Vad fick dig att skratta idag?',
  'Om du fick en superkraft i kväll — vilken skulle det vara?',
  'Vad var det bästa du åt eller luktade idag?',
  'Vem eller vad var extra rolig idag?',
  'Vad vill du göra imorgon som låter kul?',
  'Om dagen var en film — vilken genre?',
  'Vad är du stolt över från idag (stort eller litet)?',
  'Vilket ljud eller ord fastnade i huvudet idag?',
] as const;

export function middagsQuestionForToday(date = new Date()): string {
  const start = new Date(date.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((date.getTime() - start.getTime()) / 86_400_000);
  return MIDDAGS_QUESTIONS[dayOfYear % MIDDAGS_QUESTIONS.length]!;
}

export type LivsloggCategory = (typeof LIVSLOGG_CATEGORIES)[number]['value'];
