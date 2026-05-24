import { getTheme, DEFAULT_THEME_ID } from './themeRegistry';

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
  const pack = getTheme(themeId);
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
