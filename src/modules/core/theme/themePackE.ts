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
    '--accent-secondary': '#9a7b2f',
    '--accent-light': '#fde68a',
    '--accent-ai': '#c9a66b',
    '--accent-glow': 'rgba(212, 175, 55, 0.18)',
    '--success': '#c9a66b',
    '--glass': 'rgba(5, 11, 20, 0.9)',
    '--glass-hero': 'rgba(2, 6, 23, 0.94)',
    '--border': 'rgba(212, 175, 55, 0.12)',
    '--border-strong': 'rgba(212, 175, 55, 0.22)',
    '--compass-disk': '#0d3b3b',
  },
};

export const E_HUB_SURFACE_TINTS: Record<string, Partial<ThemePack['cssVars']>> = {
  mabra: { '--surface-2': '#1a1520', '--surface-3': '#221c28' },
  planering: { '--surface-2': '#161410', '--surface-3': '#1e1a14' },
  familjen: { '--surface-2': '#181410', '--surface-3': '#221c16' },
};

/**
 * Darkest Mode — Extra låg kontrast för sena kvällar/migrän.
 * Bygger på E-skymning men mörkar ner alla ytor till nära ren svart.
 */
export const THEME_PACK_E_DARKEST: ThemePack = {
  id: 'E-skymning-darkest',
  label: 'Nordic Skymning (Darkest)',
  description: 'Extremt lågkontrast för sena kvällar, migrän och kognitiv avlastning.',
  background: 'aurora',
  preview: '/design/references/E-home-hero-kanon.png', // Or another appropriate preview
  cssVars: {
    ...shared,
    '--bg': '#000000',
    '--bg-dusk': '#020202',
    '--surface': '#020202',
    '--surface-2': '#040404',
    '--surface-3': '#080808',
    '--accent': '#9f852b', // Dimmer gold
    '--accent-secondary': '#7a6530',
    '--accent-light': '#b4a055',
    '--accent-ai': '#9f852b',
    '--accent-glow': 'rgba(159, 133, 43, 0.1)',
    '--success': '#9f852b',
    '--glass': 'rgba(2, 2, 2, 0.95)',
    '--glass-hero': 'rgba(0, 0, 0, 0.98)',
    '--border': 'rgba(255, 255, 255, 0.05)',
    '--border-strong': 'rgba(255, 255, 255, 0.1)',
    '--compass-disk': '#021010',
    '--text': 'rgba(255, 255, 255, 0.65)',
    '--text-muted': 'rgba(255, 255, 255, 0.45)',
    '--text-dim': 'rgba(255, 255, 255, 0.3)',
  },
};

export const E_PROD_THEME_ID = THEME_PACK_E_PROD.id;
