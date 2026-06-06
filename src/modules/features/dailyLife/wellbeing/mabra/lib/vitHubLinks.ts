import { NAV_PATHS } from '@/core/navigation/navTruth';
import { VIT_VAULT_TAB } from '@/features/lifeJournal/evidence/vault/utils/vaultTabs';
import type { MabraProjectId } from '../constants/mabraProjects';
import type { VitKindFilter } from './filterVitEntries';

export const VAULT_VIT_TAB_LINK = `${NAV_PATHS.VALVET}?vaultTab=${VIT_VAULT_TAB}`;

export function vitHubFilteredLink(
  kind?: VitKindFilter,
  projectId?: MabraProjectId,
): string {
  const params = new URLSearchParams({ vaultTab: VIT_VAULT_TAB });
  if (kind && kind !== 'all') params.set('vitKind', kind);
  if (projectId) params.set('vitProject', projectId);
  return `${NAV_PATHS.VALVET}?${params.toString()}`;
}
