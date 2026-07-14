import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { HubPanelSkeleton } from '@/core/ui/HubPanelSkeleton';
import { HubErrorBoundary } from '@/shared/ui/HubErrorBoundary';
import { NAV_PATHS } from '@/core/navigation/navTruth';

const ArbetslivInputSuperModuleLazy = lazy(() =>
  import('../supermodule/ArbetslivInputSuperModule').then((m) => ({
    default: m.ArbetslivInputSuperModule,
  })),
);

function InputFallback() {
  return (
    <div className="px-4 py-6">
      <HubPanelSkeleton lines={4} />
    </div>
  );
}

/**
 * Shadow routing for Arbetsliv Universal Input Hub (Fas 10C).
 * W3 mounts under `/arbetsliv/*` — e.g. `<Route path="/arbetsliv/*" element={<ArbetslivInputRoutes />} />`.
 *
 * Canonical entry: `/arbetsliv/input?inputMode=stampla|inkomster|tid`
 */
export function ArbetslivInputRoutes() {
  return (
    <HubErrorBoundary
      title="Arbetsliv kunde inte laddas"
      glow="gold"
      backTo={NAV_PATHS.VARDAGEN}
      backLabel="Till Liv och göra"
      logTag="ArbetslivInputRoutes"
    >
      <Routes>
        <Route
          path="input"
          element={
            <Suspense fallback={<InputFallback />}>
              <ArbetslivInputSuperModuleLazy />
            </Suspense>
          }
        />
        <Route path="*" element={<Navigate to="/arbetsliv/input?inputMode=stampla" replace />} />
      </Routes>
    </HubErrorBoundary>
  );
}

export { vaultDrawerPath } from '@/core/navigation/navTruth';
