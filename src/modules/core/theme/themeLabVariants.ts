import type { ThemePack } from './types';
import { THEME_BY_ID } from './themeRegistry';
import { THEME_BRUSHED_BRASS_NEU } from './themePackBrushedBrass';

const stone = THEME_BY_ID['I-stone'];

/** Utkast — visas endast i /dev/theme-lab tills godkända. */
export const THEME_LAB_DRAFTS: ThemePack[] = [
  {
    ...THEME_BRUSHED_BRASS_NEU,
    description: 'VINNARE design sandbox — deep navy + brushed brass neumorf (prod default).',
  },
  {
    ...stone,
    id: 'I-stone-draft-photo',
    label: 'Stone — tydligare foto',
    description: 'Ljusare overlay så sjö/skymning syns mer (test).',
    preview: '/design/home-hero-scenic.png',
    cssVars: {
      ...stone.cssVars,
      '--glass': 'rgba(8, 8, 8, 0.55)',
      '--glass-hero': 'rgba(8, 8, 8, 0.72)',
    },
  },
  {
    ...stone,
    id: 'I-stone-draft-glow',
    label: 'Stone — starkare guld',
    description: 'Mer guld glow på kompass och kanter (test).',
    preview: stone.preview,
    cssVars: {
      ...stone.cssVars,
      '--accent-glow': 'rgba(212, 175, 55, 0.32)',
      '--border-strong': 'rgba(212, 175, 55, 0.58)',
      '--accent-light': '#f0e0a8',
    },
  },
  {
    ...stone,
    id: 'I-stone-draft-twilight',
    label: 'Stone — skymning',
    description: 'Kallare skymningsbas, mjukare guld — kväll vid sjön.',
    preview: '/design/home-hero-scenic.png',
    cssVars: {
      ...stone.cssVars,
      '--bg': '#060a10',
      '--bg-dusk': '#0c121c',
      '--surface': '#0e1218',
      '--surface-2': '#141a22',
      '--surface-3': '#1a222c',
      '--accent': '#c9a227',
      '--accent-light': '#dcc98a',
      '--accent-glow': 'rgba(201, 162, 39, 0.14)',
      '--glass': 'rgba(6, 10, 16, 0.62)',
      '--glass-hero': 'rgba(6, 10, 16, 0.78)',
      '--border': 'rgba(201, 162, 39, 0.1)',
      '--border-strong': 'rgba(201, 162, 39, 0.38)',
      '--compass-disk': '#121820',
    },
  },
  {
    ...stone,
    id: 'I-stone-draft-bronze',
    label: 'Stone — brons',
    description: 'Varmare brons/roséguld — mindre kylig än standardguld.',
    preview: stone.preview,
    cssVars: {
      ...stone.cssVars,
      '--accent': '#c9a66b',
      '--accent-secondary': '#d4a574',
      '--accent-light': '#e8d0b0',
      '--accent-glow': 'rgba(201, 166, 107, 0.22)',
      '--border': 'rgba(201, 166, 107, 0.14)',
      '--border-strong': 'rgba(201, 166, 107, 0.48)',
      '--compass-disk': '#1a1410',
    },
  },
  {
    ...stone,
    id: 'I-stone-draft-matte',
    label: 'Stone — matt',
    description: 'Plattare glas, svagare glow — lägre visuellt brus (ADHD).',
    preview: stone.preview,
    cssVars: {
      ...stone.cssVars,
      '--accent-glow': 'rgba(212, 175, 55, 0.08)',
      '--glass': 'rgba(8, 8, 8, 0.9)',
      '--glass-hero': 'rgba(8, 8, 8, 0.94)',
      '--border': 'rgba(212, 175, 55, 0.08)',
      '--border-strong': 'rgba(212, 175, 55, 0.32)',
      '--surface-2': '#1c1c1c',
      '--surface-3': '#262626',
    },
  },
];

export const THEME_LAB_DRAFT_IDS = THEME_LAB_DRAFTS.map((d) => d.id);
