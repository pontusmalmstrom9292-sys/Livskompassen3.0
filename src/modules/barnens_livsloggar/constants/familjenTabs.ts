import type { LucideIcon } from 'lucide-react';
import { BookHeart, Sparkles, Users } from 'lucide-react';

/** Publika Familjen-flikar — kunskap/mönster finns i Valv-menyn. */
export const FAMILJEN_TABS = [
  { id: 'reflektion', label: 'Reflektion', icon: Sparkles },
  { id: 'livslogg', label: 'Livslogg', icon: BookHeart },
  { id: 'tillsammans', label: 'Tillsammans', icon: Users },
] as const;

export type FamiljenTabId = (typeof FAMILJEN_TABS)[number]['id'];

export const FAMILJEN_TAB_IDS: FamiljenTabId[] = FAMILJEN_TABS.map((t) => t.id);

export function isFamiljenTabId(value: string | null): value is FamiljenTabId {
  return value !== null && (FAMILJEN_TAB_IDS as string[]).includes(value);
}

export function familjenTabIcon(id: FamiljenTabId): LucideIcon {
  return FAMILJEN_TABS.find((t) => t.id === id)!.icon;
}
