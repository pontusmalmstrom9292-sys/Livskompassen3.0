import { memo } from 'react';
import { Navigate, useLocation, useSearchParams } from 'react-router-dom';
import { NAV_PATHS } from '@/core/navigation/navTruth';
import { vaultRedirectSearch } from '@/core/navigation/vaultLegacyRedirect';
import { arbetslivTabToInputMode } from '../supermodule/arbetslivInputModes';

export type ArbetslivTab = 'stampla' | 'tid' | 'inkomster';

const LEGACY_PUBLIC_TABS = new Set<ArbetslivTab>(['stampla', 'tid', 'inkomster']);

function canonicalInputPath(tab: string | null): string {
  if (!tab || !LEGACY_PUBLIC_TABS.has(tab as ArbetslivTab)) {
    return '/arbetsliv/input';
  }
  const mode = arbetslivTabToInputMode(tab);
  if (mode === 'stampla') return '/arbetsliv/input';
  return `/arbetsliv/input?inputMode=${mode}`;
}

/**
 * Legacy shim — canonical UI lives at `/arbetsliv/input` (ArbetslivInputRoutes).
 * W3: `?tab=` och `/arbetsliv` redirectar till `?inputMode=`-rutter.
 */
export const ArbetslivHubPage = memo(function ArbetslivHubPage() {
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();
  const legacyTab = searchParams.get('tab');

  if (legacyTab === 'logg') {
    return <Navigate to="/vardagen?tab=ekonomi&inputMode=logg" replace />;
  }

  if (legacyTab === 'franvaro') {
    return (
      <Navigate
        to={{ pathname: NAV_PATHS.VALVET, search: vaultRedirectSearch('arbetsliv_franvaro') }}
        replace
      />
    );
  }
  if (legacyTab === 'lon') {
    return (
      <Navigate
        to={{ pathname: NAV_PATHS.VALVET, search: vaultRedirectSearch('arbetsliv_lon') }}
        replace
      />
    );
  }

  if (pathname === '/arbetsliv') {
    return <Navigate to={canonicalInputPath(legacyTab)} replace />;
  }

  return <Navigate to="/arbetsliv/input" replace />;
});
