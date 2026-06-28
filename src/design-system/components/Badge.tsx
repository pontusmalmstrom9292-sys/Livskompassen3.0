import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../utils/cn';

export type BadgeVariant = 'accent' | 'success' | 'warning' | 'danger' | 'muted' | 'worm' | 'locked' | 'risk' | 'ai';

export type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  children: ReactNode;
  variant?: BadgeVariant;
};

const VARIANT_CLASS: Record<BadgeVariant, string> = {
  accent: 'ds-badge--accent',
  success: 'ds-badge--success',
  warning: 'ds-badge--warning',
  danger: 'ds-badge--danger',
  muted: 'ds-badge--muted',
  worm: 'badge-worm',
  locked: 'badge-locked',
  risk: 'badge-risk',
  ai: 'badge-ai',
};

/** Badge — status pill with semantic color tokens. */
export function Badge({ variant = 'accent', className, children, ...rest }: BadgeProps) {
  return (
    <span className={cn('ds-badge', VARIANT_CLASS[variant], className)} {...rest}>
      {children}
    </span>
  );
}
