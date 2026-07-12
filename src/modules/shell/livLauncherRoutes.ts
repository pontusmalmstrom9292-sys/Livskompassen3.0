import { vaultDrawerPath } from '@/core/navigation/navTruth';

/** Launcher-mål — tunga moduler får egen route (ingen nested TabBar). */
export const LIV_LAUNCHER_EXTERNAL: Record<string, string> = {
  handling: '/planering?tab=handling',
  inkorg: '/planering?tab=inkorg',
  inkast: '/planering/input?inputMode=inkast',
  planering: '/planering?tab=handling',
  projekt: '/projekt',
  arbetsliv: '/arbetsliv',
  drogfrihet: '/familjen?tab=drogfrihet',
  tidrapportering: '/arbetsliv',
};

/** MåBra hybrid-8 (M3.0-B) visas inline med pelarkort — djup-länkar via `/mabra/*`. */
export const LIV_LAUNCHER_INLINE_TABS = new Set(['kompasser', 'ekonomi', 'mabra']);

export function resolveLivLegacyTabRedirect(tab: string | null): string | null {
  if (!tab) return null;
  if (tab === 'kunskap') return vaultDrawerPath('kunskapsbank');
  if (LIV_LAUNCHER_INLINE_TABS.has(tab)) return null;
  return LIV_LAUNCHER_EXTERNAL[tab] ?? null;
}
