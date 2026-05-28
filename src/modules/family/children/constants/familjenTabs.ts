/** Tab-ids för Familjen — synkas med `navTruth` + `useHubTab('familjen')`. */

export type FamiljenTabId = 'reflektion' | 'livslogg' | 'tillsammans';

export const FAMILJEN_TAB_IDS: FamiljenTabId[] = ['reflektion', 'livslogg', 'tillsammans'];

export function isFamiljenTabId(value: string | null): value is FamiljenTabId {
  return value !== null && (FAMILJEN_TAB_IDS as string[]).includes(value);
}
