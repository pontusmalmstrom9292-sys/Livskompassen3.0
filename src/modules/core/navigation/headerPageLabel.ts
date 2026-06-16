/** Underrad i header — var du är (inte hem). */
export function getHeaderPageLabel(pathname: string, search = ''): string | null {
  if (pathname === '/') return 'Hem';
  if (pathname.startsWith('/kompis')) return 'Kompis';
  if (pathname.startsWith('/familjen')) {
    const tab = new URLSearchParams(search.replace(/^\?/, '')).get('tab');
    if (tab === 'drogfrihet') return 'Drogfrihet';
    return 'Familjen';
  }
  if (pathname.startsWith('/hamn')) return 'Trygg hamn';
  if (pathname.startsWith('/valvet') || pathname.startsWith('/valv')) return 'Arkiv';
  if (pathname.startsWith('/hjartat') || pathname.startsWith('/dagbok')) {
    const tab = new URLSearchParams(search.replace(/^\?/, '')).get('tab');
    if (tab === 'speglar') return 'Speglar';
    return 'Hjärtat';
  }
  if (pathname.startsWith('/planering')) return 'Göra';
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
