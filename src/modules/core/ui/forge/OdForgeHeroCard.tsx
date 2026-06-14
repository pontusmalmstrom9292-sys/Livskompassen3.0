import { clsx } from 'clsx';
import { Flame, Sparkles } from 'lucide-react';

type Props = {
  greeting: string;
  name: string;
  tagline: string;
  profileLabel: string;
  presenceDays?: number;
  stepHint: string;
  ctaLabel: string;
  ctaPressed: boolean;
  onCtaPointerDown: () => void;
  onCtaPointerUp: () => void;
};

export function OdForgeHeroCard({
  greeting,
  name,
  tagline,
  profileLabel,
  presenceDays = 7,
  stepHint,
  ctaLabel,
  ctaPressed,
  onCtaPointerDown,
  onCtaPointerUp,
}: Props) {
  return (
    <section className="od-forge__hero" aria-label="Dagens kompass">
      <h2 className="od-forge__hero-greeting">
        {greeting},{' '}
        <span className="od-forge__hero-name">{name}</span>
        <span aria-hidden> ✦</span>
      </h2>
      <p className="od-forge__hero-tagline">{tagline}</p>
      <p className="od-forge__hero-step">{stepHint}</p>

      <div className="od-forge__hero-meta">
        <span className="od-forge__hero-profile">{profileLabel}</span>
        <span className="od-forge__hero-presence" aria-label={`Närvaro: ${presenceDays} dagar`}>
          <Flame className="h-3 w-3 text-accent" strokeWidth={1.5} aria-hidden />
          <span className="od-forge__hero-presence-value">{presenceDays}</span>
          Närvaro
        </span>
      </div>

      <div className="od-forge__cta-wrap">
        <button
          type="button"
          className={clsx('od-forge__cta', ctaPressed && 'od-forge__cta--pressed')}
          onPointerDown={onCtaPointerDown}
          onPointerUp={onCtaPointerUp}
          onPointerLeave={onCtaPointerUp}
          onPointerCancel={onCtaPointerUp}
        >
          <Sparkles className="h-4 w-4" strokeWidth={1.5} aria-hidden />
          {ctaLabel}
        </button>
      </div>
    </section>
  );
}
