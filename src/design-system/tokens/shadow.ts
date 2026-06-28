export const shadow = {
  sm: 'var(--ds-shadow-sm)',
  md: 'var(--ds-shadow-md)',
  lg: 'var(--ds-shadow-lg)',
  xl: 'var(--ds-shadow-xl)',
  accentGlow: 'var(--ds-shadow-accent-glow)',
  accentGlowLg: 'var(--ds-shadow-accent-glow-lg)',
} as const;

export type ShadowToken = keyof typeof shadow;
