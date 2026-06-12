import React, { Suspense } from 'react';

const DiaryModule = React.lazy(() =>
  import('../../diary/components/supermodule/DagbokSuperModule').then((module) => ({
    default: module.DagbokSuperModule,
  }))
);

export function LazyDiary() {
  return (
    <Suspense fallback={
      <div className="flex h-64 w-full items-center justify-center rounded-2xl border border-border-muted bg-surface-2 shadow-inner">
        <div className="text-xs font-mono tracking-widest text-text-muted uppercase animate-pulse">
          Laddar dagbok...
        </div>
      </div>
    }>
      <DiaryModule />
    </Suspense>
  );
}
