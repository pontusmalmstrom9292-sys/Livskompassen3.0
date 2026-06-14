import {
  Anchor,
  BookOpen,
  Brain,
  Briefcase,
  CalendarDays,
  ClipboardList,
  Users,
  Wallet,
  type LucideIcon,
} from 'lucide-react';
import { NAV_PATHS } from '@/core/navigation/navTruth';
import type { LifeHubPresetId } from '../lifeOs/lifeHubPresets';
import { HOME_SUPERHUB_ROUTES } from './homeSuperhubRoutes';

export type HomeQuickNavItem = {
  id: string;
  label: string;
  to: string;
  icon: LucideIcon;
};

const FORALDER_NAV: HomeQuickNavItem[] = [
  { id: 'dagbok', label: 'Dagbok', to: HOME_SUPERHUB_ROUTES.hjartatQuickMirror, icon: BookOpen },
  { id: 'ekonomi', label: 'Ekonomi', to: HOME_SUPERHUB_ROUTES.ekonomiInput, icon: Wallet },
  { id: 'barnen', label: 'Barnen', to: NAV_PATHS.FAMILJEN, icon: Users },
  { id: 'hamn', label: 'Hamnen', to: '/familjen?tab=hamn', icon: Anchor },
];

const REHAB_NAV: HomeQuickNavItem[] = [
  { id: 'mabra', label: 'MåBra', to: HOME_SUPERHUB_ROUTES.mabraInput, icon: Brain },
  { id: 'dagbok', label: 'Dagbok', to: HOME_SUPERHUB_ROUTES.hjartatReflektion, icon: BookOpen },
  { id: 'kompasser', label: 'Kompasser', to: '/vardagen?tab=kompasser', icon: CalendarDays },
];

const VARDAG_NAV: HomeQuickNavItem[] = [
  { id: 'planering', label: 'Planering', to: HOME_SUPERHUB_ROUTES.planeringHub, icon: ClipboardList },
  { id: 'arbetsliv', label: 'Stämpel', to: HOME_SUPERHUB_ROUTES.arbetslivStampla, icon: Briefcase },
  { id: 'ekonomi', label: 'Ekonomi', to: HOME_SUPERHUB_ROUTES.ekonomiInput, icon: Wallet },
  { id: 'kompasser', label: 'Kompasser', to: '/vardagen?tab=kompasser', icon: CalendarDays },
];

const MINIMAL_NAV: HomeQuickNavItem[] = [
  { id: 'dagbok', label: 'Dagbok', to: HOME_SUPERHUB_ROUTES.hjartatQuickMirror, icon: BookOpen },
  { id: 'mabra', label: 'MåBra', to: HOME_SUPERHUB_ROUTES.mabraInput, icon: Brain },
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
