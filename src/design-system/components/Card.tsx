import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../utils/cn';

export type CardGlow = 'gold' | 'blue' | 'green' | 'indigo';

export type CardProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode;
  /** Hero treatment — fuller glass depth */
  variant?: 'default' | 'hero';
  /** Subtle hover lift */
  interactive?: boolean;
  /** Silo bottom glow — deprecated no-op (kill-switch; API kept for callers/smoke) */
  glow?: CardGlow;
  /** Skip default padding */
  bare?: boolean;
  /** Use 3D depth module treatment */
  depth?: boolean;
};

/** @deprecated Glow is visually disabled app-wide; prop kept for API/smoke compat. */
const GLOW_CLASS: Record<CardGlow, string> = {
  gold: '',
  blue: '',
  green: '',
  indigo: '',
};

/**
 * Premium card — glass surface with top highlight and layered shadow.
 * Preserves calm-card visual parity; token-driven via ds-card.
 */
export function Card({
  children,
  className,
  variant = 'default',
  interactive = true,
  glow,
  bare = false,
  depth = false,
  ...rest
}: CardProps) {
  return (
    <section
      className={cn(
        'ds-card bento-card',
        variant === 'hero' && 'ds-card--hero glass-hero',
        interactive && 'ds-card--interactive',
        !bare && 'ds-card--padding',
        glow && GLOW_CLASS[glow],
        depth && 'module-bento-card--depth',
        className,
      )}
      {...rest}
    >
      {children}
    </section>
  );
}

export type CardHeaderProps = HTMLAttributes<HTMLDivElement> & {
  title?: string;
  description?: string;
  icon?: ReactNode;
  glow?: CardGlow;
};

const ICON_BOX: Record<CardGlow, string> = {
  gold: 'bento-icon-box bento-icon-box--gold',
  blue: 'bento-icon-box bento-icon-box--gold',
  green: 'bento-icon-box bento-icon-box--gold',
  indigo: 'bento-icon-box bento-icon-box--gold',
};

export function CardHeader({ title, description, icon, glow = 'gold', className, children, ...rest }: CardHeaderProps) {
  if (!title && !description && !icon && !children) return null;

  return (
    <header className={cn('relative z-10 mb-3 flex items-center gap-2.5', className)} {...rest}>
      {icon ? <span className={ICON_BOX[glow]}>{icon}</span> : null}
      <div className="min-w-0 flex-1">
        {title ? (
          <h3 className="font-[family-name:var(--ds-font-display)] text-[length:var(--ds-font-size-sm)] font-semibold text-accent">
            {title}
          </h3>
        ) : null}
        {description ? (
          <p className="mt-1 text-[length:var(--ds-font-size-2xs)] uppercase tracking-[var(--ds-letter-spacing-wide)] text-text-muted">
            {description}
          </p>
        ) : null}
        {children}
      </div>
    </header>
  );
}

export function CardBody({ className, children, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('relative z-10', className)} {...rest}>
      {children}
    </div>
  );
}
