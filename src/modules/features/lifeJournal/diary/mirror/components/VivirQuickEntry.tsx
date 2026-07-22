import { Zap } from 'lucide-react';
import { Button } from '@/design-system';

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
      <Button type="button" variant="accent" size="sm" className="flex items-center gap-2 min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40" onClick={onStart}>
        <Zap className="h-3.5 w-3.5" />
        Kör test
      </Button>
    </div>
  );
}
