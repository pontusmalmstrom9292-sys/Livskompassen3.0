/**
 * Bridges legacy DESIGN export to Premium UI tokens.
 * Prefer `import { tokens } from '@/design-system'`.
 */
import { colors, glass } from '@/design-system';

export const DESIGN = {
  obsidianDeep: colors.bg,
  obsidianSurface: colors.surface1,
  surface2: colors.surface2,
  surface3: colors.surface3,
  text: colors.text,
  textMuted: colors.textMuted,
  textDim: colors.textDim,
  accent: colors.accent,
  accentSecondary: colors.accentSecondary,
  accentAi: colors.accent,
  accentLight: colors.accentLight,
  accentGlow: colors.accentGlow,
  success: colors.success,
  warning: colors.warning,
  danger: colors.danger,
  glass: glass.bg,
  glassHero: glass.heroBg,
  border: colors.border,
  borderStrong: colors.borderStrong,
} as const;

/** Knapp-hierarki — CSS class names for legacy direct className usage. */
export const BUTTON_VARIANTS = {
  continue: 'ds-btn--secondary',
  save: 'ds-btn--success',
  primaryGold: 'ds-btn--accent',
  ghost: 'ds-btn--ghost',
} as const;
