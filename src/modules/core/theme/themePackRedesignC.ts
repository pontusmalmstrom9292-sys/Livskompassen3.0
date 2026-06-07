import type { ThemePack } from './types';
import { THEME_SHARED_VARS } from './themeShared';

const auroraPrismVars = {
  ...THEME_SHARED_VARS,
  '--bg': '#020617',
  '--bg-dusk': '#050b14',
  '--surface': '#050b14',
  '--surface-2': '#09111e',
  '--surface-3': '#111b2d',
  '--accent': '#2dd4bf',
  '--accent-secondary': '#818cf8',
  '--accent-light': '#99f6e4',
  '--accent-ai': '#818cf8',
  '--accent-glow': 'rgba(45, 212, 191, 0.22)',
  '--accent-violet-glow': 'rgba(129, 140, 248, 0.18)',
  '--success': '#10b981',
  '--glass': 'rgba(5, 11, 20, 0.55)',
  '--glass-hero': 'rgba(5, 11, 20, 0.72)',
  '--border': 'rgba(45, 212, 191, 0.14)',
  '--border-strong': 'rgba(129, 140, 248, 0.28)',
  '--compass-disk': '#0d2838',
  /* Navigation lock — drawer/dock active gold */
  '--nav-active': '#d4af37',
  '--nav-active-glow': 'rgba(212, 175, 55, 0.12)',
  '--accent-gold': '#d4af37',
  /* Aurora decorative */
  '--aurora-teal': '#2dd4bf',
  '--aurora-violet': '#818cf8',
  '--prism-blur': '20px',
  '--prism-saturate': '140%',
} as const;

/** Style C — Aurora Prism (Theme Lab only until GODKÄND). */
export const THEME_PACK_REDESIGN_C: ThemePack[] = [
  {
    id: 'R-C-aurora-prism',
    label: 'Aurora Prism',
    description:
      'Futuristisk glas — norrsken teal + violet, deep void, mono data. Redesign Style C.',
    background: 'aurora',
    designPackId: 'D3',
    cssVars: { ...auroraPrismVars },
  },
];

export const REDESIGN_C_THEME_IDS = THEME_PACK_REDESIGN_C.map((p) => p.id);
