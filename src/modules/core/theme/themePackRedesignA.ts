import type { ThemePack } from './types';
import { THEME_SHARED_VARS } from './themeShared';

/** Canonical id — Style A Nordic Precision (Theme Lab until GODKÄND in VARIANTS.md). */
export const REDESIGN_A_THEME_ID = 'R-A-nordic-precision';

const nordicPrecisionVars = {
  ...THEME_SHARED_VARS,
  '--bg': '#0f1419',
  '--bg-dusk': '#131820',
  '--surface': '#131820',
  '--surface-2': '#1a2332',
  '--surface-3': '#243044',
  '--accent': '#38bdf8',
  '--accent-secondary': '#94a3b8',
  '--accent-light': '#cbd5e1',
  '--accent-glow': 'rgba(56, 189, 248, 0.12)',
  '--success': '#10b981',
  '--glass': 'rgba(19, 24, 32, 0.88)',
  '--glass-hero': 'rgba(19, 24, 32, 0.94)',
  '--border': 'rgba(148, 163, 184, 0.18)',
  '--border-strong': 'rgba(56, 189, 248, 0.22)',
  '--compass-disk': '#243044',
  '--nav-active': '#c9a227',
  '--nav-active-glow': 'rgba(201, 162, 39, 0.1)',
  '--radius-sm': '8px',
  '--radius-md': '12px',
  '--radius-lg': '16px',
  '--prism-blur': '8px',
} as const;

export const THEME_PACK_REDESIGN_A: ThemePack[] = [
  {
    id: REDESIGN_A_THEME_ID,
    label: 'Nordic Precision',
    description: 'Kirurgisk nordisk — isblå CTA, silver chrome, minimal guld nav.',
    background: 'obsidian',
    preview: '/design/redesign-proposals/style-a/preview-hero.png',
    designPackId: 'D4',
    cssVars: { ...nordicPrecisionVars },
  },
];
