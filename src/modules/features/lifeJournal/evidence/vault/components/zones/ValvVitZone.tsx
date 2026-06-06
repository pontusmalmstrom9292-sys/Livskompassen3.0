import { VaultVitHubPanel } from '../VaultVitHubPanel';

export type ValvVitZoneProps = {
  userId: string;
};

/** P2 — Mitt Vit (personlig silo, ej bevis-WORM). */
export function ValvVitZone({ userId }: ValvVitZoneProps) {
  return <VaultVitHubPanel userId={userId} />;
}
