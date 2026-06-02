import type { ThemePack } from './types';
import { THEME_SHARED_VARS } from './themeShared';

const shared = THEME_SHARED_VARS;

/** Bas — referens: användarens mockup-bilder (juni 2026). */
const mockupBase = {
  ...shared,
  '--bg': '#0a1614',
  '--bg-dusk': '#12151f',
  '--surface': '#0f1a18',
  '--surface-2': '#142220',
  '--surface-3': '#1a2b28',
  '--accent': '#d4af37',
  '--accent-secondary': '#f59e0b',
  '--accent-light': '#f0e0a8',
  '--accent-glow': 'rgba(212, 175, 55, 0.28)',
  '--success': '#6b8f71',
  '--glass': 'rgba(10, 22, 20, 0.68)',
  '--glass-hero': 'rgba(10, 22, 20, 0.82)',
  '--border': 'rgba(212, 175, 55, 0.18)',
  '--border-strong': 'rgba(212, 175, 55, 0.42)',
  '--compass-disk': '#0d3b3b',
  '--mockup-scenic-strength': '0.72',
} as const;

/**
 * Fyra helapp-varianter — så nära mockup-bilderna som möjligt.
 * Välj på /dev/theme-lab → «Mockup (4)».
 */
export const THEME_PACK_MOCKUP: ThemePack[] = [
  {
    id: 'M1-mockup-meny',
    label: 'Mockup 1 — Sidomeny',
    description:
      'Flat meny med guld cirkel-ikoner, LIVSKOMPASSEN serif, berg i botten (referens: drawer-mockup).',
    background: 'mockup-scenic',
    preview: '/design/home-hero-scenic.png',
    cssVars: {
      ...mockupBase,
      '--accent-glow': 'rgba(212, 175, 55, 0.22)',
      '--glass': 'rgba(8, 14, 18, 0.58)',
      '--mockup-scenic-strength': '0.78',
    },
  },
  {
    id: 'M2-mockup-hamn',
    label: 'Mockup 2 — Hem & Hamn',
    description:
      'Stor kompass-ros, Dagens riktning, dock-triad, «God kväll» + tagline (referens: Hamn-mobil).',
    background: 'mockup-scenic',
    preview: '/design/themes/G-varm-hamn/00-hero-livskompass.png',
    cssVars: {
      ...mockupBase,
      '--compass-disk': '#0d3b3b',
      '--accent-glow': 'rgba(212, 175, 55, 0.32)',
      '--border-strong': 'rgba(212, 175, 55, 0.52)',
      '--glass-hero': 'rgba(10, 22, 20, 0.75)',
      '--mockup-scenic-strength': '0.65',
    },
  },
  {
    id: 'M3-mockup-familjen',
    label: 'Mockup 3 — Familjen',
    description:
      'Varm espresso/roséguld, kortlista med ikon vänster (referens: Familjen + Minnesankare).',
    background: 'mockup-warm',
    preview: '/design/themes/G-varm-hamn/03-barnfokus.png',
    cssVars: {
      ...mockupBase,
      '--bg': '#1a1410',
      '--bg-dusk': '#151008',
      '--surface': '#221c16',
      '--surface-2': '#2a2218',
      '--surface-3': '#332a1f',
      '--accent': '#d4af37',
      '--accent-secondary': '#c9a87c',
      '--accent-light': '#e8d48a',
      '--accent-glow': 'rgba(201, 168, 124, 0.24)',
      '--glass': 'rgba(26, 20, 16, 0.72)',
      '--compass-disk': '#1a1410',
      '--mockup-scenic-strength': '0.55',
    },
  },
  {
    id: 'M4-mockup-kompis',
    label: 'Mockup 4 — Kompis / aurora',
    description:
      'Ljusare glas, guldkantade kort, aurora-känsla (referens: Kompis-chatt + norrsken).',
    background: 'mockup-aurora',
    preview: '/design/references/E-home-hero-kanon.png',
    cssVars: {
      ...mockupBase,
      '--bg': '#081218',
      '--bg-dusk': '#0e1a22',
      '--surface': '#0c161c',
      '--surface-2': '#122028',
      '--accent-glow': 'rgba(212, 175, 55, 0.2)',
      '--glass': 'rgba(12, 24, 32, 0.62)',
      '--border': 'rgba(212, 175, 55, 0.22)',
      '--mockup-scenic-strength': '0.5',
    },
  },
];

export const MOCKUP_THEME_IDS = THEME_PACK_MOCKUP.map((p) => p.id) as readonly string[];

export function isMockupTheme(themeId: string): boolean {
  return themeId.startsWith('M') && themeId.includes('mockup');
}
