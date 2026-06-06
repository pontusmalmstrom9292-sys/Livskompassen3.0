import type { InboxQueueItem } from '@/features/lifeJournal/evidence/kompis/api/inboxService';
import { ROUTING_LABELS } from '@/modules/inkast/api/inkastService';

/** Delad G10-etikett — samma semantik i Hem-summary och Valv InboxReviewQueue. */
export function inboxQueueStatusLabel(item: InboxQueueItem): string {
  const confidence = typeof item.confidence === 'number' ? item.confidence : 0;
  if (item.proposedRouting === 'review' || confidence < 0.75) {
    return 'Status: granska';
  }
  const routingLabel = ROUTING_LABELS[item.proposedRouting as keyof typeof ROUTING_LABELS];
  return `Status: förslag → ${routingLabel ?? item.proposedRouting}`;
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
