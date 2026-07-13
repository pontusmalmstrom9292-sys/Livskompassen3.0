import { VaultVitHubPanel } from '../VaultVitHubPanel';
import { HubErrorBoundary } from '@/shared/ui/HubErrorBoundary';
import { VALV_VIT_ZONE_ERROR_TITLE } from '@/modules/core/copy/valvNavCopy';

export type ValvVitZoneProps = {
  userId: string;
};

/** P2 — Min utveckling (personlig silo, ej bevis-WORM). */
export function ValvVitZone({ userId }: ValvVitZoneProps) {
  return (
    <HubErrorBoundary title={VALV_VIT_ZONE_ERROR_TITLE} glow="green" logTag="ValvVitZone">
      <div className="valv-zone-stack">
        <VaultVitHubPanel userId={userId} />
      </div>
    </HubErrorBoundary>
  );
}
