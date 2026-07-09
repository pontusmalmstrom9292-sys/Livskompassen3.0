import type { ReactNode } from 'react';
import { Button } from '@/design-system';

export type ExamplePreviewCardProps = {
  title: string;
  lead: string;
  preview: ReactNode;
  ctaLabel: string;
  onStart: () => void;
  tone?: 'gold' | 'emerald' | 'indigo' | 'lavender';
  /** M3.0-C — pelare utan backend än */
  disabled?: boolean;
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
  disabled = false,
}: ExamplePreviewCardProps) {
  return (
    <article
      className={`planering-tool-card planering-tool-card--tile calm-card glow-bottom-gold ${TONE_CLASS[tone]}${disabled ? ' opacity-60' : ''}`}
    >
      <div className="planering-tool-card__preview mb-3 rounded-xl border border-border/30 bg-surface/40 p-3">
        {preview}
      </div>
      <h3 className="font-display-serif text-sm tracking-wide text-accent">{title}</h3>
      <p className="mt-1 text-xs text-text-muted">{lead}</p>
      <Button type="button" onClick={onStart} disabled={disabled} variant="accent" className="--accent mt-3 min-h-[48px] w-full touch-manipulation text-xs active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50">
        {disabled ? 'Kommer snart' : ctaLabel}
      </Button>
    </article>
  );
}
