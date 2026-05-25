import { DEFAULT_THEME_ID } from './themeRegistry';

/** Route prefix → default theme pack id. Longest match wins. */
export const MODULE_THEME_MAP: { prefix: string; themeId: string }[] = [
  { prefix: '/hamn', themeId: 'I-hamn' },
  { prefix: '/mabra', themeId: 'G-varm-hamn' },
  { prefix: '/familjen', themeId: 'G-varm-hamn' },
  { prefix: '/barnen', themeId: 'G-varm-hamn' },
  { prefix: '/vardagen', themeId: 'I-alchemical' },
  { prefix: '/kompasser', themeId: 'I-alchemical' },
  { prefix: '/ekonomi', themeId: 'I-alchemical' },
  { prefix: '/kunskap', themeId: 'I-alchemical' },
  { prefix: '/widget', themeId: 'I-glass' },
  { prefix: '/dagbok', themeId: 'I-stone' },
  { prefix: '/valv', themeId: 'I-stone' },
  { prefix: '/planering', themeId: 'I-stone' },
  { prefix: '/projekt', themeId: 'I-stone' },
  { prefix: '/dossier', themeId: 'I-stone' },
  /** Hem — Architect Stone + scenic bg (mockup I-stone) */
  { prefix: '/', themeId: 'I-stone' },
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
