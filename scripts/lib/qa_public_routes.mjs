/**
 * Full route catalog for QA Harden exhaustive crawl.
 * Valv *behind* PIN (Mönster/Orkester deep) is not listed — only PIN-väggen.
 * Sacred long-press / biometric never automated elsewhere.
 */
export const PUBLIC_ROUTES = [
  // Hem / launcher
  { path: '/', label: 'Hem' },
  { path: '/dashboard', label: 'Dashboard' },
  { path: '/kompis', label: 'Kompis' },
  { path: '/morgon', label: 'Morgonkompassen' },
  // Vardagen / Liv och göra
  { path: '/vardagen', label: 'Vardagen' },
  { path: '/vardagen?tab=kompasser', label: 'Kompasser' },
  { path: '/vardagen?tab=mabra', label: 'MåBra (vardagen)' },
  { path: '/vardagen?tab=ekonomi', label: 'Ekonomi' },
  { path: '/mabra', label: 'MåBra hub' },
  { path: '/mabra/akut', label: 'MåBra akut' },
  { path: '/mabra/tid', label: 'MåBra tid' },
  { path: '/mabra/varderingar', label: 'MåBra värderingar' },
  { path: '/mabra/input', label: 'MåBra input' },
  { path: '/mabra/recovery/sos', label: 'MåBra recovery SOS' },
  { path: '/planering', label: 'Planering' },
  { path: '/planering?tab=handling', label: 'Planering handling' },
  { path: '/planering/kalender', label: 'Planering kalender' },
  { path: '/planering/input', label: 'Planering input' },
  { path: '/arbetsliv', label: 'Arbetsliv' },
  { path: '/arbetsliv/input', label: 'Arbetsliv stämpel' },
  { path: '/arbetsliv/input?inputMode=tid', label: 'Arbetsliv tid' },
  { path: '/arbetsliv/input?inputMode=inkomster', label: 'Arbetsliv inkomster' },
  { path: '/arbetsliv/input?inputMode=stampla', label: 'Arbetsliv stampla' },
  // Familjen
  { path: '/familjen', label: 'Familjen' },
  { path: '/familjen?tab=reflektion', label: 'Barnfokus' },
  { path: '/familjen?tab=livslogg', label: 'Livslogg' },
  { path: '/familjen?tab=tillsammans', label: 'Tillsammans' },
  { path: '/familjen?tab=barnporten', label: 'Barnporten tab' },
  { path: '/familjen?tab=hamn', label: 'Trygg hamn' },
  { path: '/familjen?tab=drogfrihet', label: 'Drogfrihet' },
  { path: '/barnporten', label: 'Barnporten' },
  // Hjärtat / Ventil
  { path: '/hjartat', label: 'Hjärtat' },
  { path: '/hjartat?tab=reflektion', label: 'Reflektion' },
  { path: '/hjartat?tab=speglar', label: 'Speglar' },
  { path: '/orakel', label: 'Orakel' },
  { path: '/reflection', label: 'Reflection' },
  { path: '/biochem', label: 'Biochem' },
  // Inkast / Projekt / Settings
  { path: '/inkast', label: 'Inkast' },
  { path: '/projekt', label: 'Projekt' },
  { path: '/projekt/ny', label: 'Projekt ny' },
  { path: '/projekt/regler', label: 'Projekt regler' },
  { path: '/projekt/genvagar', label: 'Projekt genvägar' },
  { path: '/installningar', label: 'Inställningar' },
  { path: '/installningar?tab=allmant', label: 'Inställningar allmänt' },
  { path: '/installningar?tab=naring', label: 'Inställningar näring' },
  { path: '/installningar?tab=drogfrihet', label: 'Inställningar drogfrihet' },
  { path: '/installningar/widget-studio', label: 'Widget Studio' },
  // Valv entry + settings (PIN-vägg OK)
  { path: '/valvet', label: 'Valvet (PIN-vägg)' },
  { path: '/valvet/installningar', label: 'Valvet installningar' },
  // SOS
  { path: '/sos', label: 'SOS' },
  // Widget-ytor (alla companion + snabb)
  { path: '/widget/anteckning', label: 'W anteckning' },
  { path: '/widget/inspelning', label: 'W inspelning' },
  { path: '/widget/kompass', label: 'W kompass' },
  { path: '/widget/hamn', label: 'W hamn' },
  { path: '/widget/familjen', label: 'W familjen' },
  { path: '/widget/stampla', label: 'W stampla' },
  { path: '/widget/barnporten', label: 'W barnporten' },
  { path: '/widget/snabbval', label: 'W snabbval' },
  { path: '/widget/voice-vault', label: 'W voice-vault' },
  { path: '/widget/projekt', label: 'W projekt' },
  { path: '/widget/aktioner', label: 'W aktioner' },
  { path: '/widget/moduler', label: 'W moduler' },
  { path: '/widget/drogfrihet-akut', label: 'W drogfrihet-akut' },
  { path: '/widget/companion-capture', label: 'W companion-capture' },
  { path: '/widget/companion-inbox', label: 'W companion-inbox' },
  { path: '/widget/companion-note', label: 'W companion-note' },
  { path: '/widget/companion-harbor', label: 'W companion-harbor' },
  { path: '/widget/companion-compass', label: 'W companion-compass' },
  { path: '/widget/companion-child', label: 'W companion-child' },
  { path: '/widget/companion-beacon', label: 'W companion-beacon' },
  { path: '/widget/companion-journal', label: 'W companion-journal' },
  { path: '/widget/companion-anchor', label: 'W companion-anchor' },
  { path: '/widget/companion-tasks', label: 'W companion-tasks' },
  // Dev labs (UI regression — gratis, lokal)
  { path: '/dev/theme-lab', label: 'Dev theme-lab' },
  { path: '/dev/themes', label: 'Dev themes' },
  { path: '/dev/hub-lab', label: 'Dev hub-lab' },
  { path: '/dev/basta-design', label: 'Dev basta-design' },
  { path: '/dev/design-freeport', label: 'Dev design-freeport' },
  { path: '/dev/obsidian-depth', label: 'Dev obsidian-depth' },
  { path: '/dev/obsidian-forge', label: 'Dev obsidian-forge' },
  { path: '/dev/obsidian-depth-v2', label: 'Dev obsidian-depth-v2' },
  { path: '/dev/dagens-ankare', label: 'Dev dagens-ankare' },
  { path: '/dev/companion-widgets', label: 'Dev companion-widgets' },
];

/** Drawer accordion → child links (live BastaDesign / navTruth). */
export const DRAWER_FULL_TOUR = [
  {
    accordion: /Hem — Skriv,\s*fäll/i,
    links: [
      { link: 'Startskärm', expectPath: /^\/($|\?)/ },
      { link: 'Snabb-inkast', expectPath: /inkast|planering|widget/ },
    ],
  },
  {
    accordion: /Liv och göra,\s*fäll/i,
    links: [
      { link: 'Kompasser', expectPath: /vardagen/ },
      { link: 'MåBra', expectPath: /mabra|vardagen/ },
      { link: 'Planering', expectPath: /planering/ },
      { link: 'Arbetsliv', expectPath: /arbetsliv/ },
      { link: 'Ekonomi', expectPath: /ekonomi|vardagen/ },
    ],
  },
  {
    accordion: /Familj och gränser,\s*fäll/i,
    links: [
      { link: 'Barnfokus', expectPath: /familjen/ },
      { link: 'Livslogg', expectPath: /familjen/ },
      { link: 'Tillsammans', expectPath: /familjen/ },
      { link: 'Barnporten', expectPath: /familjen|barnporten/ },
      { link: 'Trygg hamn', expectPath: /familjen|hamn/ },
      { link: 'Drogfrihet', expectPath: /familjen|drogfrihet/ },
    ],
  },
  {
    accordion: /Inställningar,\s*fäll/i,
    links: [
      { link: 'Allmänt', expectPath: /installningar/ },
      { link: 'Näring', expectPath: /installningar/ },
      { link: 'Drogfrihet', expectPath: /installningar|drogfrihet/ },
    ],
  },
];

export const PUBLIC_ROUTE_PATHS = PUBLIC_ROUTES.map((r) => r.path);
