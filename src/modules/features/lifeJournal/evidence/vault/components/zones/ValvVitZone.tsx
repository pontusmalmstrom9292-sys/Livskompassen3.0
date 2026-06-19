import { VaultVitHubPanel } from '../VaultVitHubPanel';
import { HubErrorBoundary } from '@/shared/ui/HubErrorBoundary';

export type ValvVitZoneProps = {
  userId: string;
};

/** P2 — Mitt Vit (personlig silo, ej bevis-WORM). */
export function ValvVitZone({ userId }: ValvVitZoneProps) {
  return (
    <HubErrorBoundary title="Mitt Vit kunde inte laddas" glow="green" logTag="ValvVitZone">
      <VaultVitHubPanel userId={userId} />
    </HubErrorBoundary>
  );
}
