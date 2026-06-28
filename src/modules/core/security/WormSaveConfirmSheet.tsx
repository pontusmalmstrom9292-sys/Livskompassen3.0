import { Loader2, Shield } from 'lucide-react';

type Props = {
  /** Kort kontext — t.ex. «Arkiv» eller filnamn. */
  contextLabel?: string;
  busy?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

/**
 * Bekräftelse innan WORM-skriv till reality_vault — oföränderlig post, beteende + datum.
 */
export function WormSaveConfirmSheet({ contextLabel, busy = false, onConfirm, onCancel }: Props) {
  return (
    <div
      className="space-y-3 rounded-xl border border-accent/25 bg-surface-2/80 px-4 py-3"
      role="region"
      aria-label="Bekräfta oföränderligt bevis"
    >
      <p className="flex items-center gap-2 text-sm text-text-muted">
        <Shield className="h-4 w-4 shrink-0 text-accent" aria-hidden />
        Oföränderlig post i arkivet
      </p>
      <p className="text-xs leading-relaxed text-text-dim">
        {contextLabel ? (
          <>
            <span className="text-text-muted">{contextLabel}</span>
            {' — '}
          </>
        ) : null}
        Posten låses permanent. Skriv beteende och datum — inte diagnos. Kan inte raderas eller ändras
        efteråt.
      </p>
      <div className="flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          disabled={busy}
          onClick={onConfirm}
          className="ds-btn ds-btn--secondary text-sm"
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : 'Ja — lås som bevis'}
        </button>
        <button type="button" disabled={busy} onClick={onCancel} className="ds-btn ds-btn--ghost text-sm">
          Avbryt
        </button>
      </div>
    </div>
  );
}
