import type { AdaptationSilo } from '../types/adaptation';

export interface RouteAdaptationSignal {
  signalKey: string;
  silo: AdaptationSilo;
}

/** Deterministisk route → signal (ingen LLM). */
export function resolveRouteAdaptationSignal(
  pathname: string,
  search: string,
): RouteAdaptationSignal | null {
  const path = pathname.toLowerCase();
  const tab = new URLSearchParams(search).get('tab')?.toLowerCase() ?? '';

  if (path === '/' || path === '') {
    return { signalKey: 'route_home', silo: 'core' };
  }

  if (path.startsWith('/valvet') || path.startsWith('/valv')) {
    return { signalKey: 'route_valv', silo: 'valv' };
  }

  if (path.startsWith('/hjartat') || path.startsWith('/dagbok')) {
    return { signalKey: 'route_hjartat', silo: 'core' };
  }

  if (path.startsWith('/familjen') || path.startsWith('/barnen') || path.startsWith('/hamn')) {
    if (tab === 'hamn') return { signalKey: 'route_hamn', silo: 'barnen' };
    if (tab === 'barnporten') return { signalKey: 'route_barnporten', silo: 'barnen' };
    return { signalKey: 'route_familjen', silo: 'barnen' };
  }

  if (
    path.startsWith('/vardagen') ||
    path.startsWith('/liv') ||
    path.startsWith('/mabra') ||
    path.startsWith('/planering') ||
    path.startsWith('/ekonomi') ||
    path.startsWith('/arbetsliv') ||
    path.startsWith('/stampla')
  ) {
    if (tab === 'mabra') return { signalKey: 'route_mabra', silo: 'vardag' };
    if (tab === 'handling' || path.startsWith('/planering')) {
      return { signalKey: 'route_planering', silo: 'vardag' };
    }
    if (tab === 'ekonomi' || path.startsWith('/ekonomi')) {
      return { signalKey: 'route_ekonomi', silo: 'vardag' };
    }
    return { signalKey: 'route_vardagen', silo: 'vardag' };
  }

  if (path.startsWith('/kunskap') || path.includes('kunskapsbank')) {
    return { signalKey: 'route_kunskap', silo: 'kunskap' };
  }

  if (path.startsWith('/installningar')) {
    return { signalKey: 'route_installningar', silo: 'core' };
  }

  if (path.startsWith('/widget/')) {
    return { signalKey: 'route_widget', silo: 'core' };
  }

  return { signalKey: 'route_other', silo: 'core' };
}
