import { lazy, Suspense } from 'react';
import { Navigate, Routes, Route } from 'react-router-dom';
import { HubPanelSkeleton } from '@/core/ui/HubPanelSkeleton';
import { PlaneringErrorBoundary } from '../components/PlaneringErrorBoundary';

const PlaneringInputSuperModuleLazy = lazy(() =>
  import('../supermodule/PlaneringInputSuperModule').then((m) => ({
    default: m.PlaneringInputSuperModule,
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
 * Skuggrutt-skelett för Planering Universal Input Hub (Fas 9C).
 * W3 monterar under `/planering/*` i AppRoutes — denna fil skriver inte till Firestore.
 */
export function PlaneringInputRoutes() {
  return (
    <PlaneringErrorBoundary>
      <Routes>
        <Route
          path="input"
          element={
            <Suspense fallback={<InputFallback />}>
              <PlaneringInputSuperModuleLazy />
            </Suspense>
          }
        />
        <Route path="*" element={<Navigate to="/planering" replace />} />
      </Routes>
    </PlaneringErrorBoundary>
  );
}
