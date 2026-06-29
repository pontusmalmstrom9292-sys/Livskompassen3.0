import { Zap } from 'lucide-react';

type Props = {
  onStart: () => void;
};

/** D25 — VIVIR snabbstart på Speglar. */
export function VivirQuickEntry({ onStart }: Props) {
  return (
    <div className="elongated-module elongated-module--gold flex flex-wrap items-center justify-between gap-3 p-4">
      <div>
        <p className="text-sm font-medium text-accent">VIVIR-snabbkoll</p>
        <p className="text-xs text-text-muted">Akut — fem steg, ett i taget.</p>
      </div>
      <button type="button" onClick={onStart} className="ds-btn ds-btn--accent flex items-center gap-2 text-xs">
        <Zap className="h-3.5 w-3.5" />
        Kör test
      </button>
    </div>
  );
}
