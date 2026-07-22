import type { HTMLAttributes } from 'react';
import { Spinner } from './Spinner';
import { cn } from '../utils/cn';

export type SkeletonProps = HTMLAttributes<HTMLDivElement> & {
  variant?: 'line' | 'block' | 'circle';
};

/**
 * Skeleton — loading placeholder using DS tokens.
 */
export function Skeleton({ variant = 'line', className, ...rest }: SkeletonProps) {
  return (
    <div
      className={cn(
        'ds-skeleton animate-pulse bg-surface-3/40',
        variant === 'line' && 'h-10 rounded-xl border border-border/30',
        variant === 'block' && 'h-24 rounded-2xl border border-border/30',
        variant === 'circle' && 'h-10 w-10 rounded-full border border-border/30',
        className,
      )}
      aria-hidden
      {...rest}
    />
  );
}

export type SkeletonStackProps = {
  label?: string;
  lines?: number;
  className?: string;
};

/** Hub-style skeleton stack with optional screen-reader label. */
export function SkeletonStack({ label = 'Laddar…', lines = 3, className }: SkeletonStackProps) {
  return (
    <div className={cn('ds-skeleton-stack space-y-3 py-4', className)} aria-busy="true" aria-label={label}>
      <p className="flex items-center gap-2 text-xs text-text-muted">
        <Spinner size="sm" />
        {label}
      </p>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} variant="line" />
      ))}
    </div>
  );
}
