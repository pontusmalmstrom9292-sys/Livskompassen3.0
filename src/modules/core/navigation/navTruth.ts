/**
 * Single source for hub labels, paths, and chrome flags.
 * Drawer icons stay in drawerNav.ts (Lucide map by id).
 */
export type NavTruthEntry = {
  id: string;
  label: string;
  path: string;
  inDrawer: boolean;
  inDock?: boolean;
  fyrenHomeQuick?: boolean;
  /** Theme Pack J id when auto-module theme is on */
  themeId?: string;
};

export const NAV_TRUTH: NavTruthEntry[] = [
  { id: 'hem', label: 'Hem Kompass', path: '/', inDrawer: true, fyrenHomeQuick: false, themeId: 'J-fyren-hem' },
  { id: 'familjen', label: 'Familjen', path: '/familjen', inDrawer: true, inDock: true, themeId: 'J-familjen-varm' },
  { id: 'hamn', label: 'Trygg hamn', path: '/hamn', inDrawer: true, themeId: 'J-hamn-greyrock' },
  {
    id: 'vardagen',
    label: 'Vardagen',
    path: '/vardagen',
    inDrawer: true,
    fyrenHomeQuick: true,
    themeId: 'J-vardagen-orbit',
  },
  { id: 'valv', label: 'Valv', path: '/dagbok?tab=bevis', inDrawer: true, fyrenHomeQuick: false, themeId: 'J-valv-pansar' },
  { id: 'planering', label: 'Planering', path: '/planering', inDrawer: true, fyrenHomeQuick: true, themeId: 'J-planering-fyren' },
  { id: 'arbetsliv', label: 'Arbetsliv', path: '/arbetsliv', inDrawer: true, themeId: 'J-vardagen-orbit' },
  { id: 'mabra', label: 'MåBra', path: '/mabra', inDrawer: true, themeId: 'J-mabra-lavendel' },
  {
    id: 'installningar',
    label: 'Inställningar',
    path: '/installningar',
    inDrawer: true,
  },
];

export const DRAWER_NAV_TRUTH = NAV_TRUTH.filter((e) => e.inDrawer);

export function getNavTruthById(id: string): NavTruthEntry | undefined {
  return NAV_TRUTH.find((e) => e.id === id);
}
