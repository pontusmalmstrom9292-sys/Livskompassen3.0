import type { ReactNode } from 'react';
import { Anchor, Heart, LayoutGrid, Search, Wind } from 'lucide-react';

/** F-03 — L3-flikar under Familjen (ej parallell L2-dock). */
export type FamiljenTab = 'oversikt' | 'biff' | 'vagus' | 'korsref' | 'barnfokus';

export const FAMILJEN_TABS: { id: FamiljenTab; label: string; icon: ReactNode; external?: string }[] = [
  { id: 'oversikt', label: 'Översikt', icon: <LayoutGrid className="h-3 w-3" /> },
  { id: 'biff', label: 'BIFF-Sköld', icon: <Anchor className="h-3 w-3" />, external: '/hamn' },
  { id: 'vagus', label: 'Vagus', icon: <Wind className="h-3 w-3" />, external: '/mabra' },
  { id: 'korsref', label: 'Korsreferens', icon: <Search className="h-3 w-3" /> },
  { id: 'barnfokus', label: 'Barnfokus', icon: <Heart className="h-3 w-3" /> },
];

export function parseFamiljenTab(raw: string | null): FamiljenTab {
  if (raw === 'barnfokus' || raw === 'korsref' || raw === 'oversikt') return raw;
  return 'oversikt';
}
