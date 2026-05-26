/**
 * Deterministiska deep links mellan moduler (Fas B) — ingen RAG.
 */

export type ModuleLinkTarget =
  | { module: 'mabra'; hub?: 'panic_rsd' | 'self_critical' | 'find_self' }
  | { module: 'familjen'; tab?: string }
  | { module: 'kompasser' }
  | { module: 'dagbok'; from?: 'mabra'; energy?: 'low'; tab?: string }
  | { module: 'hamn'; tab?: string }
  | { module: 'planering'; tab?: 'handling' | 'fokus' | 'inkorg' }
  | { module: 'projekt' }
  | { module: 'hem'; hash?: string };

export type ResolvedModuleLink = {
  pathname: string;
  search?: string;
  hash?: string;
};

export function resolveModuleLink(target: ModuleLinkTarget): ResolvedModuleLink {
  switch (target.module) {
    case 'mabra':
      return { pathname: '/mabra' };
    case 'familjen': {
      const tab = target.tab ?? 'reflektion';
      return { pathname: '/familjen', search: `?tab=${tab}` };
    }
    case 'kompasser':
      return { pathname: '/vardagen', search: '?tab=kompasser' };
    case 'dagbok': {
      const params = new URLSearchParams();
      if (target.tab) params.set('tab', target.tab);
      if (target.from === 'mabra') params.set('from', 'mabra');
      if (target.energy) params.set('energy', target.energy);
      const q = params.toString();
      return { pathname: '/dagbok', search: q ? `?${q}` : undefined };
    }
    case 'hamn': {
      const tab = target.tab ?? 'biff';
      return { pathname: '/hamn', search: `?tab=${tab}` };
    }
    case 'planering': {
      const tab = target.tab ?? 'handling';
      return {
        pathname: '/planering',
        search: tab === 'handling' ? undefined : `?tab=${tab}`,
      };
    }
    case 'projekt':
      return { pathname: '/projekt' };
    case 'hem':
      return { pathname: '/', hash: target.hash };
    default:
      return { pathname: '/' };
  }
}

export function moduleLinkToString(link: ResolvedModuleLink): string {
  return `${link.pathname}${link.search ?? ''}${link.hash ?? ''}`;
}
