/**
 * Sidomeny — kanon enligt docs/design/references/MENU-DRAWER-KANON.md
 * Implementation: NavigationDrawer.tsx (P1)
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
} from 'lucide-react';
import { ValvArchIcon } from '../ui/ValvArchIcon';
import { FamiljenMarkIcon } from '../ui/FamiljenMarkIcon';

export type DrawerNavIcon = LucideIcon | ComponentType<{ className?: string }>;

export type DrawerNavItem = {
  id: string;
  label: string;
  path: string;
  icon: DrawerNavIcon;
};

/** Ordning låst — ändra endast med produktbeslut + uppdatera MENU-DRAWER-KANON.md */
export const DRAWER_NAV_ITEMS: DrawerNavItem[] = [
  { id: 'hem', label: 'Hem Kompass', path: '/', icon: Compass },
  { id: 'familjen', label: 'Familjen', path: '/familjen', icon: FamiljenMarkIcon },
  { id: 'hamn', label: 'Trygg hamn', path: '/hamn', icon: Anchor },
  { id: 'valv', label: 'Valv', path: '/dagbok?tab=bevis', icon: ValvArchIcon },
  { id: 'planering', label: 'Planering', path: '/planering', icon: Calendar },
  { id: 'arbetsliv', label: 'Arbetsliv', path: '/arbetsliv', icon: Clock },
  { id: 'mabra', label: 'MåBra', path: '/mabra', icon: Sparkles },
  { id: 'installningar', label: 'Inställningar', path: '/installningar', icon: Settings },
];
