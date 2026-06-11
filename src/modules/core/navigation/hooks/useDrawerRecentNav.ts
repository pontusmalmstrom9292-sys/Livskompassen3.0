import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  getDrawerRecentVisits,
  recordDrawerRecentVisit,
  type DrawerRecentEntry,
} from '../drawerRecentNav';

/** Spårar senast besökta routes (max 3) för drawer-snabbvägar. */
export function useDrawerRecentNav(): DrawerRecentEntry[] {
  const { pathname, search } = useLocation();
  const [recent, setRecent] = useState<DrawerRecentEntry[]>(() => getDrawerRecentVisits());

  useEffect(() => {
    recordDrawerRecentVisit(pathname, search);
    setRecent(getDrawerRecentVisits());
  }, [pathname, search]);

  return recent;
}
