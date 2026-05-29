import type { LucideIcon } from 'lucide-react';
import {
  Anchor,
  BookHeart,
  BookOpen,
  Brain,
  Compass,
  Heart,
  Sparkles,
  Sprout,
  Users,
  Wallet,
} from 'lucide-react';
import { getDrawerChildren, type NavTruthEntry } from './navTruth';
import type { TabBarItem } from '../ui/TabBar';

/** Hubs vars underflikar härleds från `navTruth` (Vardag-sektionen). */
export type DrawerHubId =
  | 'dagbok'
  | 'familjen'
  | 'hamn'
  | 'vardagen'
  | 'planering'
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
  hamn_oversikt: Compass,
  hamn_biff: Anchor,
  hamn_speglar: Sparkles,
  hamn_barn: Heart,
  vardagen_kompasser: Sprout,
  vardagen_ekonomi: Wallet,
  planering_handling: BookOpen,
  planering_fokus: Sparkles,
  planering_inkorg: BookOpen,
  arbetsliv_stampla: BookOpen,
  arbetsliv_tid: BookOpen,
  arbetsliv_logg: BookOpen,
  drogfrihet_idag: Sparkles,
  drogfrihet_resurser: BookOpen,
  drogfrihet_reflektion: Heart,
  drogfrihet_kunskap: BookOpen,
  installningar_allmant: BookOpen,
  installningar_drogfrihet: Heart,
};

function entryToTabItem(entry: NavTruthEntry): TabBarItem<string> | null {
  const id = tabIdFromNavPath(entry.path);
  if (!id) return null;
  const Icon = HUB_TAB_ICONS[entry.id];
  return {
    id,
    label: entry.label,
    icon: Icon ? <Icon className="h-3 w-3" /> : undefined,
  };
}

export function getHubTabsFromNav(hubId: DrawerHubId): TabBarItem<string>[] {
  const rows = getDrawerChildren(hubId, 'vardag');
  const fromNav = rows
    .map(entryToTabItem)
    .filter((t): t is TabBarItem<string> => t !== null);
  return fromNav;
}

export function getDefaultHubTab(hubId: DrawerHubId): string {
  const tabs = getHubTabsFromNav(hubId);
  return tabs[0]?.id ?? '';
}
