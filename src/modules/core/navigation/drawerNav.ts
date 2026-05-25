/**
 * Sidomeny — kanon enligt docs/design/references/MENU-DRAWER-KANON.md
 * Labels/paths: navTruth.ts · Implementation: NavigationDrawer.tsx
 */
import type { ComponentType } from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  Anchor,
  Calendar,
  Clock,
  Compass,
  Settings,
  Sparkles,
  Sprout,
  Users,
} from 'lucide-react';
import { ValvArchIcon } from '../ui/ValvArchIcon';
import { DRAWER_NAV_TRUTH } from './navTruth';

export type DrawerNavIcon = LucideIcon | ComponentType<{ className?: string }>;

export type DrawerNavItem = {
  id: string;
  label: string;
  path: string;
  icon: DrawerNavIcon;
};

const DRAWER_ICONS: Record<string, DrawerNavIcon> = {
  hem: Compass,
  familjen: Users,
  hamn: Anchor,
  vardagen: Sprout,
  valv: ValvArchIcon,
  planering: Calendar,
  arbetsliv: Clock,
  mabra: Sparkles,
  installningar: Settings,
};

/** Ordning låst — ändra endast via navTruth + produktbeslut + MENU-DRAWER-KANON.md */
export const DRAWER_NAV_ITEMS: DrawerNavItem[] = DRAWER_NAV_TRUTH.map((entry) => ({
  id: entry.id,
  label: entry.label,
  path: entry.path,
  icon: DRAWER_ICONS[entry.id] ?? Compass,
}));
