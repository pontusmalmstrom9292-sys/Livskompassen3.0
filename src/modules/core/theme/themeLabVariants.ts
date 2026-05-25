import type { ThemePack } from './types';
import { THEME_BY_ID } from './themeRegistry';

const stone = THEME_BY_ID['I-stone'];

/** Utkast — visas endast i /dev/theme-lab tills godkända. */
export const THEME_LAB_DRAFTS: ThemePack[] = [
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
];
