import {
  getDrawerRoots,
  getNavChildren,
  NAV_PATHS,
  type NavTruthEntry,
} from '../navigation/navTruth';
import {
  DRAWER_VARDAG_ITEMS,
  DRAWER_VALV_ITEMS,
  type DrawerNavItem,
} from '../navigation/drawerNav';

export const HEM_DRAWER_LINKS: { label: string; path: string }[] = [
  { label: 'Startskärm', path: '/' },
  { label: 'Snabb-inkast', path: '/#inkast-lite' },
];

export function getVardagDrawerHubs(): NavTruthEntry[] {
  return getDrawerRoots('vardag').filter((e) => e.id !== 'installningar');
}

export function getHubNavLinks(hubId: string): { label: string; path: string }[] {
  if (hubId === 'hem') return HEM_DRAWER_LINKS;
  return getNavChildren(hubId, 'vardag').map((e) => ({ label: e.label, path: e.path }));
}

export function drawerItemById(id: string, section: 'vardag' | 'valv'): DrawerNavItem | undefined {
  const list = section === 'vardag' ? DRAWER_VARDAG_ITEMS : DRAWER_VALV_ITEMS;
  return list.find((i) => i.id === id);
}

export function hubGlowColor(hubId: string): 'gold' | 'blue' | 'green' {
  if (hubId === 'familjen' || hubId === 'dagbok') return 'blue';
  return 'gold';
}

export function isHubRouteActive(hubId: string, pathname: string): boolean {
  if (hubId === 'hem') return pathname === '/';

  if (hubId === 'vardagen') {
    return (
      pathname === NAV_PATHS.VARDAGEN ||
      pathname.startsWith(`${NAV_PATHS.VARDAGEN}/`) ||
      pathname === '/liv' ||
      pathname.startsWith('/planering') ||
      pathname.startsWith('/projekt') ||
      pathname === '/mabra' ||
      pathname.startsWith('/mabra/') ||
      pathname === '/arbetsliv' ||
      pathname.startsWith('/arbetsliv/')
    );
  }

  if (hubId === 'familjen') {
    return (
      pathname === NAV_PATHS.FAMILJEN ||
      pathname.startsWith(`${NAV_PATHS.FAMILJEN}/`) ||
      pathname === '/familj' ||
      pathname === '/hamn' ||
      pathname.startsWith('/hamn/') ||
      pathname === NAV_PATHS.BARNEN ||
      pathname.startsWith(`${NAV_PATHS.BARNEN}/`) ||
      pathname === '/drogfrihet'
    );
  }

  if (hubId === 'dagbok') {
    return (
      pathname === NAV_PATHS.HJARTAT ||
      pathname.startsWith(`${NAV_PATHS.HJARTAT}/`) ||
      pathname === '/dagbok' ||
      pathname.startsWith('/dagbok/')
    );
  }

  return false;
}

export function isValvRoute(pathname: string): boolean {
  return (
    pathname.startsWith(NAV_PATHS.VALVET) ||
    pathname.startsWith('/dagbok') ||
    pathname.startsWith('/dossier') ||
    pathname.startsWith('/valv')
  );
}
