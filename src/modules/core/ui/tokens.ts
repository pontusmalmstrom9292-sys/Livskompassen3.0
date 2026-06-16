/** Design tokens — synced from themeRegistry (Theme Pack I-stone default). */
import { getTheme, DEFAULT_THEME_ID } from '../theme/themeRegistry';

const stone = getTheme(DEFAULT_THEME_ID).cssVars;

export const DESIGN = {
  obsidianDeep: stone['--bg'] ?? stone['--color-obsidian-deep'] ?? '#020617',
  obsidianSurface: stone['--surface'] ?? stone['--color-obsidian-surface'] ?? '#050b14',
  surface2: stone['--surface-2'] ?? '#1a1a1a',
  surface3: stone['--surface-3'] ?? '#222222',
  text: stone['--text'] ?? '#f5f0e8',
  textMuted: stone['--text-muted'] ?? '#c4bdb4',
  textDim: stone['--text-dim'] ?? '#a8a29e',
  accent: stone['--accent'] ?? '#d4af37',
  accentSecondary: stone['--accent-secondary'] ?? '#f59e0b',
  accentAi: stone['--accent'] ?? '#d4af37',
  accentLight: stone['--accent-light'] ?? '#e8d48a',
  accentGlow: stone['--accent-glow'] ?? 'rgba(212, 175, 55, 0.18)',
  success: stone['--success'] ?? '#6b8f71',
  warning: stone['--warning'] ?? '#b45309',
  danger: stone['--danger'] ?? '#dc2626',
  glass: stone['--glass'] ?? 'rgba(8, 8, 8, 0.72)',
  glassHero: stone['--glass-hero'] ?? 'rgba(8, 8, 8, 0.85)',
  border: stone['--border'] ?? 'rgba(212, 175, 55, 0.12)',
  borderStrong: stone['--border-strong'] ?? 'rgba(212, 175, 55, 0.45)',
} as const;

/** Knapp-hierarki (design-master §4) */
export const BUTTON_VARIANTS = {
  continue: 'btn-pill--secondary',
  save: 'btn-pill--success',
  primaryGold: 'btn-pill--accent',
  ghost: 'btn-pill--ghost',
} as const;
