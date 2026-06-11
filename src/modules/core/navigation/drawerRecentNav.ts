import { getHeaderPageLabel } from './headerPageLabel';

const STORAGE_KEY = 'lk_drawer_recent_v1';
const MAX_RECENT = 3;

export type DrawerRecentEntry = {
  path: string;
  label: string;
};

function fullPath(pathname: string, search: string): string {
  return `${pathname}${search}`;
}

/** Zero Footprint-vänlig — sessionStorage rensas vid device clear / flikstängning. */
export function recordDrawerRecentVisit(pathname: string, search = ''): void {
  if (pathname.startsWith('/widget')) return;
  const label = getHeaderPageLabel(pathname, search);
  if (!label) return;

  const path = fullPath(pathname, search);
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    const list: DrawerRecentEntry[] = raw ? (JSON.parse(raw) as DrawerRecentEntry[]) : [];
    const filtered = list.filter((e) => e.path !== path);
    const next: DrawerRecentEntry[] = [{ path, label }, ...filtered].slice(0, MAX_RECENT);
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* sessionStorage otillgänglig */
  }
}

export function getDrawerRecentVisits(): DrawerRecentEntry[] {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as DrawerRecentEntry[];
    return Array.isArray(parsed) ? parsed.slice(0, MAX_RECENT) : [];
  } catch {
    return [];
  }
}
