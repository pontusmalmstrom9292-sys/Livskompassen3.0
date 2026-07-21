import type { ReactNode } from 'react';
import { cn } from '@/design-system/utils/cn';

type EmptyStateProps = {
  title?: string;
  message: string;
  action?: ReactNode;
  className?: string;
};

export function EmptyState({ title, message, action, className }: EmptyStateProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'calm-card space-y-3 rounded-2xl px-4 py-4 shadow-[0_1px_0_color-mix(in_srgb,var(--accent-light)_8%,transparent)_inset]',
        className,
      )}
    >
      {title ? (
        <p className="font-display-serif text-[11px] font-medium uppercase tracking-[0.2em] text-accent/80">
          {title}
        </p>
      ) : null}
      <p className="text-sm leading-relaxed text-text-muted">{message}</p>
      {action ? <div>{action}</div> : null}
    </div>
  );
}
