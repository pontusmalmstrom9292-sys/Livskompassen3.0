/** Semantic color tokens — values resolve via CSS custom properties at runtime. */
export const colors = {
  bg: 'var(--ds-color-bg)',
  bgDusk: 'var(--ds-color-bg-dusk)',
  surface1: 'var(--ds-color-surface-1)',
  surface2: 'var(--ds-color-surface-2)',
  surface3: 'var(--ds-color-surface-3)',
  text: 'var(--ds-color-text)',
  textMuted: 'var(--ds-color-text-muted)',
  textDim: 'var(--ds-color-text-dim)',
  accent: 'var(--ds-color-accent)',
  accentLight: 'var(--ds-color-accent-light)',
  accentSecondary: 'var(--ds-color-accent-secondary)',
  accentGlow: 'var(--ds-color-accent-glow)',
  success: 'var(--ds-color-success)',
  warning: 'var(--ds-color-warning)',
  danger: 'var(--ds-color-danger)',
  border: 'var(--ds-color-border)',
  borderStrong: 'var(--ds-color-border-strong)',
  glassBorder: 'var(--ds-color-glass-border)',
} as const;

export type ColorToken = keyof typeof colors;
