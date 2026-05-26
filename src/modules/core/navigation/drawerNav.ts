/**
 * Sidomeny — kanon enligt docs/design/references/MENU-DRAWER-KANON.md
 * Labels/paths: navTruth.ts · Implementation: NavigationDrawer.tsx
 */
import type { ComponentType } from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  Anchor,
  BarChart3,
  BookOpen,
  Briefcase,
  Calendar,
  Clock,
  Compass,
  FileText,
  FolderKanban,
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
import { ValvArchIcon } from '../ui/ValvArchIcon';
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
  icon: DrawerNavIcon;
};

const DRAWER_ICONS: Record<string, DrawerNavIcon> = {
  hem: Compass,
  hem_inkast: Zap,
  dagbok: BookOpen,
  dagbok_reflektion: BookOpen,
  dagbok_speglar: Sparkles,
  dagbok_bevis: ValvArchIcon,
  familjen: Users,
  familjen_reflektion: Sparkles,
  familjen_livslogg: BookOpen,
  familjen_tillsammans: Users,
  hamn: Anchor,
  hamn_oversikt: Compass,
  hamn_biff: Anchor,
  hamn_speglar: Sparkles,
  hamn_barn: Users,
  vardagen: Sprout,
  vardagen_kompasser: Compass,
  vardagen_ekonomi: Wallet,
  planering: Calendar,
  planering_handling: ListTodo,
  planering_fokus: Target,
  planering_inkorg: Inbox,
  arbetsliv: Clock,
  arbetsliv_stampla: Clock,
  arbetsliv_tid: Clock,
  arbetsliv_logg: Clock,
  mabra: Sparkles,
  projekt: FolderKanban,
  projekt_ny: Plus,
  installningar: Settings,
  valv_grp_pansaret: ValvArchIcon,
  valv_grp_kunskap: BookOpen,
  valv_grp_forensik: Shield,
  valv_arkiv: FileText,
  valv_triage: Search,
  valv_monster: BarChart3,
  valv_orkester: Network,
  valv_dossier: ScrollText,
  valv_dossier_export: ScrollText,
  valv_kunskapsbank: BookOpen,
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
