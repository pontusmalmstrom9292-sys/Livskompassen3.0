import { Loader2 } from 'lucide-react';

type HubPanelSkeletonProps = {
  label?: string;
  lines?: number;
};

/** Kompakt laddningsskelett för hub-paneler och lazy zones. */
export function HubPanelSkeleton({ label = 'Laddar…', lines = 3 }: HubPanelSkeletonProps) {
  return (
    <div className="animate-pulse space-y-3 py-4" aria-busy="true" aria-label={label}>
      <p className="flex items-center gap-2 text-xs text-text-dim">
        <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
        {label}
      </p>
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="h-10 rounded-xl border border-border/30 bg-surface-3/40" />
      ))}
    </div>
  );
}
