import { CHILD_ALIASES, type ChildAlias } from '@/features/family/children/constants';
import { SaveAsEvidencePrompt } from '@/features/family/children/components/SaveAsEvidencePrompt';
import type { SubmitInkastLiteItemResult } from '../api/inkastService';

export type InkastBarnenBridgePayload = {
  childrenLogId: string;
  childAlias: ChildAlias;
  observation: string;
  category: string;
};

export function resolveInkastChildAlias(raw: string | undefined): ChildAlias {
  const trimmed = raw?.trim();
  if (trimmed && (CHILD_ALIASES as readonly string[]).includes(trimmed)) {
    return trimmed as ChildAlias;
  }
  return 'Kasper';
}

/** Props för Valv HITL efter G10 persist till children_logs — aldrig auto-promote. */
export function inkastBarnenBridgeProps(
  item: SubmitInkastLiteItemResult,
): InkastBarnenBridgePayload | null {
  if (item.action !== 'persisted' || item.collection !== 'children_logs' || !item.docId) {
    return null;
  }
  return {
    childrenLogId: item.docId,
    childAlias: resolveInkastChildAlias(item.classification.childAlias),
    observation: item.classification.summary || item.fileName,
    category: item.classification.category || 'vardag',
  };
}

type Props = InkastBarnenBridgePayload & {
  userId: string;
  onDone: () => void;
};

/** Explicit Valv-bro efter inkast → Barnen — samma mönster som Barnporten HITL. */
export function InkastBarnenValvBridge({
  userId,
  childrenLogId,
  childAlias,
  observation,
  category,
  onDone,
}: Props) {
  return (
    <SaveAsEvidencePrompt
      userId={userId}
      childAlias={childAlias}
      childrenLogId={childrenLogId}
      observation={observation}
      category={category}
      onDone={onDone}
    />
  );
}
