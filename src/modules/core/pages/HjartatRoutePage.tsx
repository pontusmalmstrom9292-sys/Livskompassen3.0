import { lazy, Suspense } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { ProtectedModule } from '../../../components/layout/ProtectedModule';
import { NAV_PATHS } from '../navigation/navTruth';

const DagbokPage = lazy(() =>
  import('./DagbokPage').then((m) => ({ default: m.DagbokPage })),
);

/** Route-silo för `/hjartat` — blockera `?tab=bevis`, lazy-load DagbokPage. */
export function HjartatRoutePage() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  if (params.get('tab') === 'bevis') {
    const vaultTab = params.get('vaultTab') ?? 'logga';
    params.delete('tab');
    params.set('vaultTab', vaultTab);
    const search = params.toString();
    return (
      <Navigate
        to={{ pathname: NAV_PATHS.VALVET, search: search ? `?${search}` : '' }}
        replace
      />
    );
  }

  return (
    <ProtectedModule>
      <Suspense fallback={<div className="p-6 text-center text-sm text-text-muted">Laddar hjärtat…</div>}>
        <DagbokPage />
      </Suspense>
    </ProtectedModule>
  );
}
