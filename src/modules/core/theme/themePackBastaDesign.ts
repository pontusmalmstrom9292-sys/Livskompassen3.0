import type { ThemePack } from './types';
import { THEME_SHARED_VARS } from './themeShared';

/** Figma-export «bästa design» — Executive Midnight guld (#c9a435) jun 2026. */
export const BASTA_DESIGN_THEME_ID = 'ME-basta-design';

const bastaDesignVars = {
  ...THEME_SHARED_VARS,
  '--bg': '#07101d',
  '--bg-dusk': '#0d1728',
  '--surface': '#0d1728',
  '--surface-2': '#132035',
  '--surface-3': '#15233a',
  '--accent': '#d4af37',
  '--accent-secondary': '#b89224',
  '--accent-light': '#dcc06e',
  '--accent-glow': 'rgba(212, 175, 55, 0.18)',
  '--color-accent-gold': '#d4af37',
  '--text-gold': '#dcc06e',
  '--success': '#4c9b70',
  '--glass': 'rgba(24, 40, 68, 0.75)',
  '--glass-hero': 'rgba(7, 16, 29, 0.88)',
  '--border': 'rgba(255, 255, 255, 0.05)',
  '--border-strong': 'rgba(212, 175, 55, 0.18)',
  '--compass-disk': '#0d1728',
  '--home-hero-gradient-top': '#15233a',
  '--home-hero-gradient-mid': '#0d1728',
  '--home-hero-gradient-bot': '#07101d',
  '--design-bg-image': 'url(/design/home-hero-scenic.png)',
  '--ui-card-radius': '1.5rem',
} as const;

export const THEME_PACK_BASTA_DESIGN: ThemePack[] = [
  {
    id: BASTA_DESIGN_THEME_ID,
    label: 'Bästa design',
    description:
      'Enda prod-tema — marin #07101D, guld #D4AF37, Cormorant + Inter, hero-reflektion + kompass-dock.',
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
