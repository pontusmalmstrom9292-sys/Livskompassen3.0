import { SkeletonStack } from '@/design-system';

type HubPanelSkeletonProps = {
  label?: string;
  lines?: number;
};

/** Kompakt laddningsskelett för hub-paneler och lazy zones. */
export function HubPanelSkeleton(props: HubPanelSkeletonProps) {
  return <SkeletonStack {...props} />;
}
