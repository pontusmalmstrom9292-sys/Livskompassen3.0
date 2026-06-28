export const glass = {
  bg: 'var(--ds-glass-bg)',
  heroBg: 'var(--ds-glass-hero-bg)',
  border: 'var(--ds-glass-border)',
  blur: 'var(--ds-glass-blur)',
  highlight: 'var(--ds-glass-highlight)',
} as const;

export type GlassToken = keyof typeof glass;
