import { CheckCircle2, Loader2 } from 'lucide-react';
import { clsx } from 'clsx';
import type { InboxClassification } from '@/features/lifeJournal/evidence/kompis/api/inboxService';
import { ROUTING_LABELS } from '../api/inkastService';
import { InkastManualEditForm } from './InkastManualEditForm';
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

/** Bekräftelse + manuell redigering — Cognitive Load (ett steg i taget). */
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

  return (
    <div
      className={clsx(
        'animate-fade-in flex flex-col gap-4 rounded-2xl p-5 shadow-lg backdrop-blur-md',
        panelClass,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-text-dim">
            AI-förslag:
          </span>
          <p className={clsx('mt-1.5 text-sm font-semibold', accentClass)}>{routingLabel}</p>
          <p className="mt-1 text-xs text-text-muted">{siloHint}</p>
          <p className="mt-1 text-xs leading-relaxed text-text-dim">{siloDescription}</p>
          {classification.summary && (
            <p className="mt-2 text-xs text-text-dim">{classification.summary}</p>
          )}
          {uiSilo === 'valv' && (
            <p className="mt-2 rounded-lg border border-accent/20 bg-surface-2/50 px-2 py-1.5 text-[11px] leading-relaxed text-text-dim">
              Arkiv = oföränderlig post. Beteende och datum — kan inte raderas efter godkännande.
            </p>
          )}
        </div>
        <span className="max-w-[140px] truncate text-right text-xs text-text">{previewLabel}</span>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onConfirm}
          disabled={busy}
          className="btn-pill--primary flex flex-1 items-center justify-center gap-2 text-xs"
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
          <CheckCircle2 className="h-4 w-4" aria-hidden />
          Godkänn
        </button>
        <button
          type="button"
          onClick={onStartEdit}
          disabled={busy}
          className="btn-pill--ghost text-xs"
        >
          Ändra
        </button>
        <button
          type="button"
          onClick={onAbort}
          disabled={busy}
          className="btn-pill--ghost text-xs text-text-dim"
        >
          Avbryt uppladdning
        </button>
      </div>
    </div>
  );
}
