import { lazy, Suspense } from 'react';

const LivLauncherPage = lazy(() =>
  import('@/modules/shell/LivLauncherPage').then((m) => ({ default: m.LivLauncherPage })),
);

/** Route-silo för `/vardagen` — tung launcher lazy-loadas efter route-chunk. */
export function VardagenRoutePage() {
  return (
    <Suspense fallback={<div className="p-6 text-center text-sm text-text-muted">Laddar vardagen…</div>}>
      <LivLauncherPage />
    </Suspense>
  );
}
