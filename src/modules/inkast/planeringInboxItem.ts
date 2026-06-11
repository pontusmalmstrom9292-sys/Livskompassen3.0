import type { InboxQueueItem } from '@/features/lifeJournal/evidence/kompis/api/inboxService';
import {
  classifyPasteText,
  type PasteClassification,
} from '@/features/admin/planning/rules/pasteClassifier';
import type { PlanningEmailRule } from '@/features/admin/planning/types/planningEmailRule';

/** Planering-taggad post i G10-kön (sourceModule planering_inkorg eller kategori). */
export function isPlaneringInboxItem(item: InboxQueueItem): boolean {
  if (item.category === 'planering') return true;
  if (item.tags?.some((t) => t === 'planering' || t === 'logistik')) return true;
  if (/planering_inkorg/i.test(item.fileName)) return true;
  return false;
}

/** Planering inkorg-vy: planering/logistik-poster först. */
export function sortInboxForPlaneringInkorg(items: InboxQueueItem[]): InboxQueueItem[] {
  return [...items].sort((a, b) => {
    const aPlan = isPlaneringInboxItem(a) ? 0 : 1;
    const bPlan = isPlaneringInboxItem(b) ? 0 : 1;
    if (aPlan !== bPlan) return aPlan - bPlan;
    const aConf = typeof a.confidence === 'number' ? a.confidence : 0;
    const bConf = typeof b.confidence === 'number' ? b.confidence : 0;
    return aConf - bConf;
  });
}

export function inboxItemPasteText(item: InboxQueueItem): string {
  const excerpt = item.analysisExcerpt?.trim();
  if (excerpt && excerpt.length >= 12) return excerpt.slice(0, 6000);
  const summary = item.summary?.trim();
  if (summary) return summary.slice(0, 6000);
  return item.fileName.trim() || 'Inkast från granskningskö';
}

/** Deterministisk — samma pasteClassifier som Planering mejl-flik. */
export function classifyInboxItemForHandling(
  item: InboxQueueItem,
  rules: PlanningEmailRule[] = [],
): PasteClassification {
  return classifyPasteText(inboxItemPasteText(item), rules);
}
