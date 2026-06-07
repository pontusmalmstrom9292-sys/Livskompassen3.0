import { THEME_APPLIED_EVENT } from './themeEvents';
import { THEME_LAB_DRAFTS } from './themeLabVariants';
import { OBSIDIAN_DEPTH_THEME_ID } from './themePackObsidianDepth';
import { REDESIGN_A_THEME_ID } from './themePackRedesignA';
import { getTheme, DEFAULT_THEME_ID, resolveThemeId } from './themeRegistry';
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
  const pack = resolveThemePack(resolveThemeId(themeId));
  const root = document.documentElement;

  root.dataset.theme = pack.id;
  root.dataset.themeBg = pack.background;

  if (pack.designPackId) {
    root.dataset.designPack = pack.designPackId;
  } else {
    delete root.dataset.designPack;
  }

  if (pack.id === REDESIGN_A_THEME_ID || pack.id === OBSIDIAN_DEPTH_THEME_ID) {
    root.dataset.panelStyle = 'obsidian';
  } else if (pack.id === 'R-C-aurora-prism') {
    root.dataset.panelStyle = 'aurora';
  } else {
    delete root.dataset.panelStyle;
  }

  Object.entries(pack.cssVars).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });

  root.style.setProperty('--bg-teal-deep', pack.cssVars['--bg'] ?? '#0a0a0a');
  root.style.setProperty('--text-gold', pack.cssVars['--accent'] ?? '#d4af37');

  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent(THEME_APPLIED_EVENT, { detail: { themeId: pack.id } }),
    );
  }
}

export function applyDefaultTheme(): void {
  const override = getStoredThemeOverride();
  applyTheme(override ?? DEFAULT_THEME_ID);
}
