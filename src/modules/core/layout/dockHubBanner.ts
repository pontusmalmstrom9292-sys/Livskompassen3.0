/** Kort hub-etikett ovanför dock-raden. */
export function getDockHubBanner(pathname: string): string | null {
  if (pathname.startsWith('/planering') || pathname.startsWith('/projekt')) return 'Planering';
  if (pathname.startsWith('/familjen')) return 'Familjen';
  if (pathname.startsWith('/dagbok') || pathname.startsWith('/valv')) return 'Hjärtat';
  if (pathname.startsWith('/hamn')) return 'Trygg hamn';
  if (pathname.startsWith('/mabra')) return 'MåBra';
  if (pathname.startsWith('/vardagen') || pathname.startsWith('/ekonomi')) return 'Vardagen';
  if (pathname.startsWith('/arbetsliv') || pathname.startsWith('/stampla')) return 'Arbetsliv';
  if (pathname === '/') return 'Hem';
  return null;
}
