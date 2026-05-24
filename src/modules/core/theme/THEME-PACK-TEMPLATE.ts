import type { ThemePack } from './types';

/** Copy into themeRegistry.ts THEME_REGISTRY when adding a new skin. */
export const THEME_PACK_TEMPLATE: ThemePack = {
  id: 'J-namn',
  label: 'Mitt nya tema',
  description: 'Kort beskrivning för /dev/themes.',
  background: 'texture-stone',
  preview: '/docs/design/themes/I-architect-vault/J-namn/preview.png',
  cssVars: {
    '--bg': '#0a0a0a',
    '--bg-dusk': '#121212',
    '--surface': '#111111',
    '--surface-2': '#1a1a1a',
    '--surface-3': '#222222',
    '--text': '#f5f0e8',
    '--text-muted': '#c4bdb4',
    '--text-dim': '#a8a29e',
    '--accent': '#d4af37',
    '--accent-secondary': '#f59e0b',
    '--accent-light': '#e8d48a',
    '--accent-glow': 'rgba(212, 175, 55, 0.18)',
    '--success': '#6b8f71',
    '--warning': '#b45309',
    '--danger': '#dc2626',
    '--glass': 'rgba(8, 8, 8, 0.72)',
    '--glass-hero': 'rgba(8, 8, 8, 0.85)',
    '--border': 'rgba(212, 175, 55, 0.12)',
    '--border-strong': 'rgba(212, 175, 55, 0.45)',
    '--compass-disk': '#1a1a1a',
  },
};
