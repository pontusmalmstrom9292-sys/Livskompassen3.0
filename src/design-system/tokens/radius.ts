export const radius = {
  none: 'var(--ds-radius-none)',
  sm: 'var(--ds-radius-sm)',
  md: 'var(--ds-radius-md)',
  lg: 'var(--ds-radius-lg)',
  xl: 'var(--ds-radius-xl)',
  '2xl': 'var(--ds-radius-2xl)',
  '3xl': 'var(--ds-radius-3xl)',
  card: 'var(--ds-radius-card)',
  dock: 'var(--ds-radius-dock)',
  pill: 'var(--ds-radius-pill)',
} as const;

export type RadiusToken = keyof typeof radius;
