/** Underrad i header — var du är (inte hem). */
export function getHeaderPageLabel(pathname: string): string | null {
  if (pathname === '/') return 'Hem';
  if (pathname.startsWith('/familjen')) return 'Familjen';
  if (pathname.startsWith('/hamn')) return 'Trygg hamn';
  if (pathname.startsWith('/dagbok') || pathname.startsWith('/valv')) return 'Valv';
  if (pathname.startsWith('/planering')) return 'Planering';
  if (pathname.startsWith('/projekt')) return 'Projekt';
  if (pathname.startsWith('/mabra')) return 'MåBra';
  if (pathname.startsWith('/drogfrihet')) return 'Drogfrihet';
  if (pathname.startsWith('/kunskap')) return 'Kunskap';
  if (pathname.startsWith('/vardagen')) return 'Vardagen';
  if (pathname.startsWith('/arbetsliv') || pathname.startsWith('/stampla')) return 'Arbetsliv';
  if (pathname.startsWith('/ekonomi')) return 'Ekonomi';
  if (pathname.startsWith('/installningar')) return 'Inställningar';
  return null;
}
