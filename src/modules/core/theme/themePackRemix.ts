import type { ThemePack } from './types';
import { THEME_SHARED_VARS } from './themeShared';

const shared = THEME_SHARED_VARS;

/** Remix B — Tema E palett + D1 designpaket-chrome (mix-E / hamn-kompass). */
export const REMIX_E_HAMN_THEME_ID = 'R-E-hamn-remix';

const remixEHamnVars = {
  ...shared,
  '--bg': '#020617',
  '--bg-dusk': '#050b14',
  '--surface': '#050b14',
  '--surface-2': '#09111e',
  '--surface-3': '#111b2d',
  '--accent': '#d4af37',
  '--accent-secondary': '#f59e0b',
  '--accent-light': '#fde68a',
  '--accent-ai': '#818cf8',
  '--accent-glow': 'rgba(212, 175, 55, 0.22)',
  '--success': '#10b981',
  '--glass': 'rgba(10, 22, 20, 0.68)',
  '--glass-hero': 'rgba(10, 22, 20, 0.82)',
  '--border': 'rgba(212, 175, 55, 0.14)',
  '--border-strong': 'rgba(212, 175, 55, 0.42)',
  '--compass-disk': '#0d3b3b',
  '--design-bg-image': 'url(/design/mockups/ref-hamn.png)',
  '--mockup-scenic-strength': '0.68',
} as const;

export const THEME_PACK_REMIX_E_HAMN: ThemePack = {
  id: REMIX_E_HAMN_THEME_ID,
  label: 'E + Hamn remix',
  description: 'Tema E guld/skymning + D1 chrome — centrerad rubrik, scenic hamn, radkort.',
  background: 'mockup-scenic',
  preview: '/design/galleri/mix-E-final-hem.png',
  designPackId: 'D1',
  cssVars: { ...remixEHamnVars },
};
