import { vaultDrawerPath } from '@/core/navigation/navTruth';

/** Launcher-mål — tunga moduler får egen route (ingen nested TabBar). */
export const LIV_LAUNCHER_EXTERNAL: Record<string, string> = {
  mabra: '/mabra',
  handling: '/planering?tab=handling',
  inkorg: '/planering?tab=inkorg',
  projekt: '/projekt',
  arbetsliv: '/arbetsliv',
  drogfrihet: '/familjen?tab=drogfrihet',
  tidrapportering: '/arbetsliv',
};

export const LIV_LAUNCHER_INLINE_TABS = new Set(['kompasser', 'ekonomi']);

export function resolveLivLegacyTabRedirect(tab: string | null): string | null {
  if (!tab) return null;
  if (tab === 'kunskap') return vaultDrawerPath('kunskapsbank');
  if (LIV_LAUNCHER_INLINE_TABS.has(tab)) return null;
  return LIV_LAUNCHER_EXTERNAL[tab] ?? null;
}
