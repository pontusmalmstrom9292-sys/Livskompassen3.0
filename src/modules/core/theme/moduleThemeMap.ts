import { DEFAULT_THEME_ID } from './themeRegistry';

/** Architect Stone (I-stone) på alla flikar — mockup-kanon. */
export const MODULE_THEME_MAP: { prefix: string; themeId: string }[] = [
  { prefix: '/hamn', themeId: DEFAULT_THEME_ID },
  { prefix: '/mabra', themeId: DEFAULT_THEME_ID },
  { prefix: '/familjen', themeId: DEFAULT_THEME_ID },
  { prefix: '/barnen', themeId: DEFAULT_THEME_ID },
  { prefix: '/vardagen', themeId: DEFAULT_THEME_ID },
  { prefix: '/kompasser', themeId: DEFAULT_THEME_ID },
  { prefix: '/ekonomi', themeId: DEFAULT_THEME_ID },
  { prefix: '/kunskap', themeId: DEFAULT_THEME_ID },
  { prefix: '/widget', themeId: DEFAULT_THEME_ID },
  { prefix: '/dagbok', themeId: DEFAULT_THEME_ID },
  { prefix: '/valv', themeId: DEFAULT_THEME_ID },
  { prefix: '/planering', themeId: DEFAULT_THEME_ID },
  { prefix: '/projekt', themeId: DEFAULT_THEME_ID },
  { prefix: '/dossier', themeId: DEFAULT_THEME_ID },
  { prefix: '/', themeId: DEFAULT_THEME_ID },
];

const AUTO_KEY = 'livskompassen_theme_auto_module';

export function getAutoModuleThemesEnabled(): boolean {
  try {
    const v = localStorage.getItem(AUTO_KEY);
    return v !== 'false';
  } catch {
    return true;
  }
}

export function setAutoModuleThemesEnabled(enabled: boolean): void {
  try {
    localStorage.setItem(AUTO_KEY, enabled ? 'true' : 'false');
  } catch {
    /* ignore */
  }
}

export function resolveThemeForPath(pathname: string): string {
  const sorted = [...MODULE_THEME_MAP].sort((a, b) => b.prefix.length - a.prefix.length);
  for (const { prefix, themeId } of sorted) {
    if (prefix === '/' && pathname === '/') return themeId;
    if (prefix !== '/' && pathname.startsWith(prefix)) return themeId;
  }
  return DEFAULT_THEME_ID;
}
