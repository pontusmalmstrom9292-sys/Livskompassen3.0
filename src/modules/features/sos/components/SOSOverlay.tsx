import { useSOSStore } from '@/modules/core/store/sosStore';
import { HubErrorBoundary } from '@/shared/ui/HubErrorBoundary';
import { RecoveryUrgeSosModule } from '@/features/mabra/components/RecoveryUrgeSosModule';

/**
 * Global SOS — samma ankare/andning/grounding som MåBra Recovery SOS.
 * Behåller krisresurser via RecoveryUrgeSosModule (ingen separat andnings-overlay).
 */
export function SOSOverlay() {
  const isSOSActive = useSOSStore((s) => s.isSOSActive);
  const deactivateSOS = useSOSStore((s) => s.deactivateSOS);

  if (!isSOSActive) return null;

  return (
    <HubErrorBoundary
      title="SOS kunde inte öppnas"
      glow="gold"
      logTag="SOSOverlay"
      errorBody="Stäng och öppna SOS igen. Du är trygg."
    >
      <RecoveryUrgeSosModule onClose={deactivateSOS} />
    </HubErrorBoundary>
  );
}
