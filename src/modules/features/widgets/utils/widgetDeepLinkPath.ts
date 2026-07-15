/** Parse native widget path into router location parts. */
export function parseWidgetDeepLinkPath(
  path: string | undefined | null,
): { pathname: string; search: string } | null {
  if (!path || !path.startsWith('/')) return null;
  const qIndex = path.indexOf('?');
  if (qIndex === -1) return { pathname: path, search: '' };
  return { pathname: path.slice(0, qIndex), search: path.slice(qIndex) };
}

/** Order-independent query compare — mirrors MainActivity.isSameRoute(). */
function normalizeWidgetSearch(search: string): string {
  if (!search) return '';
  const raw = search.startsWith('?') ? search.slice(1) : search;
  if (!raw) return '';
  const params = new URLSearchParams(raw);
  const sorted = [...params.entries()].sort(([a], [b]) => a.localeCompare(b));
  return new URLSearchParams(sorted).toString();
}

export function widgetDeepLinkPathsMatch(
  current: { pathname: string; search: string },
  target: { pathname: string; search: string },
): boolean {
  if (current.pathname !== target.pathname) return false;
  return normalizeWidgetSearch(current.search) === normalizeWidgetSearch(target.search);
}
