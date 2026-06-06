import type { ReactNode } from 'react';

export type ExamplePreviewCardProps = {
  title: string;
  lead: string;
  preview: ReactNode;
  ctaLabel: string;
  onStart: () => void;
  tone?: 'gold' | 'emerald' | 'indigo' | 'lavender';
};

const TONE_CLASS: Record<NonNullable<ExamplePreviewCardProps['tone']>, string> = {
  gold: 'planering-tool-card--gold',
  emerald: 'planering-tool-card--emerald',
  indigo: 'planering-tool-card--indigo',
  lavender: 'planering-tool-card--lavender',
};

/** Statisk preview före första riktiga användning — ingen Firestore. */
export function ExamplePreviewCard({
  title,
  lead,
  preview,
  ctaLabel,
  onStart,
  tone = 'gold',
}: ExamplePreviewCardProps) {
  return (
    <article
      className={`planering-tool-card planering-tool-card--tile calm-card glow-bottom-gold ${TONE_CLASS[tone]}`}
    >
      <div className="planering-tool-card__preview mb-3 rounded-xl border border-border/30 bg-surface/40 p-3">
        {preview}
      </div>
      <h3 className="font-display-serif text-sm tracking-wide text-accent">{title}</h3>
      <p className="mt-1 text-xs text-text-muted">{lead}</p>
      <button type="button" onClick={onStart} className="btn-pill--accent mt-3 w-full text-xs">
        {ctaLabel}
      </button>
    </article>
  );
}
