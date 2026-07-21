import { lazy, Suspense } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { ProtectedModule } from '../../../components/layout/ProtectedModule';
import { HubPanelSkeleton } from '@/core/ui/HubPanelSkeleton';
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
      <Suspense
        fallback={
          <div className="px-4 py-6">
            <HubPanelSkeleton lines={4} />
          </div>
        }
      >
        <DagbokPage />
      </Suspense>
    </ProtectedModule>
  );
}
