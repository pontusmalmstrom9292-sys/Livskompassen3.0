import type { ReactNode } from 'react';
import { clsx } from 'clsx';

export type CardProps = {
  children: ReactNode;
  className?: string;
  title?: string;
  variant?: 'default' | 'hero';
};

export function Card({
  children,
  className,
  title,
  variant = 'default',
}: CardProps) {
  return (
    <section
      className={clsx(
        variant === 'hero' ? 'glass-hero' : 'glass-card',
        'p-5',
        className
      )}
    >
      {title ? (
        <h3 className="font-display mb-3 text-sm font-semibold text-accent">
          {title}
        </h3>
      ) : null}
      <div className="relative z-10">{children}</div>
    </section>
  );
}
