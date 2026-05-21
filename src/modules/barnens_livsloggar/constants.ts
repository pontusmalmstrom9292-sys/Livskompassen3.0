export const CHILD_ALIASES = ['Kasper', 'Arvid'] as const;
export type ChildAlias = (typeof CHILD_ALIASES)[number];

export const SIGNAL_LABELS = {
  somn: 'Sömn',
  angest: 'Ångest',
  aptit: 'Aptit',
} as const;

export const BALANS_WINDOW_DAYS = 7;
