import { Loader2, Shield } from 'lucide-react';
import { Button } from '@/design-system';

type Props = {
  /** Kort kontext — t.ex. «Arkiv» eller filnamn. */
  contextLabel?: string;
  busy?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

/**
 * Inline WORM-save confirmation panel — NOT a modal/dialog (`role="region"`).
 * Parent owns overlay/focus; this is the confirm UI only.
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
      <p className="text-xs leading-relaxed text-text-muted">
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
        <Button type="button" disabled={busy} onClick={onConfirm} variant="secondary" className="--secondary text-sm">
          {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : 'Ja — lås som bevis'}
        </Button>
        <Button type="button" disabled={busy} onClick={onCancel} variant="ghost" className="--ghost text-sm">
          Avbryt
        </Button>
      </div>
    </div>
  );
}
