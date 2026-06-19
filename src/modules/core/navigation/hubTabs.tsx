import type { LucideIcon } from 'lucide-react';
import {
  Anchor,
  BookHeart,
  BookOpen,
  Brain,
  Clock,
  Compass,
  Droplets,
  Heart,
  Sparkles,
  Sprout,
  Users,
  Wallet,
} from 'lucide-react';
import { getNavChildren, type NavTruthEntry } from './navTruth';
import type { TabBarItem } from '../ui/TabBar';

/** Hubs vars underflikar härleds från `navTruth` (Vardag-sektionen). */
export type DrawerHubId =
  | 'dagbok'
  | 'familjen'
  | 'familj'
  | 'liv'
  | 'hamn'
  | 'vardagen'
  | 'planering'
  | 'gora'
  | 'arbetsliv'
  | 'drogfrihet'
  | 'installningar';

/** Tab-id från nav-radens path (`?tab=`). */
export function tabIdFromNavPath(path: string): string | null {
  if (!path || path.includes('#')) return null;
  const q = path.indexOf('?');
  if (q < 0) return null;
  const sp = new URLSearchParams(path.slice(q + 1));
  return sp.get('tab');
}

const HUB_TAB_ICONS: Partial<Record<string, LucideIcon>> = {
  dagbok_reflektion: BookOpen,
  dagbok_speglar: Brain,
  dagbok_bevis: BookOpen,
  familjen_reflektion: Sparkles,
  familjen_livslogg: BookHeart,
  familjen_tillsammans: Users,
  familjen_barnporten: Heart,
  familjen_hamn: Anchor,
  familjen_drogfrihet: Heart,
  liv_kompasser: Sprout,
  liv_mabra: Sparkles,
  liv_handling: BookOpen,
  liv_arbetsliv: Clock,
  familj_reflektion: Sparkles,
  familj_livslogg: BookHeart,
  familj_tillsammans: Users,
  familj_barnporten: Heart,
  familj_hamn: Anchor,
  familj_drogfrihet: Heart,
  hamn_oversikt: Compass,
  hamn_biff: Anchor,
  hamn_speglar: Sparkles,
  hamn_barn: Heart,
  vardagen_kompasser: Sprout,
  vardagen_mabra: Sparkles,
  vardagen_handling: BookOpen,
  vardagen_arbetsliv: Clock,
  vardagen_ekonomi: Wallet,
  vardagen_drogfrihet: Heart,
  gora_handling: BookOpen,
  gora_projekt: BookOpen,
  gora_inkorg: BookOpen,
  planering_handling: BookOpen,
  planering_fokus: Sparkles,
  planering_inkorg: BookOpen,
  arbetsliv_stampla: Clock,
  arbetsliv_tid: Compass,
  arbetsliv_inkomster: Wallet,
  drogfrihet_idag: Sparkles,
  drogfrihet_resurser: BookOpen,
  drogfrihet_reflektion: Heart,
  drogfrihet_kunskap: BookOpen,
  installningar_allmant: BookOpen,
  installningar_naring: Droplets,
  installningar_drogfrihet: Heart,
};

/** Tab-id från nav-rad — `?tab=` eller path-only (/projekt → projekt). */
export function hubTabIdFromNavEntry(entry: NavTruthEntry): string | null {
  const fromQuery = tabIdFromNavPath(entry.path);
  if (fromQuery) return fromQuery;
  if (!entry.path.includes('?') && !entry.path.includes('#')) {
    const segment = entry.path.split('/').filter(Boolean)[0];
    if (segment) return segment;
  }
  return null;
}

function entryToTabItem(entry: NavTruthEntry): TabBarItem<string> | null {
  const id = hubTabIdFromNavEntry(entry);
  if (!id) return null;
  const Icon = HUB_TAB_ICONS[entry.id];
  return {
    id,
    label: entry.label,
    icon: Icon ? <Icon className="h-3 w-3" /> : undefined,
  };
}

export function getHubTabsFromNav(hubId: DrawerHubId): TabBarItem<string>[] {
  const rows = getNavChildren(hubId, 'vardag');
  const fromNav = rows
    .map(entryToTabItem)
    .filter((t): t is TabBarItem<string> => t !== null);
  return fromNav;
}

export function getDefaultHubTab(hubId: DrawerHubId): string {
  const tabs = getHubTabsFromNav(hubId);
  return tabs[0]?.id ?? '';
}
