import { ExamplePreviewCard } from '@/shared/ui/ExamplePreviewCard';
import type { MabraHubCategory } from '../mabraHubRegistry';
import { markMabraModulValjareSeen } from '../lib/mabraModulValjareStorage';

export type MabraModulChoice =
  | { kind: 'category'; category: MabraHubCategory }
  | { kind: 'daglig_mix' }
  | { kind: 'tool'; tool: 'goals' | 'education' };

type Props = {
  onSelect: (choice: MabraModulChoice) => void;
  onSkip?: () => void;
};

function AkutPreviewMini() {
  return (
    <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-2 text-center text-[10px] text-text-muted">
      Andning · Jordning · Ett steg
    </div>
  );
}

function DagligMixPreviewMini() {
  return (
    <div className="text-[10px] text-text-muted">
      <p>Frågekort + micro-lek</p>
      <p className="mt-1 text-accent/80">~5 min · ingen streak</p>
    </div>
  );
}

function VitPreviewMini() {
  return (
    <div className="flex flex-wrap gap-1 text-[9px] text-text-dim">
      {['Självkänsla', 'Minnen', 'Lär tillsammans'].map((l) => (
        <span key={l} className="rounded border border-accent/20 px-1">
          {l}
        </span>
      ))}
    </div>
  );
}

function VerktygPreviewMini() {
  return (
    <ul className="space-y-0.5 text-[10px] text-text-muted">
      <li>KBT-transformator</li>
      <li>Känslokort</li>
      <li>Reflektionslek</li>
    </ul>
  );
}

function GoalsPreviewMini() {
  return (
    <p className="text-[10px] text-text-muted">
      Ett mål · du bekräftar · synkas med Morgonkompassen
    </p>
  );
}

function EducationPreviewMini() {
  return (
    <p className="text-[10px] text-text-muted">
      FACT-kapitel + kopplad övning · ingen streak
    </p>
  );
}

/** Hub-ingång — sex val före full MåBra-hub (M3.0-B). */
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
      <p className="text-sm text-text-muted">Välj hur du vill börja — ett val i taget.</p>
      <div className="grid gap-3 sm:grid-cols-2">
        <ExamplePreviewCard
          title="Akut nu"
          lead="Panik, RSD eller behov av andning."
          preview={<AkutPreviewMini />}
          ctaLabel="Öppna akut"
          tone="emerald"
          onStart={() => go({ kind: 'category', category: 'akut' })}
        />
        <ExamplePreviewCard
          title="Daglig mix"
          lead="Ett kort + en kort lek — utan gamification."
          preview={<DagligMixPreviewMini />}
          ctaLabel="Starta daglig mix"
          tone="lavender"
          onStart={() => go({ kind: 'daglig_mix' })}
        />
        <ExamplePreviewCard
          title="Utveckling (Vit)"
          lead="Projekt och frågekort — separat från Valv."
          preview={<VitPreviewMini />}
          ctaLabel="Öppna Vit"
          tone="gold"
          onStart={() => go({ kind: 'category', category: 'projekt' })}
        />
        <ExamplePreviewCard
          title="Verktyg"
          lead="KBT, kort och reflektion."
          preview={<VerktygPreviewMini />}
          ctaLabel="Visa verktyg"
          tone="indigo"
          onStart={() => go({ kind: 'category', category: 'lekar' })}
        />
        <ExamplePreviewCard
          title="Målsättning"
          lead="Ett mål i taget — du bekräftar."
          preview={<GoalsPreviewMini />}
          ctaLabel="Öppna mål"
          tone="gold"
          onStart={() => go({ kind: 'tool', tool: 'goals' })}
        />
        <ExamplePreviewCard
          title="Utbildning"
          lead="Mikroinlärning + FACT-kapitel."
          preview={<EducationPreviewMini />}
          ctaLabel="Öppna kurser"
          tone="lavender"
          onStart={() => go({ kind: 'tool', tool: 'education' })}
        />
      </div>
      {onSkip ? (
        <button type="button" onClick={skip} className="text-xs text-text-dim hover:text-text-muted">
          Visa alla zoner direkt
        </button>
      ) : null}
    </div>
  );
}
