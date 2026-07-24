export const glass = {
  bg: 'var(--ds-glass-bg)',
  heroBg: 'var(--ds-glass-hero-bg)',
  border: 'var(--ds-glass-border)',
  blur: 'var(--ds-glass-blur)',
  highlight: 'var(--ds-glass-highlight)',
  walletSurface: 'var(--ds-wallet-surface)',
  cardRimGold: 'var(--ds-card-rim-gold)',
  cardRimChampagne: 'var(--ds-card-rim-champagne)',
  cardInsetDepth: 'var(--ds-card-inset-depth)',
  glowCompass: 'var(--ds-glow-compass)',
  glowCta: 'var(--ds-glow-cta)',
} as const;

export type GlassToken = keyof typeof glass;
