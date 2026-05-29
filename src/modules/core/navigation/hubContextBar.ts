/**
 * Hub-kontextrad — 4 fasta platser per hub (ingen Hem/Kompass; dock + drawer).
 */
export type HubContextIconId =
  | 'list'
  | 'calendar'
  | 'clock'
  | 'note'
  | 'record'
  | 'wallet'
  | 'mail'
  | 'folder'
  | 'focus'
  | 'plus'
  | 'sprout'
  | 'book'
  | 'brain'
  | 'anchor'
  | 'sparkles'
  | 'users'
  | 'bookheart';

export type HubContextKey =
  | 'default'
  | 'planering'
  | 'familjen'
  | 'vardagen'
  | 'arbetsliv'
  | 'hamn'
  | 'dagbok'
  | 'mabra';

export type HubContextSlot = {
  id: string;
  label: string;
  to: string;
  icon: HubContextIconId;
  active?: boolean;
};

const DEFAULT_SLOTS: HubContextSlot[] = [
  { id: 'inkop', label: 'Inköp', to: '/planering?tab=inkop', icon: 'list' },
  { id: 'planering', label: 'Planering', to: '/planering?tab=handling', icon: 'calendar' },
  { id: 'arbetsliv', label: 'Arbetsliv', to: '/arbetsliv?tab=stampla', icon: 'clock' },
  { id: 'note', label: 'Anteckning', to: '/widget/anteckning', icon: 'note' },
];

function tabParam(search: string): string | null {
  return new URLSearchParams(search.replace(/^\?/, '')).get('tab');
}

function planeringSlots(tab: string | null, onProjekt: boolean): HubContextSlot[] {
  const t =
    tab === 'fokus' || tab === 'inkorg' || tab === 'framsteg' || tab === 'regler' ? tab : 'handling';
  if (onProjekt) {
    return [
      { id: 'projekt', label: 'Projekt', to: '/projekt', icon: 'folder', active: true },
      { id: 'inkop', label: 'Inköp', to: '/planering?tab=inkop', icon: 'list' },
      { id: 'handling', label: 'Handling', to: '/planering?tab=handling', icon: 'calendar' },
      { id: 'hub', label: 'Verktyg', to: '/planering', icon: 'plus' },
    ];
  }
  if (tab === 'inkop') {
    return [
      { id: 'inkop', label: 'Inköp', to: '/planering?tab=inkop', icon: 'list', active: true },
      { id: 'handling', label: 'Handling', to: '/planering?tab=handling', icon: 'calendar' },
      { id: 'fokus', label: 'Fokus', to: '/planering?tab=fokus', icon: 'focus' },
      { id: 'hub', label: 'Verktyg', to: '/planering', icon: 'plus' },
    ];
  }
  if (!tab || tab === 'hub') {
    return [
      { id: 'handling', label: 'Handling', to: '/planering?tab=handling', icon: 'calendar' },
      { id: 'fokus', label: 'Fokus', to: '/planering?tab=fokus', icon: 'focus' },
      { id: 'inkorg', label: 'Inkorg', to: '/planering?tab=inkorg', icon: 'mail' },
      { id: 'regler', label: 'Regler', to: '/planering?tab=regler', icon: 'list' },
    ];
  }
  return [
    {
      id: 'handling',
      label: 'Handling',
      to: '/planering?tab=handling',
      icon: 'calendar',
      active: t === 'handling',
    },
    {
      id: 'fokus',
      label: 'Fokus',
      to: '/planering?tab=fokus',
      icon: 'focus',
      active: t === 'fokus',
    },
    {
      id: 'inkorg',
      label: 'Inkorg',
      to: '/planering?tab=inkorg',
      icon: 'mail',
      active: t === 'inkorg',
    },
    {
      id: 'regler',
      label: 'Regler',
      to: '/planering?tab=regler',
      icon: 'list',
      active: t === 'regler',
    },
  ];
}

function arbetslivSlots(tab: string | null): HubContextSlot[] {
  const t = tab === 'tid' || tab === 'logg' ? tab : 'stampla';
  return [
    {
      id: 'stampla',
      label: 'Stämpel',
      to: '/arbetsliv?tab=stampla',
      icon: 'clock',
      active: t === 'stampla',
    },
    {
      id: 'tid',
      label: 'Tid',
      to: '/arbetsliv?tab=tid',
      icon: 'calendar',
      active: t === 'tid',
    },
    {
      id: 'logg',
      label: 'Logg',
      to: '/arbetsliv?tab=logg',
      icon: 'book',
      active: t === 'logg',
    },
    { id: 'planering', label: 'Planering', to: '/planering?tab=handling', icon: 'folder' },
  ];
}

function familjenSlots(tab: string | null): HubContextSlot[] {
  const t =
    tab === 'livslogg' || tab === 'tillsammans' ? tab : 'reflektion';
  return [
    {
      id: 'reflektion',
      label: 'Reflektion',
      to: '/familjen?tab=reflektion',
      icon: 'sparkles',
      active: t === 'reflektion',
    },
    {
      id: 'livslogg',
      label: 'Livslogg',
      to: '/familjen?tab=livslogg',
      icon: 'bookheart',
      active: t === 'livslogg',
    },
    {
      id: 'tillsammans',
      label: 'Tillsammans',
      to: '/familjen?tab=tillsammans',
      icon: 'users',
      active: t === 'tillsammans',
    },
    { id: 'planering', label: 'Planering', to: '/planering?tab=handling', icon: 'calendar' },
  ];
}

function vardagenSlots(tab: string | null): HubContextSlot[] {
  const t = tab === 'ekonomi' ? 'ekonomi' : 'kompasser';
  return [
    {
      id: 'kompasser',
      label: 'Kompasser',
      to: '/vardagen?tab=kompasser',
      icon: 'sprout',
      active: t === 'kompasser',
    },
    {
      id: 'ekonomi',
      label: 'Ekonomi',
      to: '/vardagen?tab=ekonomi',
      icon: 'wallet',
      active: t === 'ekonomi',
    },
    { id: 'planering', label: 'Planering', to: '/planering?tab=handling', icon: 'calendar' },
    { id: 'arbetsliv', label: 'Arbetsliv', to: '/arbetsliv?tab=stampla', icon: 'clock' },
  ];
}

function hamnSlots(): HubContextSlot[] {
  return [
    { id: 'hamn', label: 'Hamn', to: '/hamn', icon: 'anchor', active: true },
    { id: 'biff', label: 'BIFF', to: '/hamn', icon: 'anchor' },
    { id: 'dagbok', label: 'Dagbok', to: '/dagbok', icon: 'book' },
    { id: 'planering', label: 'Planering', to: '/planering?tab=handling', icon: 'calendar' },
  ];
}

function dagbokSlots(tab: string | null): HubContextSlot[] {
  const t = tab === 'speglar' ? 'speglar' : 'reflektion';
  return [
    {
      id: 'reflektion',
      label: 'Reflektion',
      to: '/dagbok',
      icon: 'book',
      active: t === 'reflektion',
    },
    {
      id: 'speglar',
      label: 'Speglar',
      to: '/dagbok?tab=speglar',
      icon: 'brain',
      active: t === 'speglar',
    },
    { id: 'hamn', label: 'Hamn', to: '/hamn', icon: 'anchor' },
    { id: 'planering', label: 'Planering', to: '/planering?tab=handling', icon: 'calendar' },
  ];
}

function mabraSlots(): HubContextSlot[] {
  return [
    { id: 'mabra', label: 'MåBra', to: '/mabra', icon: 'sparkles', active: true },
    { id: 'dagbok', label: 'Dagbok', to: '/dagbok', icon: 'book' },
    { id: 'hamn', label: 'Hamn', to: '/hamn', icon: 'anchor' },
    { id: 'planering', label: 'Planering', to: '/planering?tab=handling', icon: 'calendar' },
  ];
}

export function resolveHubKey(pathname: string, search: string): HubContextKey {
  if (pathname.startsWith('/planering') || pathname.startsWith('/projekt')) {
    return 'planering';
  }
  if (pathname.startsWith('/familjen')) return 'familjen';
  if (
    pathname.startsWith('/vardagen') ||
    pathname.startsWith('/ekonomi') ||
    pathname.startsWith('/kompasser')
  ) {
    return 'vardagen';
  }
  if (pathname.startsWith('/arbetsliv') || pathname.startsWith('/stampla')) {
    return 'arbetsliv';
  }
  if (pathname.startsWith('/hamn')) return 'hamn';
  if (pathname.startsWith('/dagbok') || pathname.startsWith('/valv')) {
    const tab = tabParam(search);
    if (tab === 'bevis' || search.includes('vaultTab=')) return 'default';
    return 'dagbok';
  }
  if (pathname.startsWith('/mabra')) return 'mabra';
  return 'default';
}

/** Exakt fyra kontextknappar för aktuell hub. */
export function getHubContextSlots(pathname: string, search: string): HubContextSlot[] {
  const tab = tabParam(search);
  const key = resolveHubKey(pathname, search);

  switch (key) {
    case 'planering':
      return planeringSlots(tab, pathname.startsWith('/projekt'));
    case 'arbetsliv':
      return arbetslivSlots(tab);
    case 'familjen':
      return familjenSlots(tab);
    case 'vardagen':
      return vardagenSlots(tab);
    case 'hamn':
      return hamnSlots();
    case 'dagbok':
      return dagbokSlots(tab);
    case 'mabra':
      return mabraSlots();
    default:
      return DEFAULT_SLOTS.map((s) => ({ ...s }));
  }
}

export type HubMoreActionId =
  | 'inkop'
  | 'planering'
  | 'arbetsliv'
  | 'note'
  | 'record'
  | 'ekonomi';

/** Utökad panel «Mer» — utan Hem/Kompass. */
export const HUB_MORE_ACTIONS: {
  id: HubMoreActionId;
  label: string;
  to: string;
  icon: HubContextIconId;
}[] = [
  { id: 'inkop', label: 'Inköpslista', to: '/admin/projects/ny', icon: 'list' },
  { id: 'planering', label: 'Planering', to: '/planering?tab=handling', icon: 'calendar' },
  { id: 'arbetsliv', label: 'Arbetsliv', to: '/arbetsliv?tab=stampla', icon: 'clock' },
  { id: 'note', label: 'Anteckning', to: '/widget/anteckning', icon: 'note' },
  { id: 'record', label: 'Tyst inspelning', to: '/widget/inspelning?autostart=1', icon: 'record' },
  { id: 'ekonomi', label: 'Ekonomi', to: '/vardagen?tab=ekonomi', icon: 'wallet' },
];
