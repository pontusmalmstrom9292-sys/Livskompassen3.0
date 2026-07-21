import { SkeletonStack } from '@/design-system';
import { cn } from '@/design-system/utils/cn';

type HubPanelSkeletonProps = {
  label?: string;
  lines?: number;
  className?: string;
};

/** Kompakt laddningsskelett för hub-paneler och lazy zones. */
export function HubPanelSkeleton({ className, ...props }: HubPanelSkeletonProps) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-border/30 bg-surface-2/35 px-3 py-2 shadow-[0_1px_0_color-mix(in_srgb,var(--accent-light)_8%,transparent)_inset]',
        className,
      )}
      aria-busy="true"
    >
      <SkeletonStack className="py-2" {...props} />
    </div>
  );
}
