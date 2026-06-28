import type { ReactNode } from 'react';
import { Button, ButtonLink } from './Button';
import { cn } from '../utils/cn';

export type ErrorFallbackGlow = 'gold' | 'blue' | 'green' | 'danger';

export type ErrorFallbackProps = {
  title: string;
  body?: string;
  glow?: ErrorFallbackGlow;
  onRetry?: () => void;
  retryLabel?: string;
  backTo?: string;
  backLabel?: string;
  className?: string;
  children?: ReactNode;
};

const GLOW_CLASS: Record<ErrorFallbackGlow, string> = {
  gold: 'glow-bottom-gold',
  blue: 'glow-bottom-blue',
  green: 'glow-bottom-green',
  danger: 'border-danger/30',
};

/**
 * ErrorFallback — unified error recovery chrome for error boundaries.
 */
export function ErrorFallback({
  title,
  body = 'Ett tekniskt fel stoppade vyn. Prova igen — dina sparade data påverkas inte.',
  glow = 'gold',
  onRetry,
  retryLabel = 'Försök igen',
  backTo,
  backLabel = 'Till Hem',
  className,
  children,
}: ErrorFallbackProps) {
  return (
    <div
      className={cn(
        'ds-error-fallback calm-card space-y-3 rounded-2xl border border-border/30 p-4',
        GLOW_CLASS[glow],
        className,
      )}
      role="alert"
    >
      <p className="text-sm font-medium text-text">{title}</p>
      <p className="text-xs text-text-muted">{body}</p>
      {children}
      <div className="flex flex-wrap gap-2">
        {onRetry ? (
          <Button type="button" variant="accent" size="sm" onClick={onRetry}>
            {retryLabel}
          </Button>
        ) : null}
        {backTo ? (
          <ButtonLink to={backTo} variant="ghost" size="sm">
            {backLabel}
          </ButtonLink>
        ) : null}
      </div>
    </div>
  );
}
