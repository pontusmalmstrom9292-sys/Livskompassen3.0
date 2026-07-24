import { ExamplePreviewCard } from '@/shared/ui/ExamplePreviewCard';
import { markMabraModulValjareSeen } from '../lib/mabraModulValjareStorage';
import { MABRA_30_PILLARS, type MabraModulChoice } from '../lib/mabra30Pillars';

export type { MabraModulChoice } from '../lib/mabra30Pillars';

type Props = {
  onSelect: (choice: MabraModulChoice) => void;
  onSkip?: () => void;
};

function PillarPreviewMini({ lines }: { lines: string[] }) {
  return (
    <div className="space-y-0.5 text-[10px] text-text-muted">
      {lines.map((line) => (
        <p key={line}>{line}</p>
      ))}
    </div>
  );
}

/** Mabra 3.0 L0 — åtta pelarkort (M3.0-B). ingen streak. */
export function MabraModulValjare({ onSelect, onSkip }: Props) {
  const go = (choice: MabraModulChoice) => {
    markMabraModulValjareSeen();
    onSelect(choice);
  };

  const skip = () => {
    markMabraModulValjareSeen();
    onSkip?.();
  };

  return (
    <div className="mabra-modul-valjare space-y-4" role="region" aria-label="Välj Mabra-pelare">
      <p className="font-display-serif text-xs uppercase tracking-[0.2em] text-accent/90">
        Mabra 3.0
      </p>
      <p className="text-sm text-text-muted">Välj pelare — ett val i taget.</p>
      <div className="grid gap-3 sm:grid-cols-2">
        {MABRA_30_PILLARS.map((pillar) => (
          <ExamplePreviewCard
            key={pillar.id}
            title={pillar.title}
            lead={pillar.lead}
            preview={<PillarPreviewMini lines={pillar.previewLines} />}
            ctaLabel="Öppna"
            tone={pillar.tone}
            onStart={() => go(pillar.choice)}
          />
        ))}
      </div>
      {onSkip ? (
        <button
          type="button"
          onClick={skip}
          className="min-h-11 text-xs text-text-muted hover:text-text-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent/55"
        >
          Visa alla zoner direkt
        </button>
      ) : null}
    </div>
  );
}
