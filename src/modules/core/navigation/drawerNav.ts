/**
 * Sidomeny — kanon enligt docs/design/references/MENU-DRAWER-KANON.md
 * Labels/paths: navTruth.ts · Implementation: NavigationDrawer.tsx
 */
import type { ComponentType } from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  BarChart3,
  BookOpen,
  Briefcase,
  Clock,
  Compass,
  FileText,
  FolderKanban,
  HeartHandshake,
  Inbox,
  ListTodo,
  Network,
  Plus,
  ScrollText,
  Search,
  Settings,
  Shield,
  Sparkles,
  Sprout,
  Target,
  Users,
  Wallet,
  Zap,
} from 'lucide-react';
import { createChromeV5Icon } from '../ui/chromeIcons';
import {
  DRAWER_NAV_TRUTH,
  getVisibleDrawerTruth,
  type NavDrawerSection,
  type NavTruthEntry,
} from './navTruth';

export type DrawerNavIcon = LucideIcon | ComponentType<{ className?: string }>;

export type DrawerNavItem = {
  id: string;
  label: string;
  path: string;
  section: NavDrawerSection;
  requiresVaultPin?: boolean;
  parentId?: string;
  isGroupHeader?: boolean;
  drawerHint?: string;
  icon: DrawerNavIcon;
};

const DRAWER_ICONS: Record<string, DrawerNavIcon> = {
  hem: Compass,
  hem_inkast: Zap,
  dagbok: createChromeV5Icon('dagbok'),
  dagbok_reflektion: BookOpen,
  dagbok_speglar: Sparkles,
  dagbok_bevis: createChromeV5Icon('valv'),
  familjen: createChromeV5Icon('familjen'),
  familjen_reflektion: Sparkles,
  familjen_livslogg: BookOpen,
  familjen_tillsammans: Users,
  hamn: createChromeV5Icon('hamn'),
  hamn_oversikt: Compass,
  hamn_biff: createChromeV5Icon('hamnBiff'),
  hamn_speglar: Sparkles,
  hamn_barn: Users,
  vardagen: Sprout,
  vardagen_kompasser: Compass,
  vardagen_ekonomi: Wallet,
  planering: createChromeV5Icon('planering'),
  planering_handling: ListTodo,
  planering_fokus: Target,
  planering_inkorg: Inbox,
  arbetsliv: Clock,
  arbetsliv_stampla: Clock,
  arbetsliv_tid: Clock,
  arbetsliv_logg: Clock,
  mabra: createChromeV5Icon('mabra'),
  drogfrihet: HeartHandshake,
  projekt: FolderKanban,
  projekt_ny: Plus,
  projekt_handling: ListTodo,
  installningar: Settings,
  valv_grp_samla: createChromeV5Icon('valv'),
  valv_grp_analysera: BarChart3,
  valv_grp_exportera: ScrollText,
  valv_grp_kunskap: BookOpen,
  valv_grp_forensik: Shield,
  valv_arkiv: FileText,
  valv_triage: Search,
  valv_monster: BarChart3,
  valv_orkester: Network,
  valv_dossier: ScrollText,
  valv_dossier_export: ScrollText,
  valv_kunskapsbank: BookOpen,
  valv_aktorskarta: Users,
  valv_hamn_analys: Shield,
  valv_speglar_fordjupat: Sparkles,
  valv_dagbok_arkiv: BookOpen,
  valv_familjen_monster: BarChart3,
  valv_arbetsliv_franvaro: Briefcase,
  valv_arbetsliv_lon: Wallet,
};

export function toDrawerNavItem(entry: NavTruthEntry): DrawerNavItem {
  return {
    id: entry.id,
    label: entry.label,
    path: entry.path,
    section: entry.section,
    requiresVaultPin: entry.requiresVaultPin,
    parentId: entry.parentId,
    isGroupHeader: entry.isGroupHeader,
    drawerHint: entry.drawerHint,
    icon: DRAWER_ICONS[entry.id] ?? Compass,
  };
}

function mapDrawerItems(entries: NavTruthEntry[]): DrawerNavItem[] {
  return entries.map(toDrawerNavItem);
}

/** Full drawer — Vardag + Valv. Ordning låst via navTruth. */
export const DRAWER_NAV_ITEMS: DrawerNavItem[] = mapDrawerItems(DRAWER_NAV_TRUTH);

export const DRAWER_VARDAG_ITEMS = mapDrawerItems(getVisibleDrawerTruth('vardag'));

export const DRAWER_VALV_ITEMS = mapDrawerItems(getVisibleDrawerTruth('valv'));

/** @deprecated Använd getDrawerRoots + getDrawerChildren */
export const DRAWER_NAV_ITEMS_LEGACY = DRAWER_NAV_ITEMS.filter((e) => !e.parentId);
