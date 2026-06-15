import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';

const ArbetslivInputSuperModuleLazy = lazy(() =>
  import('../supermodule/ArbetslivInputSuperModule').then((m) => ({
    default: m.ArbetslivInputSuperModule,
  })),
);

/**
 * Shadow routing for Arbetsliv Universal Input Hub (Fas 10C).
 * W3 mounts under `/arbetsliv/*` — e.g. `<Route path="/arbetsliv/*" element={<ArbetslivInputRoutes />} />`.
 *
 * Canonical entry: `/arbetsliv/input?inputMode=stampla|inkomster|tid`
 */
export function ArbetslivInputRoutes() {
  return (
    <Routes>
      <Route
        path="input"
        element={
          <Suspense fallback={null}>
            <ArbetslivInputSuperModuleLazy />
          </Suspense>
        }
      />
    </Routes>
  );
}

export { vaultDrawerPath } from '@/core/navigation/navTruth';
