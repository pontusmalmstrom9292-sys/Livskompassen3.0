const PREFIX = 'mabra_explore_skip_';

export function readExploreSkipCount(uid: string, weekKey: string): number {
  if (typeof localStorage === 'undefined') return 0;
  const raw = localStorage.getItem(`${PREFIX}${uid}_${weekKey}`);
  const n = Number(raw);
  return Number.isFinite(n) && n >= 0 ? Math.floor(n) : 0;
}

export function writeExploreSkipCount(uid: string, weekKey: string, count: number): void {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(`${PREFIX}${uid}_${weekKey}`, String(Math.max(0, Math.floor(count))));
}

export function clearExploreSkipCount(uid: string, weekKey: string): void {
  if (typeof localStorage === 'undefined') return;
  localStorage.removeItem(`${PREFIX}${uid}_${weekKey}`);
}
