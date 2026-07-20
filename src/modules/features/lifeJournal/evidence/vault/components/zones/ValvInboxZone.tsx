import { InboxReviewQueue } from '@/modules/inkast/components/InboxReviewQueue';
import { HubErrorBoundary } from '@/shared/ui/HubErrorBoundary';

/**
 * @deprecated Fas 1B — granska sker via ValvInputSuperModule + InboxReviewQueue.
 */
export function ValvInboxZone({ onBevisConfirmed }: { onBevisConfirmed?: (docId: string) => void }) {
  return (
    <HubErrorBoundary
      title="Granskningskö kunde inte laddas"
      glow="blue"
      logTag="ValvInboxZone"
      errorBody="Försök igen. Köade poster i Inkast påverkas inte."
    >
      <div className="valv-zone-stack space-y-4 animate-fade-in">
        <InboxReviewQueue compact={false} prioritizeBevis onBevisConfirmed={onBevisConfirmed} />
      </div>
    </HubErrorBoundary>
  );
}
