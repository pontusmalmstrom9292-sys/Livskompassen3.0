import type { InboxClassification } from '@/features/lifeJournal/evidence/kompis/api/inboxService';
import type { InkastUiSilo } from '../constants/inkastSiloOptions';
import type { SubmitInkastLiteResult } from '../api/inkastService';
import { primaryInkastItem } from '../api/inkastService';

export type InkastOutcomeKind = 'queued' | 'worm' | 'persisted' | 'failed' | 'mixed';

/** Inkast ska till reality_vault (WORM) — kräver explicit bekräftelse före submit. */
export function inkastTargetsWorm(
  classification: InboxClassification,
  silo?: InkastUiSilo,
): boolean {
  if (silo) return silo === 'valv';
  return classification.routing === 'bevis';
}

export function classifyInkastOutcome(result: SubmitInkastLiteResult): InkastOutcomeKind {
  const { failed, queued, persisted, items } = result;
  if (failed > 0 && queued === 0 && persisted === 0) return 'failed';
  if (queued > 0 && persisted === 0) return 'queued';
  if (persisted > 0 && queued === 0 && failed === 0) {
    const wormCount = items.filter(
      (i) => i.action === 'persisted' && i.collection === 'reality_vault',
    ).length;
    if (wormCount === persisted) return 'worm';
    return 'persisted';
  }
  return 'mixed';
}

export function inkastOutcomeHeadline(result: SubmitInkastLiteResult): string {
  const kind = classifyInkastOutcome(result);
  const primary = primaryInkastItem(result);

  switch (kind) {
    case 'queued':
      return 'Väntar ditt godkännande — inget arkiv än';
    case 'worm':
      return 'Låst i arkivet — oföränderlig post';
    case 'persisted':
      return 'Sparat i rätt silo';
    case 'failed':
      return 'Kunde inte spara';
    case 'mixed':
      return 'Delvis klart — kontrollera status nedan';
    default:
      return primary.classification.summary;
  }
}
