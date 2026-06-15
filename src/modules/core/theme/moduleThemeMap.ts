import { DEFAULT_THEME_ID } from './themeRegistry';

/** Helapp — samma designpaket överallt (byter i Theme Lab). */
const D = DEFAULT_THEME_ID;

export const MODULE_THEME_MAP: { prefix: string; themeId: string }[] = [
  { prefix: '/widget/inspelning', themeId: D },
  { prefix: '/widget/anteckning', themeId: D },
  { prefix: '/widget/kompass', themeId: D },
  { prefix: '/widget/hamn', themeId: D },
  { prefix: '/widget/familjen', themeId: D },
  { prefix: '/widget', themeId: D },
  { prefix: '/barnporten', themeId: D },
  { prefix: '/hjartat', themeId: D },
  { prefix: '/valvet', themeId: 'J-valv-pansar' },
  { prefix: '/dagbok', themeId: 'J-valv-pansar' },
  { prefix: '/valv', themeId: 'J-valv-pansar' },
  { prefix: '/dossier', themeId: 'J-valv-pansar' },
  { prefix: '/planering', themeId: 'J-planering-fyren' },
  { prefix: '/projekt', themeId: 'J-planering-fyren' },
  { prefix: '/familj', themeId: D },
  { prefix: '/familjen', themeId: D },
  { prefix: '/barnen', themeId: D },
  { prefix: '/hamn', themeId: D },
  { prefix: '/speglar', themeId: D },
  { prefix: '/mabra', themeId: D },
  { prefix: '/drogfrihet', themeId: D },
  { prefix: '/liv', themeId: D },
  { prefix: '/arbetsliv', themeId: D },
  { prefix: '/stampla', themeId: D },
  { prefix: '/kompasser', themeId: D },
  { prefix: '/ekonomi', themeId: D },
  { prefix: '/kunskap', themeId: D },
  { prefix: '/vardagen', themeId: D },
  { prefix: '/kompis', themeId: D },
  { prefix: '/installningar', themeId: D },
  { prefix: '/', themeId: D },
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
