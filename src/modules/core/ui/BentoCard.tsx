import type { ReactNode } from 'react';
import { clsx } from 'clsx';

type BentoCardProps = {
  title?: string;
  description?: string;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'hero';
};

export function BentoCard({
  title,
  description,
  icon,
  children,
  className = '',
  variant = 'default',
}: BentoCardProps) {
  return (
    <section
      className={clsx(
        variant === 'hero' ? 'glass-hero' : 'glass-card',
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
