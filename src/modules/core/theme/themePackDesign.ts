import type { ThemePack } from './types';
import { THEME_SHARED_VARS } from './themeShared';

const shared = THEME_SHARED_VARS;

const base = {
  ...shared,
  '--accent': '#d4af37',
  '--accent-secondary': '#f59e0b',
  '--accent-light': '#f0e0a8',
  '--accent-glow': 'rgba(212, 175, 55, 0.3)',
  '--success': '#6b8f71',
  '--border': 'rgba(212, 175, 55, 0.2)',
  '--border-strong': 'rgba(212, 175, 55, 0.45)',
  '--compass-disk': '#0d3b3b',
  '--ui-card-radius': '1.25rem',
  '--ui-header-height': '4.5rem',
} as const;

/**
 * Fem hela designpaket — färger, bakgrund, header, dock, kort, meny.
 * Välj i /dev/theme-lab → «Designpaket (5)».
 */
export const THEME_PACK_DESIGN: ThemePack[] = [
  {
    id: 'D1-hamn-kompass',
    label: 'D1 — Hamn & kompass',
    description: 'Referens: Den trygga hamnen — orbit-kompass, guld dock Familjen·Hamn·Valv.',
    background: 'mockup-scenic',
    preview: '/design/mockups/ref-hamn.png',
    designPackId: 'D1',
    cssVars: {
      ...base,
      '--bg': '#0a1614',
      '--bg-dusk': '#12151f',
      '--surface': '#0f1a18',
      '--surface-2': '#142220',
      '--surface-3': '#1a2b28',
      '--glass': 'rgba(10, 22, 20, 0.65)',
      '--glass-hero': 'rgba(10, 22, 20, 0.8)',
      '--design-bg-image': 'url(/design/mockups/ref-hamn.png)',
    },
  },
  {
    id: 'D2-familjen-kort',
    label: 'D2 — Familjen kort',
    description: 'Referens: Familjen — centrerad rubrik, radkort med guldikon + chevron.',
    background: 'mockup-warm',
    preview: '/design/mockups/ref-familjen.png',
    designPackId: 'D2',
    cssVars: {
      ...base,
      '--bg': '#1a1410',
      '--bg-dusk': '#151008',
      '--surface': '#221c16',
      '--surface-2': '#2a2218',
      '--surface-3': '#332a1f',
      '--glass': 'rgba(26, 20, 16, 0.7)',
      '--accent-glow': 'rgba(201, 168, 124, 0.26)',
      '--design-bg-image': 'url(/design/mockups/ref-familjen.png)',
    },
  },
  {
    id: 'D3-minnes-timeline',
    label: 'D3 — Minnes tidslinje',
    description: 'Referens: Minnesankare — vertikal guldlina, gradient CTA «Spara minne».',
    background: 'mockup-scenic',
    preview: '/design/mockups/ref-minnes.png',
    designPackId: 'D3',
    cssVars: {
      ...base,
      '--bg': '#0c1218',
      '--bg-dusk': '#101820',
      '--surface': '#121a20',
      '--surface-2': '#182228',
      '--glass': 'rgba(12, 18, 24, 0.72)',
      '--design-bg-image': 'url(/design/mockups/ref-minnes.png)',
    },
  },
  {
    id: 'D4-flat-luxe',
    label: 'D4 — Flat luxe',
    description: 'Tunn guld meny, luftig header, subtil scenic — ren mockup-meny.',
    background: 'mockup-scenic',
    preview: '/design/home-hero-scenic.png',
    designPackId: 'D4',
    cssVars: {
      ...base,
      '--bg': '#080c10',
      '--bg-dusk': '#0e141a',
      '--surface': '#101418',
      '--glass': 'rgba(8, 12, 16, 0.55)',
      '--border-strong': 'rgba(212, 175, 55, 0.38)',
      '--design-bg-image': 'url(/design/home-hero-scenic.png)',
    },
  },
  {
    id: 'D5-aurora-glas',
    label: 'D5 — Aurora glas',
    description: 'Ljus aurora, stark glöd, mjukare kort — Kompis/norrsken-känsla.',
    background: 'mockup-aurora',
    preview: '/design/references/E-home-hero-kanon.png',
    designPackId: 'D5',
    cssVars: {
      ...base,
      '--bg': '#081218',
      '--bg-dusk': '#0e1a22',
      '--surface': '#0c161c',
      '--accent-glow': 'rgba(212, 175, 55, 0.22)',
      '--glass': 'rgba(12, 24, 32, 0.58)',
      '--design-bg-image': 'url(/design/home-hero-scenic.png)',
    },
  },
];

export const DESIGN_PACK_THEME_IDS = THEME_PACK_DESIGN.map((p) => p.id);

export function isDesignPackTheme(themeId: string): boolean {
  return /^D[1-5]-/.test(themeId);
}
