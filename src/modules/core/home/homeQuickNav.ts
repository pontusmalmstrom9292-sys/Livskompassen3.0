import {
  Anchor,
  BookOpen,
  Brain,
  CalendarDays,
  ClipboardList,
  Users,
  Wallet,
  type LucideIcon,
} from 'lucide-react';
import { NAV_PATHS } from '@/core/navigation/navTruth';
import type { LifeHubPresetId } from '../lifeOs/lifeHubPresets';

export type HomeQuickNavItem = {
  id: string;
  label: string;
  to: string;
  icon: LucideIcon;
};

const FORALDER_NAV: HomeQuickNavItem[] = [
  { id: 'dagbok', label: 'Dagbok', to: NAV_PATHS.HJARTAT, icon: BookOpen },
  { id: 'ekonomi', label: 'Ekonomi', to: '/vardagen?tab=ekonomi', icon: Wallet },
  { id: 'barnen', label: 'Barnen', to: '/familjen', icon: Users },
  { id: 'hamn', label: 'Hamnen', to: '/familjen?tab=hamn', icon: Anchor },
];

const REHAB_NAV: HomeQuickNavItem[] = [
  { id: 'mabra', label: 'MåBra', to: '/vardagen?tab=mabra', icon: Brain },
  { id: 'dagbok', label: 'Dagbok', to: NAV_PATHS.HJARTAT, icon: BookOpen },
  { id: 'kompasser', label: 'Kompasser', to: '/vardagen?tab=kompasser', icon: CalendarDays },
];

const VARDAG_NAV: HomeQuickNavItem[] = [
  { id: 'planering', label: 'Planering', to: '/planering', icon: ClipboardList },
  { id: 'ekonomi', label: 'Ekonomi', to: '/vardagen?tab=ekonomi', icon: Wallet },
  { id: 'kompasser', label: 'Kompasser', to: '/vardagen?tab=kompasser', icon: CalendarDays },
];

const MINIMAL_NAV: HomeQuickNavItem[] = [
  { id: 'dagbok', label: 'Dagbok', to: NAV_PATHS.HJARTAT, icon: BookOpen },
  { id: 'mabra', label: 'MåBra', to: '/vardagen?tab=mabra', icon: Brain },
];

/** Snabbnav på Hem — filtreras av LifeHub-preset (Obsidian Calm, inga streaks). */
export function getHomeQuickNavForPreset(presetId: LifeHubPresetId): HomeQuickNavItem[] {
  switch (presetId) {
    case 'rehab_lag':
      return REHAB_NAV;
    case 'vardag_arbete':
      return VARDAG_NAV;
    case 'minimal':
      return MINIMAL_NAV;
    case 'foralder_trygg':
    default:
      return FORALDER_NAV;
  }
}

export function quickNavGridClass(count: number): string {
  if (count <= 2) return 'grid-cols-2';
  if (count === 3) return 'grid-cols-3';
  return 'grid-cols-4';
}
