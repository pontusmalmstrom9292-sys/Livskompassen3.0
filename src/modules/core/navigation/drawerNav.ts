/* PROTECTED CORE COMPONENT: DO NOT MODIFY, REFRACTOR, OR REMOVE UI ELEMENTS. THIS FILE IS LOCKED FOR ARCHITECTURAL STABILITY. */
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
  Inbox,
  ListTodo,
  Network,
  Plus,
  ScrollText,
  Search,
  Heart,
  Shield,
  Sparkles,
  Target,
  Users,
  Wallet,
  Zap,
} from 'lucide-react';
import { createChromeV5Icon } from '../ui/chromeIcons';
import { createDrawerL2Icon } from '../ui/drawerL2Icons/DrawerL2Icon';
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
  hem: createDrawerL2Icon('hem'),
  hem_inkast: Zap,
  dagbok: createDrawerL2Icon('dagbok'),
  dagbok_reflektion: BookOpen,
  dagbok_speglar: Sparkles,
  dagbok_bevis: createChromeV5Icon('valv'),
  familjen: createDrawerL2Icon('familjen'),
  familjen_reflektion: Sparkles,
  familjen_livslogg: BookOpen,
  familjen_tillsammans: Users,
  hamn: createDrawerL2Icon('hamn'),
  hamn_oversikt: Compass,
  hamn_biff: createChromeV5Icon('hamnBiff'),
  hamn_speglar: Sparkles,
  hamn_barn: Users,
  vardagen: createDrawerL2Icon('vardagen'),
  vardagen_kompasser: Compass,
  vardagen_mabra: Sparkles,
  vardagen_handling: ListTodo,
  vardagen_arbetsliv: Clock,
  vardagen_ekonomi: Wallet,
  familjen_hamn: createDrawerL2Icon('hamn'),
  familjen_drogfrihet: Heart,
  gora: createDrawerL2Icon('planering'),
  gora_handling: ListTodo,
  gora_projekt: createDrawerL2Icon('projekt'),
  gora_inkorg: Inbox,
  planering: createDrawerL2Icon('planering'),
  planering_handling: ListTodo,
  planering_fokus: Target,
  planering_inkorg: Inbox,
  arbetsliv: createDrawerL2Icon('arbetsliv'),
  arbetsliv_stampla: Clock,
  arbetsliv_tid: Clock,
  arbetsliv_logg: Clock,
  mabra: createDrawerL2Icon('mabra'),
  drogfrihet: createDrawerL2Icon('drogfrihet'),
  projekt: createDrawerL2Icon('projekt'),
  projekt_ny: Plus,
  projekt_handling: ListTodo,
  installningar: createDrawerL2Icon('installningar'),
  valv_samla: createChromeV5Icon('valv'),
  valv_analysera: BarChart3,
  valv_kunskap_nav: BookOpen,
  valv_exportera: ScrollText,
  valv_forensik: Shield,
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
