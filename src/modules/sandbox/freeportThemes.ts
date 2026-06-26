/** Design Freeport — lokala teman (skriver INTE till prod applyTheme). */

export type FreeportThemeId =
  | 'tactile-warm'
  | 'tactile-chrome'
  | 'tactile-cold'
  | 'tactile-slate'
  | 'tactile-obsidian'
  | 'executive-premium';

export type FreeportTheme = {
  id: FreeportThemeId;
  label: string;
  description: string;
};

export const FREEPORT_THEMES: FreeportTheme[] = [
  {
    id: 'tactile-warm',
    label: 'Varm koppar',
    description: 'Tactile Mid-Depth — jordnärt, ej guld',
  },
  {
    id: 'tactile-chrome',
    label: 'Neutral krom',
    description: 'Låg arousal, silveraccent',
  },
  {
    id: 'tactile-cold',
    label: 'Kall glas',
    description: 'Obsidian + blågrå accent',
  },
  {
    id: 'tactile-slate',
    label: 'Skiffer sammet',
    description: 'S1 Theme Lab — lila-grå, inset, Outfit',
  },
  {
    id: 'tactile-obsidian',
    label: 'Obsidian lager',
    description: 'S1 E — dämpat guld, Cinzel zon, Depth-linje',
  },
  {
    id: 'executive-premium',
    label: 'Executive Premium',
    description: 'Navy #07101D + guld #D4AF37 — Cormorant + Inter, 80/15/5',
  },
];

const STORAGE_KEY = 'lk.freeport.theme';

/** Executive Premium — ChatGPT Nordic Obsidian Calm palett (2026-06-25). */
export const DEFAULT_FREEPORT_THEME: FreeportThemeId = 'executive-premium';

export function loadFreeportTheme(): FreeportThemeId {
  if (typeof window === 'undefined') return DEFAULT_FREEPORT_THEME;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (
    raw === 'tactile-warm' ||
    raw === 'tactile-chrome' ||
    raw === 'tactile-cold' ||
    raw === 'tactile-slate' ||
    raw === 'tactile-obsidian' ||
    raw === 'executive-premium'
  )
    return raw;
  return DEFAULT_FREEPORT_THEME;
}

export function saveFreeportTheme(id: FreeportThemeId): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, id);
}
