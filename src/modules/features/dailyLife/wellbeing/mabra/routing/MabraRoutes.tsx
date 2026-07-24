import { lazy, Suspense, type ReactNode } from 'react';
import { Navigate, Routes, Route } from 'react-router-dom';
import { MabraLayout } from '../components/MabraLayout';
import { HubPanelSkeleton } from '@/core/ui/HubPanelSkeleton';

const MabraHubView = lazy(() => import('../views/MabraHubView').then((m) => ({ default: m.MabraHubView })));
const MabraToolView = lazy(() => import('../views/MabraToolView').then((m) => ({ default: m.MabraToolView })));
const MabraProjectView = lazy(() => import('../views/MabraProjectView').then((m) => ({ default: m.MabraProjectView })));
const MabraExerciseView = lazy(() => import('../views/MabraExerciseView').then((m) => ({ default: m.MabraExerciseView })));

const ValuesView = lazy(() => import('../views/MabraFlowViews').then((m) => ({ default: m.ValuesView })));
const AkutView = lazy(() => import('../views/MabraFlowViews').then((m) => ({ default: m.AkutView })));
const DurationView = lazy(() => import('../views/MabraFlowViews').then((m) => ({ default: m.DurationView })));
const AddonView = lazy(() => import('../views/MabraFlowViews').then((m) => ({ default: m.AddonView })));
const CompleteView = lazy(() => import('../views/MabraFlowViews').then((m) => ({ default: m.CompleteView })));
const MabraInputSuperModuleLazy = lazy(() =>
  import('../supermodule/MabraInputSuperModule').then((m) => ({ default: m.MabraInputSuperModule })),
);
const RecoverySosView = lazy(() =>
  import('../views/RecoverySosView').then((m) => ({ default: m.RecoverySosView })),
);

function MabraSuspense({ children }: { children: ReactNode }) {
  return <Suspense fallback={<HubPanelSkeleton label="Laddar MåBra…" lines={4} />}>{children}</Suspense>;
}

export function MabraRoutes() {
  return (
    <Routes>
      <Route element={<MabraLayout />}>
        <Route index element={<MabraSuspense><MabraHubView /></MabraSuspense>} />
        <Route path="verktyg/:toolId" element={<MabraSuspense><MabraToolView /></MabraSuspense>} />
        <Route path="recovery/sos" element={<MabraSuspense><RecoverySosView /></MabraSuspense>} />
        <Route path="projekt/:projectId" element={<MabraSuspense><MabraProjectView /></MabraSuspense>} />
        <Route path="varderingar" element={<MabraSuspense><ValuesView /></MabraSuspense>} />
        <Route path="akut" element={<MabraSuspense><AkutView /></MabraSuspense>} />
        <Route path="tid" element={<MabraSuspense><DurationView /></MabraSuspense>} />
        <Route path="ovning/:exerciseId" element={<MabraSuspense><MabraExerciseView /></MabraSuspense>} />
        <Route path="ovning/tillagg" element={<MabraSuspense><AddonView /></MabraSuspense>} />
        <Route path="input" element={<MabraSuspense><MabraInputSuperModuleLazy /></MabraSuspense>} />
        <Route path="klart" element={<MabraSuspense><CompleteView /></MabraSuspense>} />
        <Route path="*" element={<Navigate to="." replace />} />
      </Route>
    </Routes>
  );
}
