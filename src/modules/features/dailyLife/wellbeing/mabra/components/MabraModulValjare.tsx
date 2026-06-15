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

/** MåBra 3.0 L0 — åtta pelarkort (M3.0-B). ingen streak. */
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
    <div className="space-y-4">
      <p className="font-display-serif text-xs uppercase tracking-[0.2em] text-accent/90">
        MåBra 3.0
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
        <button type="button" onClick={skip} className="text-xs text-text-dim hover:text-text-muted">
          Visa alla zoner direkt
        </button>
      ) : null}
    </div>
  );
}
