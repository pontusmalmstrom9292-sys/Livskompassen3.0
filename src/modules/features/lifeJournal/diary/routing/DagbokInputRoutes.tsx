import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';

const DagbokInputSuperModuleLazy = lazy(() =>
  import('../supermodule/DagbokInputSuperModule').then((m) => ({
    default: m.DagbokInputSuperModule,
  })),
);

/**
 * Shadow routing for Superdagbok Universal Input Hub (Fas 11C).
 * W5 mounts under `/hjartat/*` — e.g. `<Route path="/hjartat/*" element={<DagbokInputRoutes />} />`.
 *
 * Canonical entry: `/hjartat/input?inputMode=reflektion|quick_mirror|arkiv`
 */
export function DagbokInputRoutes() {
  return (
    <Routes>
      <Route
        path="input"
        element={
          <Suspense fallback={null}>
            <DagbokInputSuperModuleLazy />
          </Suspense>
        }
      />
    </Routes>
  );
}
