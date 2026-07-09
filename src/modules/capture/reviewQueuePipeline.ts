import type { BadgeVariant } from '@/design-system';
import type { InboxQueueItem } from '@/features/lifeJournal/evidence/kompis/api/inboxService';
import { ROUTING_LABELS } from '@/modules/inkast/api/inkastService';
import { isPlaneringInboxItem } from '@/modules/inkast/planeringInboxItem';

/** G10 visningsstatus — samma i Hem, Planering och Valv Samla. */
export type InboxQueueDisplayStatus = 'routed' | 'review' | 'rejected';

const REVIEW_CONFIDENCE_THRESHOLD = 0.75;

export function inboxQueueDisplayStatus(item: InboxQueueItem): InboxQueueDisplayStatus {
  const confidence = typeof item.confidence === 'number' ? item.confidence : 0;
  if (item.proposedRouting === 'review' || confidence < REVIEW_CONFIDENCE_THRESHOLD) {
    return 'review';
  }
  return 'routed';
}

export function inboxQueueStatusBadgeClass(status: InboxQueueDisplayStatus): string {
  if (status === 'routed') return 'review-queue-status review-queue-status--routed';
  if (status === 'rejected') return 'review-queue-status review-queue-status--rejected';
  return 'review-queue-status review-queue-status--review';
}

/** DS Badge variant for inbox queue status pills. */
export function inboxQueueStatusBadgeVariant(status: InboxQueueDisplayStatus): BadgeVariant {
  if (status === 'routed') return 'accent';
  if (status === 'rejected') return 'danger';
  return 'warning';
}

/** Delad G10-etikett — samma semantik i Hem-summary och Valv InboxReviewQueue. */
export function inboxQueueStatusLabel(item: InboxQueueItem): string {
  const status = inboxQueueDisplayStatus(item);
  if (status === 'review') {
    if (isPlaneringInboxItem(item)) return 'Status: planering · granska';
    return 'Status: granska';
  }
  const routingLabel = ROUTING_LABELS[item.proposedRouting as keyof typeof ROUTING_LABELS];
  return `Status: dirigerad → ${routingLabel ?? item.proposedRouting}`;
}

export function draftFailedStatusLabel(): string {
  return 'Status: avvisad';
}

export function draftPendingStatusLabel(): string {
  return 'Status: väntar synk';
}

/** Valv Samla: bevis och osäkra poster först. */
export function sortInboxForValvSamla(items: InboxQueueItem[]): InboxQueueItem[] {
  const score = (item: InboxQueueItem) => {
    const confidence = typeof item.confidence === 'number' ? item.confidence : 0;
    if (item.proposedRouting === 'bevis') return 0;
    if (item.proposedRouting === 'review' || confidence < 0.75) return 1;
    if (item.traumaSensitive) return 2;
    return 3;
  };
  return [...items].sort((a, b) => score(a) - score(b));
}

export function draftRoutingLabel(routing: string | undefined): string {
  if (!routing) return 'Granska';
  return ROUTING_LABELS[routing as keyof typeof ROUTING_LABELS] ?? 'Granska';
}
