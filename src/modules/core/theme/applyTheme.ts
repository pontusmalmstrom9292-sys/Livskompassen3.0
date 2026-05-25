import { THEME_LAB_DRAFTS } from './themeLabVariants';
import { getTheme, DEFAULT_THEME_ID } from './themeRegistry';
import type { ThemePack } from './types';

function resolveThemePack(themeId: string): ThemePack {
  const draft = THEME_LAB_DRAFTS.find((d) => d.id === themeId);
  if (draft) return draft;
  return getTheme(themeId);
}

const STORAGE_KEY = 'livskompassen_theme_override';

export function getStoredThemeOverride(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

export function setStoredThemeOverride(id: string | null): void {
  try {
    if (id) localStorage.setItem(STORAGE_KEY, id);
    else localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

export function applyTheme(themeId: string): void {
  const pack = resolveThemePack(themeId);
  const root = document.documentElement;

  root.dataset.theme = pack.id;
  root.dataset.themeBg = pack.background;

  Object.entries(pack.cssVars).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });

  root.style.setProperty('--bg-teal-deep', pack.cssVars['--bg'] ?? '#0a0a0a');
  root.style.setProperty('--text-gold', pack.cssVars['--accent'] ?? '#d4af37');
}

export function applyDefaultTheme(): void {
  const override = getStoredThemeOverride();
  applyTheme(override ?? DEFAULT_THEME_ID);
}
