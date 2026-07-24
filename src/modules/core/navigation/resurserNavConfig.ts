import type { LucideIcon } from 'lucide-react';
import {
  BookOpen,
  Compass,
  Heart,
  Home,
  LayoutGrid,
  Settings,
  Shield,
  Users,
  Wallet,
} from 'lucide-react';

export type ResurserNavRow = {
  id: string;
  label: string;
  sub: string;
  path: string;
  icon: LucideIcon;
  zone: string;
};

/** Shared module list for Resurser overlay (prod + freeport). */
export const RESURSER_NAV_ROWS: ResurserNavRow[] = [
  { id: 'hem', label: 'Hem', sub: 'Dagens kompass', path: '/', icon: Home, zone: 'hem' },
  { id: 'ekonomi', label: 'Ekonomi', sub: 'Konton & flöde', path: '/vardagen?tab=ekonomi', icon: Wallet, zone: 'vardagen' },
  { id: 'plan', label: 'Planering', sub: 'Vecka & projekt', path: '/planering', icon: LayoutGrid, zone: 'vardagen' },
  { id: 'mabra', label: 'Mabra', sub: 'Check-in & verktyg', path: '/vardagen?tab=mabra', icon: Heart, zone: 'vardagen' },
  { id: 'dagbok', label: 'Dagbok', sub: 'Reflektion', path: '/hjartat', icon: BookOpen, zone: 'hjartat' },
  { id: 'familjen', label: 'Familjen', sub: 'Barnfokus & hamn', path: '/familjen', icon: Users, zone: 'familjen' },
  { id: 'valv', label: 'Säkerhet', sub: 'Efter upplåsning', path: '/valvet', icon: Shield, zone: 'valv' },
  { id: 'kompass', label: 'Kompass', sub: 'Morgon & kväll', path: '/', icon: Compass, zone: 'hem' },
  { id: 'install', label: 'Inställningar', sub: 'Konto & support', path: '/installningar', icon: Settings, zone: '—' },
];
