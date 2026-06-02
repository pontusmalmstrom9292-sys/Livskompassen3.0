import type { ReactNode } from 'react';
import { clsx } from 'clsx';

/** Silo-botten-glow enligt Obsidian Calm 2.0 — design-calm.mdc */
export type CalmCardGlow = 'gold' | 'blue' | 'green';

const GLOW_CLASS: Record<CalmCardGlow, string> = {
  gold: 'glow-bottom-gold',
  blue: 'glow-bottom-blue',
  green: 'glow-bottom-green',
};

export type BentoCardProps = {
  title?: string;
  description?: string;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'hero';
  /** Obsidian Calm 2.0 — färgkodad botten-glow per silo */
  glow?: CalmCardGlow;
};

export function BentoCard({
  title,
  description,
  icon,
  children,
  className = '',
  variant = 'default',
  glow,
}: BentoCardProps) {
  return (
    <section
      className={clsx(
        variant === 'hero' ? 'glass-hero' : 'calm-card',
        glow && GLOW_CLASS[glow],
        'p-5',
        className
      )}
    >
      {(title || icon) && (
        <header className="relative z-10 mb-3 flex items-center gap-2">
          {icon ? <span className="text-accent">{icon}</span> : null}
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
