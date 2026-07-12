import type { ThemePack } from './types';
import { THEME_SHARED_VARS } from './themeShared';

/** Mockup v1 — Obsidian Depth + varmare brons + executive chrome (jun 2026). */
export const MIDNIGHT_EXECUTIVE_THEME_ID = 'ME-midnight-executive';

const midnightExecutiveVars = {
  ...THEME_SHARED_VARS,
  '--bg': '#020617',
  '--bg-dusk': '#050b14',
  '--surface': '#050b14',
  '--surface-2': '#09111e',
  '--surface-3': '#111b2d',
  '--accent': '#c9a66b',
  '--accent-secondary': '#9a7b2f',
  '--accent-ai': '#c9a66b',
  '--accent-light': '#e8d4a8',
  '--accent-glow': 'rgba(201, 166, 107, 0.28)',
  '--color-accent-gold': '#c9a66b',
  '--text-gold': '#e8d4a8',
  '--success': '#c9a66b',
  '--glass': 'rgba(9, 17, 30, 0.55)',
  '--glass-hero': 'rgba(2, 6, 23, 0.82)',
  '--border': 'rgba(201, 166, 107, 0.18)',
  '--border-strong': 'rgba(201, 166, 107, 0.42)',
  '--compass-disk': '#0a1019',
  '--od-graphite': '#0a1019',
  '--od-slate': '#141c2b',
  '--chrome-plate-a': 'rgba(20, 28, 43, 0.98)',
  '--chrome-plate-b': 'rgba(10, 16, 25, 0.96)',
  '--chrome-plate-c': 'rgba(2, 6, 23, 0.94)',
  '--chrome-rail-a': 'rgba(14, 22, 36, 0.97)',
  '--chrome-rail-b': 'rgba(9, 17, 30, 0.95)',
  '--chrome-rail-c': 'rgba(2, 6, 23, 0.93)',
  '--chrome-highlight': 'rgba(226, 232, 240, 0.1)',
  '--home-hero-gradient-top': '#0a1019',
  '--home-hero-gradient-mid': '#050b14',
  '--home-hero-gradient-bot': '#020617',
  '--design-bg-image': 'url(/design/home-hero-scenic.png)',
  '--ui-card-radius': '1.25rem',
} as const;

export const THEME_PACK_MIDNIGHT_EXECUTIVE: ThemePack[] = [
  {
    id: MIDNIGHT_EXECUTIVE_THEME_ID,
    label: 'Midnight Executive',
    description:
      'Mockup v1 — obsidian + varm brons (#c9a66b), executive chrome, platta midnight-kort.',
    background: 'obsidian',
    preview: '/docs/design/galleri/executive-home-extended-v1.png',
    cssVars: { ...midnightExecutiveVars },
    designPackId: 'D4',
  },
];

export function isMidnightExecutiveTheme(themeId: string): boolean {
  return themeId === MIDNIGHT_EXECUTIVE_THEME_ID;
}
