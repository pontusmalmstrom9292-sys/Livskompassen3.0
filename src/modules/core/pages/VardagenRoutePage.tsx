import { lazy, Suspense } from 'react';
import { HubPanelSkeleton } from '@/core/ui/HubPanelSkeleton';

const LivLauncherPage = lazy(() =>
  import('@/modules/shell/LivLauncherPage').then((m) => ({ default: m.LivLauncherPage })),
);

/** Route-silo för `/vardagen` — tung launcher lazy-loadas efter route-chunk. */
export function VardagenRoutePage() {
  return (
    <Suspense
      fallback={
        <div className="px-4 py-6">
          <HubPanelSkeleton lines={4} />
        </div>
      }
    >
      <LivLauncherPage />
    </Suspense>
  );
}
