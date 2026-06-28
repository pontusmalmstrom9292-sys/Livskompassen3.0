export const blur = {
  none: 'var(--ds-blur-none)',
  sm: 'var(--ds-blur-sm)',
  md: 'var(--ds-blur-md)',
  lg: 'var(--ds-blur-lg)',
  xl: 'var(--ds-blur-xl)',
  '2xl': 'var(--ds-blur-2xl)',
} as const;

export type BlurToken = keyof typeof blur;
