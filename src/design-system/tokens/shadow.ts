export const shadow = {
  sm: 'var(--ds-shadow-sm)',
  md: 'var(--ds-shadow-md)',
  lg: 'var(--ds-shadow-lg)',
  xl: 'var(--ds-shadow-xl)',
  wallet: 'var(--ds-shadow-wallet)',
  accentGlow: 'var(--ds-shadow-accent-glow)',
  accentGlowLg: 'var(--ds-shadow-accent-glow-lg)',
  compassGlow: 'var(--ds-shadow-compass-glow)',
  ctaGlow: 'var(--ds-shadow-cta-glow)',
} as const;

export type ShadowToken = keyof typeof shadow;
