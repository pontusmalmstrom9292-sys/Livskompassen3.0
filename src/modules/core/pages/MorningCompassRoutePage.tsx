import { lazy, Suspense } from 'react';
import { HubErrorBoundary } from '@/shared/ui/HubErrorBoundary';
import { HubPanelSkeleton } from '@/core/ui/HubPanelSkeleton';
import { NAV_PATHS } from '@/core/navigation/navTruth';

const MorningCompass = lazy(() =>
  import('@/modules/morning/MorningCompass').then((m) => ({ default: m.MorningCompass })),
);

/** `/morgon` — morgonkompass med modul-error boundary. */
export function MorningCompassRoutePage() {
  return (
    <HubErrorBoundary
      title="Morgonkompassen kunde inte laddas"
      glow="gold"
      backTo={NAV_PATHS.VARDAGEN}
      backLabel="Till Liv och göra"
      logTag="MorningCompassRoutePage"
    >
      <Suspense
        fallback={
          <div className="px-4 py-6">
            <HubPanelSkeleton lines={4} />
          </div>
        }
      >
        <MorningCompass />
      </Suspense>
    </HubErrorBoundary>
  );
}
