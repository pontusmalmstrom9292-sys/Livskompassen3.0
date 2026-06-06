/**
 * Hub-kontextrad — 4 fasta platser per hub (3-zon: Vardagen, Familjen, Dagbok).
 * Uppdaterad 2026-06-06: Liv-launcher — tunga moduler på egna routes.
 */
import { NAV_PATHS } from './navTruth';
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
  | 'dagbok';

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
  { id: 'arbetsliv', label: 'Arbetsliv', to: '/arbetsliv', icon: 'clock' },
  { id: 'note', label: 'Anteckning', to: '/widget/anteckning', icon: 'note' },
  { id: 'snabbval', label: 'Snabbval', to: '/widget/snabbval', icon: 'sparkles' },
];

function tabParam(search: string): string | null {
  return new URLSearchParams(search.replace(/^\?/, '')).get('tab');
}

function planeringSlots(tab: string | null, onProjekt: boolean): HubContextSlot[] {
  if (onProjekt) {
    return [
      { id: 'projekt', label: 'Projekt', to: '/projekt', icon: 'folder', active: true },
      { id: 'inkop', label: 'Inköp', to: '/planering?tab=inkop', icon: 'list' },
      { id: 'handling', label: 'Handling', to: '/planering?tab=handling', icon: 'calendar' },
      { id: 'hub', label: 'Verktyg', to: '/vardagen', icon: 'plus' },
    ];
  }
  return [
    {
      id: 'handling',
      label: 'Handling',
      to: '/planering?tab=handling',
      icon: 'calendar',
      active: tab === 'handling',
    },
    { id: 'fokus', label: 'Fokus', to: '/planering?tab=fokus', icon: 'focus', active: tab === 'fokus' },
    { id: 'inkorg', label: 'Inkorg', to: '/planering?tab=inkorg', icon: 'mail', active: tab === 'inkorg' },
    { id: 'regler', label: 'Regler', to: '/planering?tab=regler', icon: 'list', active: tab === 'regler' },
  ];
}

function vardagenSlots(pathname: string, search: string): HubContextSlot[] {
  const t = tabParam(search) || 'kompasser';
  return [
    {
      id: 'kompasser',
      label: 'Kompasser',
      to: '/vardagen',
      icon: 'sprout',
      active: pathname === '/vardagen' && (t === 'kompasser' || !tabParam(search)),
    },
    {
      id: 'mabra',
      label: 'MåBra',
      to: '/mabra',
      icon: 'sparkles',
      active: pathname === '/mabra' || pathname.startsWith('/mabra/'),
    },
    {
      id: 'handling',
      label: 'Handling',
      to: '/planering?tab=handling',
      icon: 'calendar',
      active: pathname.startsWith('/planering') && t === 'handling',
    },
    {
      id: 'ekonomi',
      label: 'Ekonomi',
      to: '/vardagen?tab=ekonomi',
      icon: 'wallet',
      active: pathname === '/vardagen' && t === 'ekonomi',
    },
  ];
}

function familjenSlots(tab: string | null): HubContextSlot[] {
  const t = tab || 'reflektion';
  return [
    { id: 'reflektion', label: 'Reflektion', to: '/familjen?tab=reflektion', icon: 'sparkles', active: t === 'reflektion' },
    { id: 'livslogg', label: 'Livslogg', to: '/familjen?tab=livslogg', icon: 'bookheart', active: t === 'livslogg' },
    { id: 'barnporten', label: 'Barnporten', to: '/familjen?tab=barnporten', icon: 'users', active: t === 'barnporten' },
    { id: 'hamn', label: 'Trygg hamn', to: '/familjen?tab=hamn', icon: 'anchor', active: t === 'hamn' },
  ];
}

function dagbokSlots(tab: string | null): HubContextSlot[] {
  const t = tab === 'speglar' ? 'speglar' : 'reflektion';
  return [
    { id: 'reflektion', label: 'Reflektion', to: NAV_PATHS.HJARTAT, icon: 'book', active: t === 'reflektion' },
    { id: 'speglar', label: 'Speglar', to: `${NAV_PATHS.HJARTAT}?tab=speglar`, icon: 'brain', active: t === 'speglar' },
    { id: 'familjen', label: 'Familjen', to: '/familjen', icon: 'users' },
    { id: 'vardagen', label: 'Liv och göra', to: '/vardagen', icon: 'sprout' },
  ];
}

export function resolveHubKey(pathname: string, search: string): HubContextKey {
  if (pathname.startsWith('/projekt') || pathname.startsWith('/planering')) {
    return 'planering';
  }
  if (pathname.startsWith('/mabra') || pathname.startsWith('/arbetsliv')) {
    return 'vardagen';
  }
  if (pathname.startsWith('/vardagen')) {
    return 'vardagen';
  }
  if (pathname.startsWith('/familjen')) return 'familjen';
  if (pathname.startsWith('/dagbok') || pathname.startsWith('/hjartat') || pathname.startsWith('/valvet')) {
    const tab = tabParam(search);
    if (tab === 'bevis') return 'default';
    return 'dagbok';
  }
  return 'default';
}

/** Exakt fyra kontextknappar för aktuell hub. */
export function getHubContextSlots(pathname: string, search: string): HubContextSlot[] {
  const tab = tabParam(search);
  const key = resolveHubKey(pathname, search);

  switch (key) {
    case 'planering':
      return planeringSlots(tab, pathname.startsWith('/projekt'));
    case 'familjen':
      return familjenSlots(tab);
    case 'vardagen':
      return vardagenSlots(pathname, search);
    case 'dagbok':
      return dagbokSlots(tab);
    default:
      return DEFAULT_SLOTS.map((s) => ({ ...s }));
  }
}

export type HubMoreActionId =
  | 'inkop'
  | 'planering'
  | 'arbetsliv'
  | 'note'
  | 'snabbval'
  | 'record'
  | 'ekonomi';

export const HUB_MORE_ACTIONS: {
  id: HubMoreActionId;
  label: string;
  to: string;
  icon: HubContextIconId;
}[] = [
  { id: 'inkop', label: 'Inköpslista', to: '/planering?tab=inkop', icon: 'list' },
  { id: 'planering', label: 'Planering', to: '/planering?tab=handling', icon: 'calendar' },
  { id: 'arbetsliv', label: 'Arbetsliv', to: '/arbetsliv', icon: 'clock' },
  { id: 'note', label: 'Anteckning', to: '/widget/anteckning', icon: 'note' },
  { id: 'snabbval', label: 'Snabbval', to: '/widget/snabbval', icon: 'sparkles' },
  { id: 'record', label: 'Tyst inspelning', to: '/widget/inspelning?autostart=1', icon: 'record' },
  { id: 'ekonomi', label: 'Ekonomi', to: '/vardagen?tab=ekonomi', icon: 'wallet' },
];
