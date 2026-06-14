import { InboxReviewQueue } from '@/modules/inkast/components/InboxReviewQueue';

/**
 * @deprecated Fas 1B — granska sker via ValvInputSuperModule + InboxReviewQueue.
 */
export function ValvInboxZone({ onBevisConfirmed }: { onBevisConfirmed?: (docId: string) => void }) {
  return (
    <div className="space-y-4 animate-fade-in">
      <InboxReviewQueue compact={false} prioritizeBevis onBevisConfirmed={onBevisConfirmed} />
    </div>
  );
}
