import type { ThemePack } from './types';
import { THEME_SHARED_VARS } from './themeShared';

/** Låst 2026-06-14 — Obsidian Depth (fylligare 3D + glass, guld endast). */
export const OBSIDIAN_DEPTH_THEME_ID = 'OD-obsidian-depth';

const obsidianDepthVars = {
  ...THEME_SHARED_VARS,
  '--bg': '#020617',
  '--bg-dusk': '#050b14',
  '--surface': '#050b14',
  '--surface-2': '#09111e',
  '--surface-3': '#111b2d',
  '--accent': '#d4af37',
  '--accent-secondary': '#9a7b2f',
  '--accent-light': '#e8c96a',
  '--accent-glow': 'rgba(212, 175, 55, 0.28)',
  '--success': '#10b981',
  '--glass': 'rgba(9, 17, 30, 0.55)',
  '--glass-hero': 'rgba(2, 6, 23, 0.82)',
  '--border': 'rgba(212, 175, 55, 0.18)',
  '--border-strong': 'rgba(212, 175, 55, 0.42)',
  '--compass-disk': '#0a1019',
  '--od-graphite': '#0a1019',
  '--od-slate': '#141c2b',
} as const;

export const THEME_PACK_OBSIDIAN_DEPTH: ThemePack[] = [
  {
    id: OBSIDIAN_DEPTH_THEME_ID,
    label: 'Obsidian Depth',
    description:
      'Låst 3D-evolution — glassmorphism, taktil djup, guld (#d4af37) endast. Mockup: /dev/obsidian-depth.',
    background: 'obsidian',
    preview: '/docs/design/theme-lab/obsidian-depth-mobile.png',
    cssVars: { ...obsidianDepthVars },
  },
];
