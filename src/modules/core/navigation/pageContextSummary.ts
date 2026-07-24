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
    if (tab === 'drogfrihet') {
      return {
        title: 'Drogfrihet',
        body: 'Idag-räknare, akut stöd och reflektion — under Familjen.',
      };
    }
    return {
      title: 'Familjen',
      body: 'Barnfokus, minnesankare och livsloggar — barnens eget arkiv.',
    };
  }
  if (pathname.startsWith('/hamn')) {
    return {
      title: 'Trygg hamn',
      body: 'BIFF och gränser. Fördjupad analys bakom PIN.',
    };
  }
  if (pathname.startsWith('/drogfrihet')) {
    return {
      title: 'Drogfrihet',
      body: 'Idag-räknare, akut stöd och reflektion — ett steg i taget.',
    };
  }
  if (pathname.startsWith('/vardagen') || pathname.startsWith('/ekonomi') || pathname.startsWith('/kompasser')) {
    if (tab === 'ekonomi') {
      return {
        title: 'Vardagen · Ekonomi',
        body: 'Veckopeng, matlåda och transaktioner. Flikar: Kompasser · Ekonomi.',
      };
    }
    return {
      title: 'Vardagen',
      body: 'Kompasser och ekonomi. Välj flik uppe på sidan.',
    };
  }
  if (pathname.startsWith('/valvet') || pathname.startsWith('/valv')) {
    return {
      title: 'Bevis & arkiv',
      body: 'Låsta poster och tidsstämplar. PIN vid känslig åtkomst.',
    };
  }
  if (pathname.startsWith('/dagbok') || pathname.startsWith('/hjartat')) {
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
    return { title: 'Göra', body: 'Handling: att göra · väntar · klart.' };
  }
  if (pathname.startsWith('/arbetsliv') || pathname.startsWith('/stampla')) {
    return { title: 'Arbetsliv', body: 'Stämpla, tid och löneunderlag.' };
  }
  if (pathname.startsWith('/mabra')) {
    return { title: 'Mabra', body: 'Övningar och kort stöd — utvecklingszon Vit.' };
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
