import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

const PlaneringInputSuperModuleLazy = lazy(() =>
  import('../supermodule/PlaneringInputSuperModule').then((m) => ({
    default: m.PlaneringInputSuperModule,
  })),
);

/**
 * Skuggrutt-skelett för Planering Universal Input Hub (Fas 9C).
 * W3 monterar under `/planering/*` i AppRoutes — denna fil skriver inte till Firestore.
 */
export function PlaneringInputRoutes() {
  return (
    <Routes>
      <Route
        path="input"
        element={
          <Suspense fallback={null}>
            <PlaneringInputSuperModuleLazy />
          </Suspense>
        }
      />
    </Routes>
  );
}
