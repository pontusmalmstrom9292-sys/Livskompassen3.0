/** Design tokens — canonical: docs/specs/design-master.md (Obsidian Calm, Riktning A) */
export const DESIGN = {
  bg: '#020617',
  surface: '#0f172a',
  surface2: '#1e293b',
  surface3: '#334155',
  text: '#F1F5F9',
  textMuted: '#94A3B8',
  textDim: '#64748B',
  accent: '#FDE68A',
  accentSecondary: '#818CF8',
  accentAi: '#6366F1',
  accentLight: '#FEF3C7',
  accentGlow: 'rgba(253, 230, 138, 0.15)',
  success: '#2DD4BF',
  warning: '#A16207',
  danger: '#DC2626',
  glass: 'rgba(15, 23, 42, 0.6)',
  glassHero: 'rgba(15, 23, 42, 0.72)',
  border: 'rgba(255, 255, 255, 0.06)',
  borderStrong: 'rgba(255, 255, 255, 0.10)',
} as const;

/** Knapp-hierarki (design-master §4) */
export const BUTTON_VARIANTS = {
  continue: 'btn-pill--secondary',
  save: 'btn-pill--success',
  primaryGold: 'btn-pill--accent',
  ghost: 'btn-pill--ghost',
} as const;
