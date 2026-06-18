import { ExamplePreviewCard } from '@/shared/ui/ExamplePreviewCard';
import { markHemCaptureModulValjareSeen } from '../utils/hemCaptureModulValjareStorage';

export type HemCaptureChoice = 'text' | 'photo' | 'widget';

type Props = {
  onSelect: (choice: HemCaptureChoice) => void;
  onSkip?: () => void;
};

function PastePreviewMini() {
  return (
    <div className="rounded-lg border border-accent/20 bg-surface/40 p-2 text-[10px] text-text-muted">
      Mejl · sms · anteckning → AI-förslag → du bekräftar
    </div>
  );
}

function PhotoPreviewMini() {
  return (
    <div className="flex items-center gap-2 text-[10px] text-text-dim">
      <span className="rounded border border-border/40 px-2 py-1">Kvitto</span>
      <span>→ granskningskö</span>
    </div>
  );
}

function WidgetPreviewMini() {
  return (
    <div className="text-[10px] text-text-muted">
      <p>Fyren · mikrofon längst ner</p>
      <p className="mt-1 text-accent/80">Tyst inspelning → text här</p>
    </div>
  );
}

/** Hem-ingång — tre sätt att fånga, ett val i taget. */
export function HemCaptureModulValjare({ onSelect, onSkip }: Props) {
  const go = (choice: HemCaptureChoice) => {
    markHemCaptureModulValjareSeen();
    onSelect(choice);
  };

  const skip = () => {
    markHemCaptureModulValjareSeen();
    onSkip?.();
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-text-muted">
        Så här fångar du något — välj ett spår. Resten väntar.
      </p>
      <div className="grid touch-manipulation gap-3 sm:grid-cols-3">
        <ExamplePreviewCard
          title="Klistra text"
          lead="Sms, mejl eller minne — granska innan spar."
          preview={<PastePreviewMini />}
          ctaLabel="Öppna skrivyta"
          tone="gold"
          onStart={() => go('text')}
        />
        <ExamplePreviewCard
          title="Fota kvitto"
          lead="Bild eller PDF — hamnar i granskningskö."
          preview={<PhotoPreviewMini />}
          ctaLabel="Visa hur"
          tone="emerald"
          onStart={() => go('photo')}
        />
        <ExamplePreviewCard
          title="Tyst inspelning"
          lead="Via Fyren-widgeten — transkriberas till text."
          preview={<WidgetPreviewMini />}
          ctaLabel="Visa hur"
          tone="indigo"
          onStart={() => go('widget')}
        />
      </div>
      {onSkip ? (
        <button
          type="button"
          onClick={skip}
          className="min-h-[44px] touch-manipulation px-2 text-xs text-text-dim hover:text-text-muted active:scale-[0.98]"
        >
          Gå direkt till skrivyta
        </button>
      ) : null}
    </div>
  );
}
