/** Design tokens — canonical: docs/specs/design-master.md (Obsidian + Riktning B hub tiles) */
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
  glassWarm: 'rgba(18, 16, 28, 0.78)',
  border: 'rgba(255, 255, 255, 0.06)',
  borderStrong: 'rgba(255, 255, 255, 0.10)',
} as const;

/** Riktning B — varmtonade kluster/hub-kort (nav-01 / Horizon Grid-energi) */
export const CLUSTER_TILE = {
  gold: {
    surface: '#14120e',
    surfaceHover: '#1a1710',
    border: 'rgba(245, 158, 11, 0.22)',
    borderHover: 'rgba(253, 230, 138, 0.35)',
    icon: '#fde68a',
    glow: 'rgba(245, 158, 11, 0.14)',
    iconGradient:
      'linear-gradient(145deg, rgba(245, 158, 11, 0.22) 0%, rgba(253, 230, 138, 0.06) 100%)',
  },
  indigo: {
    surface: '#0d101a',
    surfaceHover: '#121629',
    border: 'rgba(99, 102, 241, 0.22)',
    borderHover: 'rgba(129, 140, 248, 0.38)',
    icon: '#a5b4fc',
    glow: 'rgba(99, 102, 241, 0.14)',
    iconGradient:
      'linear-gradient(145deg, rgba(99, 102, 241, 0.2) 0%, rgba(129, 140, 248, 0.06) 100%)',
  },
  lavender: {
    surface: '#110d14',
    surfaceHover: '#16101c',
    border: 'rgba(167, 139, 250, 0.2)',
    borderHover: 'rgba(196, 181, 253, 0.35)',
    icon: '#c4b5fd',
    glow: 'rgba(167, 139, 250, 0.12)',
    iconGradient:
      'linear-gradient(145deg, rgba(167, 139, 250, 0.18) 0%, rgba(129, 140, 248, 0.06) 100%)',
  },
  emerald: {
    surface: '#0d1311',
    surfaceHover: '#121f1a',
    border: 'rgba(16, 185, 129, 0.22)',
    borderHover: 'rgba(45, 212, 191, 0.38)',
    icon: '#5eead4',
    glow: 'rgba(16, 185, 129, 0.14)',
    iconGradient:
      'linear-gradient(145deg, rgba(16, 185, 129, 0.2) 0%, rgba(45, 212, 191, 0.06) 100%)',
  },
} as const;

export type ClusterTileTone = keyof typeof CLUSTER_TILE;

/** Knapp-hierarki (design-master §4) */
export const BUTTON_VARIANTS = {
  continue: 'btn-pill--secondary',
  save: 'btn-pill--success',
  primaryGold: 'btn-pill--accent',
  ghost: 'btn-pill--ghost',
} as const;
