import type { ThemePack } from './types';
import { THEME_SHARED_VARS } from './themeShared';

const shared = THEME_SHARED_VARS;

/**
 * Theme Pack E — Nordic Skymning + guld (prod).
 * Kanon: docs/design/themes/E-aurora-obsidian-compass/THEME-E-SPEC.md
 */
export const THEME_PACK_E_PROD: ThemePack = {
  id: 'E-skymning-prod',
  label: 'Nordic Skymning (E)',
  description: 'Tema E — skog-teal, guld chrome, aurora ambient. Helapp default.',
  background: 'aurora',
  preview: '/design/references/E-home-hero-kanon.png',
  cssVars: {
    ...shared,
    '--bg': '#020617',
    '--bg-dusk': '#050b14',
    '--surface': '#050b14',
    '--surface-2': '#09111e',
    '--surface-3': '#111b2d',
    '--accent': '#d4af37',
    '--accent-secondary': '#6366f1',
    '--accent-light': '#fde68a',
    '--accent-ai': '#818cf8',
    '--accent-glow': 'rgba(212, 175, 55, 0.18)',
    '--success': '#10b981',
    '--glass': 'rgba(5, 11, 20, 0.9)',
    '--glass-hero': 'rgba(2, 6, 23, 0.94)',
    '--border': 'rgba(212, 175, 55, 0.12)',
    '--border-strong': 'rgba(99, 102, 241, 0.22)',
    '--compass-disk': '#0d3b3b',
  },
};

/** Subtil hub-tint på ytor — chrome förblir guld via COLOR-POLICY. */
export const E_HUB_SURFACE_TINTS: Record<string, Partial<ThemePack['cssVars']>> = {
  mabra: { '--surface-2': '#1a1520', '--surface-3': '#221c28' },
  planering: { '--surface-2': '#161410', '--surface-3': '#1e1a14' },
  familjen: { '--surface-2': '#181410', '--surface-3': '#221c16' },
};

export const E_PROD_THEME_ID = THEME_PACK_E_PROD.id;
