import type { ThemePack } from './types';
import { THEME_SHARED_VARS } from './themeShared';

/**
 * Design sandbox vinnare — Brushed Brass Neumorf v2
 * Mockup: docs/design-sandbox/mockups/01-brushed-brass-neu.html
 * Ref: docs/design-sandbox/references/life-os-board-ref.png
 */
export const THEME_BRUSHED_BRASS_NEU: ThemePack = {
  id: 'SB-brushed-brass-neu',
  label: 'Brushed Brass Neumorf',
  description: 'Midnight navy, guld Fyren, teal primär-CTA — LIFE OS linje.',
  background: 'obsidian',
  preview: '/design/themes/I-architect-vault/00-smart-widget-expanded.png',
  cssVars: {
    ...THEME_SHARED_VARS,
    '--bg': '#051220',
    '--bg-dusk': '#0b1320',
    '--surface': '#121b2e',
    '--surface-2': '#1a2438',
    '--surface-3': '#222d42',
    '--accent': '#d4af37',
    '--accent-secondary': '#2ec4b6',
    '--accent-light': '#e8d48a',
    '--accent-dim': '#9a7b2f',
    '--accent-ai': '#2ec4b6',
    '--accent-glow': 'rgba(212, 175, 55, 0.2)',
    '--success': '#2ec4b6',
    '--glass': 'rgba(5, 18, 32, 0.82)',
    '--glass-hero': 'rgba(5, 18, 32, 0.92)',
    '--border': 'rgba(212, 175, 55, 0.14)',
    '--border-strong': 'rgba(212, 175, 55, 0.48)',
    '--compass-disk': '#121b2e',
    '--text': '#eaeaea',
    '--text-muted': '#94a3b8',
    '--text-dim': '#64748b',
    '--danger': '#e94c4c',
  },
};

export const BRUSHED_BRASS_THEME_ID = THEME_BRUSHED_BRASS_NEU.id;
