import type { ReactNode } from 'react';
import { clsx } from 'clsx';

/** Silo-botten-glow enligt Obsidian Calm 2.0 — design-calm.mdc */
export type CalmCardGlow = 'gold' | 'blue' | 'green' | 'indigo';

const GLOW_CLASS: Record<CalmCardGlow, string> = {
  gold: 'glow-bottom-gold',
  blue: 'glow-bottom-blue',
  green: 'glow-bottom-green',
  /** Trygg Hamn / kris-triage — samma indigo-botten som blue, semantiskt separat från Familjen. */
  indigo: 'glow-bottom-blue',
};

const ICON_BOX_CLASS: Record<CalmCardGlow, string> = {
  gold: 'bento-icon-box bento-icon-box--gold',
  blue: 'bento-icon-box bento-icon-box--indigo',
  green: 'bento-icon-box bento-icon-box--emerald',
  indigo: 'bento-icon-box bento-icon-box--indigo',
};

export type BentoCardProps = {
  title?: string;
  description?: string;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'hero';
  /** Obsidian Depth — fuller 3D glass card treatment */
  depth?: boolean;
  /** Obsidian Calm 2.0 — färgkodad botten-glow per silo */
  glow?: CalmCardGlow;
  /** Skip default p-5 padding — for composite hub shells */
  bare?: boolean;
  /** Disable hover lift on dense hub layouts */
  noHover?: boolean;
};

export function BentoCard({
  title,
  description,
  icon,
  children,
  className = '',
  variant = 'default',
  depth = false,
  glow,
  bare = false,
  noHover = false,
}: BentoCardProps) {
  return (
    <section
      className={clsx(
        variant === 'hero' ? 'glass-hero' : 'calm-card bento-card',
        depth && 'module-bento-card--depth',
        glow && GLOW_CLASS[glow],
        variant === 'default' &&
          'border border-border/30 bg-surface-2/60 backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] transition-all duration-300',
        variant === 'default' &&
          !noHover &&
          'hover:-translate-y-0.5 hover:border-accent/30 hover:shadow-[0_15px_40px_rgba(0,0,0,0.6)]',
        !bare && 'p-5',
        className
      )}
    >
      {(title || icon) && (
        <header className="relative z-10 mb-3 flex items-center gap-2.5">
          {icon ? (
            <span
              className={clsx(
                glow ? ICON_BOX_CLASS[glow] : 'bento-icon-box bento-icon-box--gold',
              )}
            >
              {icon}
            </span>
          ) : null}
          {title ? (
            <h3 className="font-display text-sm font-semibold text-accent">{title}</h3>
          ) : null}
        </header>
      )}
      {description ? (
        <p className="relative z-10 mb-3 text-[10px] uppercase tracking-widest text-text-dim">
          {description}
        </p>
      ) : null}
      <div className="relative z-10">{children}</div>
    </section>
  );
}
