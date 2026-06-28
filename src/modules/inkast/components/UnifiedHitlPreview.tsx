import { CheckCircle2, Loader2 } from 'lucide-react';
import { clsx } from 'clsx';
import type { ReactNode } from 'react';

type Props = {
  siloLabel: string;
  siloHint?: string;
  siloDescription?: string;
  confidencePct?: number;
  previewLabel?: string;
  summary?: string;
  hitlBadge?: string;
  busy?: boolean;
  confirmLabel?: string;
  dismissLabel?: string;
  onConfirm: () => void;
  onEdit: () => void;
  onDismiss: () => void;
  extraWarning?: ReactNode;
  panelClass?: string;
  accentClass?: string;
};

/** HITL1 — gemensam preview: föreslagen silo · confidence · Godkänn / Ändra / Avvisa. */
export function UnifiedHitlPreview({
  siloLabel,
  siloHint,
  siloDescription,
  confidencePct,
  previewLabel,
  summary,
  hitlBadge,
  busy = false,
  confirmLabel = 'Godkänn',
  dismissLabel = 'Avvisa',
  onConfirm,
  onEdit,
  onDismiss,
  extraWarning,
  panelClass = 'bg-surface-3/50',
  accentClass = 'text-accent',
}: Props) {
  return (
    <div
      className={clsx(
        'flex flex-col gap-4 rounded-2xl border border-border/40 p-4 shadow-lg backdrop-blur-md',
        panelClass,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          {hitlBadge ? (
            <span className="text-[10px] font-bold uppercase tracking-widest text-text-dim">
              {hitlBadge}
            </span>
          ) : (
            <span className="text-[10px] font-bold uppercase tracking-widest text-text-dim">
              Föreslagen silo
            </span>
          )}
          <p className={clsx('mt-1.5 text-sm font-semibold', accentClass)}>{siloLabel}</p>
          {siloHint ? <p className="mt-1 text-xs text-text-muted">{siloHint}</p> : null}
          {siloDescription ? (
            <p className="mt-1 text-xs leading-relaxed text-text-dim">{siloDescription}</p>
          ) : null}
          {typeof confidencePct === 'number' ? (
            <p className="mt-2 text-xs text-text-dim">Säkerhet {confidencePct}%</p>
          ) : null}
          {summary ? <p className="mt-2 text-xs text-text-dim line-clamp-3">{summary}</p> : null}
          {extraWarning}
        </div>
        {previewLabel ? (
          <span className="max-w-[140px] shrink-0 truncate text-right text-xs text-text">
            {previewLabel}
          </span>
        ) : null}
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onConfirm}
          disabled={busy}
          className="ds-btn ds-btn--accent flex flex-1 items-center justify-center gap-2 text-xs"
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
          <CheckCircle2 className="h-4 w-4" aria-hidden />
          {confirmLabel}
        </button>
        <button type="button" onClick={onEdit} disabled={busy} className="ds-btn ds-btn--ghost text-xs">
          Ändra
        </button>
        <button
          type="button"
          onClick={onDismiss}
          disabled={busy}
          className="ds-btn ds-btn--ghost text-xs text-text-dim"
        >
          {dismissLabel}
        </button>
      </div>
    </div>
  );
}
