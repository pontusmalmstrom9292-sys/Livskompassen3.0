import { DEFAULT_THEME_ID } from './themeRegistry';

/**
 * Auto-modul → tema. Längsta prefix vinner.
 * Theme Pack J (xcc2026-05-25): ett tema per hub — se docs/design/themes/J-PACK-EIGHT-HUBS.md
 * Manuellt val i Inställningar överstyr när Auto modul är av.
 */
export const MODULE_THEME_MAP: { prefix: string; themeId: string }[] = [
  { prefix: '/widget/inspelning', themeId: 'J-valv-pansar' },
  { prefix: '/widget/anteckning', themeId: 'J-vardagen-orbit' },
  { prefix: '/widget/kompass', themeId: 'J-fyren-hem' },
  { prefix: '/widget/hamn', themeId: 'J-hamn-greyrock' },
  { prefix: '/widget/familjen', themeId: 'J-familjen-varm' },
  { prefix: '/widget', themeId: 'J-fyren-hem' },
  { prefix: '/barnporten', themeId: 'J-barnporten-ljus' },
  { prefix: '/dagbok', themeId: 'J-valv-pansar' },
  { prefix: '/valv', themeId: 'J-valv-pansar' },
  { prefix: '/dossier', themeId: 'J-valv-pansar' },
  { prefix: '/planering', themeId: 'J-planering-fyren' },
  { prefix: '/projekt', themeId: 'J-planering-fyren' },
  { prefix: '/familjen', themeId: 'J-familjen-varm' },
  { prefix: '/barnen', themeId: 'J-familjen-varm' },
  { prefix: '/hamn', themeId: 'J-hamn-greyrock' },
  { prefix: '/speglar', themeId: 'J-hamn-greyrock' },
  { prefix: '/mabra', themeId: 'J-mabra-lavendel' },
  { prefix: '/drogfrihet', themeId: 'J-mabra-lavendel' },
  { prefix: '/arbetsliv', themeId: 'J-vardagen-orbit' },
  { prefix: '/stampla', themeId: 'J-vardagen-orbit' },
  { prefix: '/kompasser', themeId: 'J-vardagen-orbit' },
  { prefix: '/ekonomi', themeId: 'J-vardagen-orbit' },
  { prefix: '/kunskap', themeId: 'J-vardagen-orbit' },
  { prefix: '/vardagen', themeId: 'J-vardagen-orbit' },
  { prefix: '/installningar', themeId: DEFAULT_THEME_ID },
  { prefix: '/', themeId: 'J-fyren-hem' },
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
