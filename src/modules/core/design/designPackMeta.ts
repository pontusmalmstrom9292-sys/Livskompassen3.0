/** Chrome-profil per designpaket — styr header, dock, kort, drawer. */
export type DesignPackId = 'D1' | 'D2' | 'D3' | 'D4' | 'D5';

export type DesignPackChrome = {
  id: DesignPackId;
  label: string;
  header: 'kanon' | 'center-ornament';
  dock: 'classic' | 'mockup-triad';
  cardStyle: 'glass' | 'row' | 'timeline';
  drawer: 'accordion' | 'flat-gold';
  /** Route → centrerad rubrik (mockup caps) */
  pageTitles: Record<string, string>;
  bgImage?: string;
};

const defaultTitles: DesignPackChrome['pageTitles'] = {
  '/': 'DEN TRYGGA HAMNEN',
  '/familj': 'FAMILJEN',
  '/familjen': 'FAMILJEN',
  '/kompis': 'LIVSKOMPASSEN',
  '/dagbok': 'VALV',
  '/hjartat': 'HJÄRTAT',
  '/valvet': 'VALV',
  '/planering': 'PLANERING',
  '/mabra': 'MÅBRA',
  '/installningar': 'INSTÄLLNINGAR',
};

export const DESIGN_PACK_CHROME: Record<DesignPackId, DesignPackChrome> = {
  D1: {
    id: 'D1',
    label: 'Hamn & kompass',
    header: 'center-ornament',
    dock: 'mockup-triad',
    cardStyle: 'row',
    drawer: 'flat-gold',
    pageTitles: defaultTitles,
    bgImage: '/design/mockups/ref-hamn.png',
  },
  D2: {
    id: 'D2',
    label: 'Familjen kort',
    header: 'center-ornament',
    dock: 'mockup-triad',
    cardStyle: 'row',
    drawer: 'flat-gold',
    pageTitles: {
      ...defaultTitles,
      '/familj': 'FAMILJEN',
      '/': 'FAMILJEN',
    },
    bgImage: '/design/mockups/ref-familjen.png',
  },
  D3: {
    id: 'D3',
    label: 'Minnes tidslinje',
    header: 'center-ornament',
    dock: 'mockup-triad',
    cardStyle: 'timeline',
    drawer: 'flat-gold',
    pageTitles: {
      ...defaultTitles,
      '/familj': 'MINNESANKARE',
    },
    bgImage: '/design/mockups/ref-minnes.png',
  },
  D4: {
    id: 'D4',
    label: 'Flat deluxe meny',
    header: 'center-ornament',
    dock: 'mockup-triad',
    cardStyle: 'row',
    drawer: 'flat-gold',
    pageTitles: defaultTitles,
    bgImage: '/design/home-hero-scenic.png',
  },
  D5: {
    id: 'D5',
    label: 'Mörk aurora glas',
    header: 'center-ornament',
    dock: 'mockup-triad',
    cardStyle: 'glass',
    drawer: 'accordion',
    pageTitles: defaultTitles,
    bgImage: '/design/home-hero-scenic.png',
  },
};

export function getDesignPackIdFromTheme(themeId: string): DesignPackId | null {
  const m = themeId.match(/^D[1-5]-/);
  if (!m) return null;
  const id = themeId.slice(0, 2) as DesignPackId;
  return DESIGN_PACK_CHROME[id] ? id : null;
}

export function resolveCenterTitle(
  pathname: string,
  chrome: DesignPackChrome,
): string {
  if (chrome.pageTitles[pathname]) return chrome.pageTitles[pathname];
  if (pathname.startsWith('/familj')) return chrome.pageTitles['/familj'] ?? 'FAMILJEN';
  if (pathname.startsWith('/valvet') || pathname.startsWith('/valv') || pathname.startsWith('/dagbok')) return 'VALV';
  if (pathname.startsWith('/hjartat')) return chrome.pageTitles['/hjartat'] ?? 'HJÄRTAT';
  if (pathname.startsWith('/planering')) return 'PLANERING';
  if (pathname.startsWith('/mabra')) return 'MÅBRA';
  return 'LIVSKOMPASSEN';
}
