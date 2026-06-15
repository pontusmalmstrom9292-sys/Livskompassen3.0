import type {
  InboxQueueItem,
  InboxRouting,
} from '@/features/lifeJournal/evidence/kompis/api/inboxService';
import { inboxQueueDisplayStatus } from '@/modules/capture/reviewQueuePipeline';
import { COLLECTION_LABELS, ROUTING_LABELS } from './api/inkastService';
import { isPlaneringInboxItem } from './planeringInboxItem';

/** Deterministisk domän-hint — ingen LLM, ~80% HCF-upload-prior. */
const HCF_SIGNAL_TAGS = new Set([
  'gaslighting',
  'darvo',
  'triangulering',
  'biff',
  'grey_rock',
  'konflikt',
  'kommunikation',
  'sms',
]);

const ROUTING_TO_COLLECTION: Partial<Record<InboxRouting, string>> = {
  bevis: 'reality_vault',
  barnen: 'children_logs',
  dagbok: 'journal',
  kunskap: 'kb_docs',
};

/** HITL-etikett — alla poster i granskningskön väntar explicit godkännande. */
export function inboxReviewQueueHitlBadge(item: InboxQueueItem): string {
  const status = inboxQueueDisplayStatus(item);
  if (status === 'review') return 'HITL · manuell granskning';
  return 'HITL · bekräfta föreslagen silo';
}

/** Tydlig routing-rad med silo + målarkiv (U1). */
export function inboxReviewQueueRoutingLine(item: InboxQueueItem): string {
  const routing = item.proposedRouting as InboxRouting;
  const routingLabel = ROUTING_LABELS[routing] ?? 'Granska';
  const collection = ROUTING_TO_COLLECTION[routing];
  const destLabel = collection ? COLLECTION_LABELS[collection] : null;

  if (inboxQueueDisplayStatus(item) === 'review') {
    return `Routing: osäker — välj silo (förslag: ${routingLabel})`;
  }

  return destLabel
    ? `Föreslagen silo: ${routingLabel} → ${destLabel}`
    : `Föreslagen silo: ${routingLabel}`;
}

/** Domän-ledtråd per post — DCAP/heuristik, inte LLM. */
export function inboxReviewQueueDomainHint(item: InboxQueueItem): string | null {
  if (item.traumaSensitive) {
    return 'Känsligt ämne — DCAP kräver ditt val innan spar (fail-closed).';
  }
  if (isPlaneringInboxItem(item)) {
    return 'Logistik — kan bli uppgift i Handling eller sparas i arkiv.';
  }
  if (item.proposedRouting === 'bevis' || item.tags.some((t) => HCF_SIGNAL_TAGS.has(t))) {
    return 'Kommunikation eller bevis — separat WORM-arkiv. Tre silos, ingen cross-RAG.';
  }
  if (item.proposedRouting === 'barnen' || item.childAlias) {
    return 'Barnobservation — barnloggar (egen silo). Valv endast via explicit val efter spar.';
  }
  if (item.proposedRouting === 'kunskap') {
    return 'Metod eller fakta — Kunskapsbank bakom PIN.';
  }
  if (item.proposedRouting === 'dagbok') {
    return 'Personlig reflektion — Dagbok (journal).';
  }
  if (inboxQueueDisplayStatus(item) === 'review') {
    return 'Osäker routing — välj silo manuellt. DCAP före AI.';
  }
  return null;
}

/** Markera knapp som matchar AI/heuristik-förslag (HITL bekräftar, ändrar inte automatiskt). */
export function isProposedRoutingButton(
  routing: 'kunskap' | 'bevis' | 'barnen' | 'dagbok',
  item: InboxQueueItem,
): boolean {
  if (inboxQueueDisplayStatus(item) !== 'routed') return false;
  return item.proposedRouting === routing;
}
