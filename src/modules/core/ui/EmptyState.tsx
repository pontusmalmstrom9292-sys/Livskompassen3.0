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
        'calm-card space-y-3 rounded-2xl border border-border/30 bg-surface-2/35 px-4 py-4',
        className,
      )}
    >
      {title ? (
        <p className="text-[11px] font-medium uppercase tracking-widest text-text-dim">{title}</p>
      ) : null}
      <p className="text-sm leading-relaxed text-text-muted">{message}</p>
      {action ? <div>{action}</div> : null}
    </div>
  );
}
