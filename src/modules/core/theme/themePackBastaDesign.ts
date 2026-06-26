import type { ThemePack } from './types';
import { THEME_SHARED_VARS } from './themeShared';

/** Figma-export «bästa design» — Executive Midnight guld (#c9a435) jun 2026. */
export const BASTA_DESIGN_THEME_ID = 'ME-basta-design';

const bastaDesignVars = {
  ...THEME_SHARED_VARS,
  '--bg': '#080a12',
  '--bg-dusk': '#0a0c14',
  '--surface': '#10131e',
  '--surface-2': '#141824',
  '--surface-3': '#1a1e2e',
  '--accent': '#c9a435',
  '--accent-secondary': '#a88420',
  '--accent-light': '#f0ead8',
  '--accent-glow': 'rgba(201, 164, 53, 0.28)',
  '--color-accent-gold': '#c9a435',
  '--text-gold': '#f0ead8',
  '--success': '#4ade80',
  '--glass': 'rgba(8, 10, 18, 0.75)',
  '--glass-hero': 'rgba(8, 10, 18, 0.85)',
  '--border': 'rgba(201, 164, 53, 0.15)',
  '--border-strong': 'rgba(201, 164, 53, 0.4)',
  '--compass-disk': '#0a0c14',
  '--home-hero-gradient-top': '#10131e',
  '--home-hero-gradient-mid': '#080a12',
  '--home-hero-gradient-bot': '#080a12',
  '--design-bg-image': 'url(/design/home-hero-scenic.png)',
  '--ui-card-radius': '0.75rem',
} as const;

export const THEME_PACK_BASTA_DESIGN: ThemePack[] = [
  {
    id: BASTA_DESIGN_THEME_ID,
    label: 'Bästa design',
    description:
      'Figma-ref — marin #080a12, guld #c9a435, Cinzel + Lora, hero-reflektion + kompass-dock.',
    background: 'obsidian',
    preview: '/design/home-hero-scenic.png',
    cssVars: { ...bastaDesignVars },
    designPackId: 'D4',
  },
];

export function isBastaDesignTheme(themeId: string): boolean {
  return themeId === BASTA_DESIGN_THEME_ID;
}

export function isExecutiveHomeTheme(themeId: string): boolean {
  return themeId === BASTA_DESIGN_THEME_ID || themeId === 'ME-midnight-executive';
}
