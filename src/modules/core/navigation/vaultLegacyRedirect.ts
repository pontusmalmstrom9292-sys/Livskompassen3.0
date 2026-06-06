import { vaultDrawerPath } from './navTruth';

/** Query string (inkl. `?`) för legacy redirect till Valvet med given vaultTab. */
export function vaultRedirectSearch(vaultTab: string): string {
  const vaultPath = vaultDrawerPath(vaultTab);
  const qIndex = vaultPath.indexOf('?');
  return qIndex >= 0 ? vaultPath.slice(qIndex) : '';
}
