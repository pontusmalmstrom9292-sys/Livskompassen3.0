// Sidor — importeras via React.lazy() i AppRoutes, utgör egna chunk-gränser.
export { PlaneringPage } from './components/PlaneringPage';
export { PlaneringKalenderPage } from './components/PlaneringKalenderPage';

// Sub-moduler — importeras direkt av PlaneringPage/FamiljenPage, INTE via AppRoutes barrel.
// Lägg inte till nya side-level routes här utan att göra dem lazy i AppRoutes.
export { PlaneringSuperModule, type PlaneringSuperVariant } from './components/PlaneringSuperModule';
export { GoraSuperModule, type GoraSuperVariant } from './components/GoraSuperModule';
export { GoraModulValjare } from './components/GoraModulValjare';
export { ExamplePreviewCard, type ExamplePreviewCardProps } from '@/shared/ui/ExamplePreviewCard';
