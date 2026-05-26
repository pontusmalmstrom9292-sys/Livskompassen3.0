/** Kort sammanfattning vid snabbtryck på dock-kompass (ingen Valv-etikett). */
export type PageContextSummary = {
  title: string;
  body: string;
};

export function getPageContextSummary(pathname: string, search: string): PageContextSummary {
  const tab = new URLSearchParams(search.replace(/^\?/, '')).get('tab');

  if (pathname === '/') {
    return {
      title: 'Hem',
      body: 'Kompassros: rutiner, ekonomi, kunskap och utveckling. Mitten = check-in.',
    };
  }
  if (pathname.startsWith('/familjen')) {
    return {
      title: 'Familjen',
      body: 'Barnfokus, minnesankare och livsloggar — barnens silo.',
    };
  }
  if (pathname.startsWith('/hamn')) {
    return {
      title: 'Trygg hamn',
      body: 'BIFF och gränser. Fördjupad analys bakom PIN.',
    };
  }
  if (pathname.startsWith('/vardagen') || pathname.startsWith('/ekonomi') || pathname.startsWith('/kompasser')) {
    if (tab === 'ekonomi') {
      return {
        title: 'Vardagen · Ekonomi',
        body: 'Veckopeng, matlåda och transaktioner. Flikar: Kompasser · Ekonomi · Kunskap.',
      };
    }
    if (tab === 'kunskap') {
      return {
        title: 'Vardagen · Kunskap',
        body: 'Kunskapsvalv och RAG — egen silo, inga barnloggar.',
      };
    }
    return {
      title: 'Vardagen',
      body: 'Kompasser, ekonomi och kunskap i ett kluster. Välj flik uppe på sidan.',
    };
  }
  if (pathname.startsWith('/dagbok')) {
    if (tab === 'bevis') {
      return {
        title: 'Bevis & arkiv',
        body: 'Låsta poster och tidsstämplar. PIN vid känslig åtkomst.',
      };
    }
    return {
      title: 'Dagbok',
      body: 'Reflektion och spegling. Bevis-fliken kräver upplåsning.',
    };
  }
  if (pathname.startsWith('/planering')) {
    return { title: 'Planering', body: 'Kanban: att göra · väntar · klart.' };
  }
  if (pathname.startsWith('/arbetsliv') || pathname.startsWith('/stampla')) {
    return { title: 'Arbetsliv', body: 'Stämpla, tid och löneunderlag.' };
  }
  if (pathname.startsWith('/mabra')) {
    return { title: 'MåBra', body: 'Övningar och kort stöd — utvecklingszon Vit.' };
  }
  if (pathname.startsWith('/projekt')) {
    return { title: 'Projekt', body: 'Listor, anteckningar och egna planer.' };
  }
  if (pathname.startsWith('/widget')) {
    return { title: 'Snabbwidget', body: 'Anteckning eller diskret inspelning.' };
  }
  return {
    title: 'Livskompassen',
    body: 'Du är i appen. Öppna menyn för moduler eller använd kompassrosen på hem.',
  };
}
