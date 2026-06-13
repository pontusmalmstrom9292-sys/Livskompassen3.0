import { InboxReviewQueue } from '@/modules/inkast/components/InboxReviewQueue';

export function ValvInboxZone({ onBevisConfirmed }: { onBevisConfirmed?: (docId: string) => void }) {
  return (
    <div className="space-y-4 animate-fade-in">
      <InboxReviewQueue compact={false} prioritizeBevis={true} onBevisConfirmed={onBevisConfirmed} />
    </div>
  );
}
