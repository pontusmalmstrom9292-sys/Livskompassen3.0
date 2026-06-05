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
  category: string;
  comment: string;
  childAlias: string;
  onConfirm: () => void;
  onStartEdit: () => void;
  onSiloChange: (silo: InkastUiSilo) => void;
  onCategoryChange: (value: string) => void;
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
  category,
  comment,
  childAlias,
  onConfirm,
  onStartEdit,
  onSiloChange,
  onCategoryChange,
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
        category={category}
        comment={comment}
        childAlias={childAlias}
        busy={busy}
        onSiloChange={onSiloChange}
        onCategoryChange={onCategoryChange}
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
      </div>
    </div>
  );
}
