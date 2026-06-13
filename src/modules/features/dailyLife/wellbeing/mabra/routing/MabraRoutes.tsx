import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { MabraLayout } from '../components/MabraLayout';

const MabraHubView = lazy(() => import('../views/MabraHubView').then((m) => ({ default: m.MabraHubView })));
const MabraToolView = lazy(() => import('../views/MabraToolView').then((m) => ({ default: m.MabraToolView })));
const MabraProjectView = lazy(() => import('../views/MabraProjectView').then((m) => ({ default: m.MabraProjectView })));
const MabraExerciseView = lazy(() => import('../views/MabraExerciseView').then((m) => ({ default: m.MabraExerciseView })));

const ValuesView = lazy(() => import('../views/MabraFlowViews').then((m) => ({ default: m.ValuesView })));
const AkutView = lazy(() => import('../views/MabraFlowViews').then((m) => ({ default: m.AkutView })));
const DurationView = lazy(() => import('../views/MabraFlowViews').then((m) => ({ default: m.DurationView })));
const AddonView = lazy(() => import('../views/MabraFlowViews').then((m) => ({ default: m.AddonView })));
const CompleteView = lazy(() => import('../views/MabraFlowViews').then((m) => ({ default: m.CompleteView })));

export function MabraRoutes() {
  return (
    <Routes>
      <Route element={<MabraLayout />}>
        <Route index element={<Suspense fallback={null}><MabraHubView /></Suspense>} />
        <Route path="verktyg/:toolId" element={<Suspense fallback={null}><MabraToolView /></Suspense>} />
        <Route path="projekt/:projectId" element={<Suspense fallback={null}><MabraProjectView /></Suspense>} />
        <Route path="varderingar" element={<Suspense fallback={null}><ValuesView /></Suspense>} />
        <Route path="akut" element={<Suspense fallback={null}><AkutView /></Suspense>} />
        <Route path="tid" element={<Suspense fallback={null}><DurationView /></Suspense>} />
        <Route path="ovning/:exerciseId" element={<Suspense fallback={null}><MabraExerciseView /></Suspense>} />
        <Route path="ovning/tillagg" element={<Suspense fallback={null}><AddonView /></Suspense>} />
        <Route path="klart" element={<Suspense fallback={null}><CompleteView /></Suspense>} />
      </Route>
    </Routes>
  );
}
