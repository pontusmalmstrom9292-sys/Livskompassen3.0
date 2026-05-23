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
  { value: 'skola', label: 'Skola' },
  { value: 'tredjepart', label: 'Tredjepart (skola/resurs)' },
  { value: 'halsa', label: 'Hälsa' },
  { value: 'overlamning', label: 'Överlämning' },
  { value: 'vitals', label: 'Vitals' },
  { value: 'citat', label: 'Citat' },
  { value: 'milstolpe', label: 'Milstolpe' },
  { value: 'lek', label: 'Lek' },
] as const;

export type LivsloggCategory = (typeof LIVSLOGG_CATEGORIES)[number]['value'];
