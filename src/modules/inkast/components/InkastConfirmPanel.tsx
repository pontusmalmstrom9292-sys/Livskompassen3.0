import { CheckCircle2, Loader2 } from 'lucide-react';
import { clsx } from 'clsx';
import type { InboxClassification } from '@/features/lifeJournal/evidence/kompis/api/inboxService';
import { ROUTING_LABELS } from '../api/inkastService';
import { InkastManualEditForm } from './InkastManualEditForm';
import { UnifiedHitlPreview } from './UnifiedHitlPreview';
import {
  INKAST_SILO_DESCRIPTIONS,
  INKAST_SILO_LABELS,
  routingToUiSilo,
  type InkastManualChoice,
  type InkastUiSilo,
} from '../constants/inkastSiloOptions';

type Props = {
  mode: 'confirm' | 'edit';
  classification: InboxClassification;
  previewLabel: string;
  busy?: boolean;
  silo: InkastUiSilo;
  tags: string[];
  comment: string;
  childAlias: string;
  onConfirm: () => void;
  onStartEdit: () => void;
  /** Avbryt hela uppladdningen (töm bilaga/förhandsgranskning). */
  onAbort: () => void;
  onSiloChange: (silo: InkastUiSilo) => void;
  onTagsChange: (tags: string[]) => void;
  onCommentChange: (value: string) => void;
  onChildAliasChange: (value: string) => void;
  onManualSave: (choice: InkastManualChoice) => void;
  onCancelEdit: () => void;
  accentClass?: string;
  panelClass?: string;
};

/** Bekräftelse + manuell redigering — HITL1 unified preview. */
export function InkastConfirmPanel({
  mode,
  classification,
  previewLabel,
  busy = false,
  silo,
  tags,
  comment,
  childAlias,
  onConfirm,
  onStartEdit,
  onAbort,
  onSiloChange,
  onTagsChange,
  onCommentChange,
  onChildAliasChange,
  onManualSave,
  onCancelEdit,
  accentClass = 'text-accent',
  panelClass = 'bg-surface-3/50',
}: Props) {
  if (mode === 'edit') {
    return (
      <InkastManualEditForm
        silo={silo}
        tags={tags}
        comment={comment}
        childAlias={childAlias}
        busy={busy}
        onSiloChange={onSiloChange}
        onTagsChange={onTagsChange}
        onCommentChange={onCommentChange}
        onChildAliasChange={onChildAliasChange}
        onSave={onManualSave}
        onCancel={onCancelEdit}
      />
    );
  }

  const routingLabel = ROUTING_LABELS[classification.routing] ?? 'Granska';
  const uiSilo = routingToUiSilo(classification.routing);
  const siloHint = INKAST_SILO_LABELS[uiSilo];
  const siloDescription = INKAST_SILO_DESCRIPTIONS[uiSilo];
  const confidencePct =
    typeof classification.confidence === 'number'
      ? Math.round(classification.confidence * 100)
      : undefined;

  return (
    <div className={clsx('animate-fade-in', panelClass.includes('rounded') ? '' : '')}>
      <UnifiedHitlPreview
        hitlBadge="HITL · bekräfta föreslagen silo"
        siloLabel={routingLabel}
        siloHint={siloHint}
        siloDescription={siloDescription}
        confidencePct={confidencePct}
        previewLabel={previewLabel}
        summary={classification.summary}
        busy={busy}
        confirmLabel="Godkänn"
        dismissLabel="Avbryt uppladdning"
        onConfirm={onConfirm}
        onEdit={onStartEdit}
        onDismiss={onAbort}
        panelClass={panelClass}
        accentClass={accentClass}
        extraWarning={
          uiSilo === 'valv' ? (
            <p className="mt-2 rounded-lg border border-accent/20 bg-surface-2/50 px-2 py-1.5 text-[11px] leading-relaxed text-text-dim">
              Arkiv = oföränderlig post. Beteende och datum — kan inte raderas efter godkännande.
            </p>
          ) : undefined
        }
      />
    </div>
  );
}
