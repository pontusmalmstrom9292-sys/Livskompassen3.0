import type { ReactNode } from 'react';

type EmptyStateProps = {
  message: string;
  action?: ReactNode;
};

export function EmptyState({ message, action }: EmptyStateProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="space-y-3 rounded-2xl border border-border/30 bg-surface-2/35 px-4 py-4"
    >
      <p className="text-sm leading-relaxed text-text-muted">{message}</p>
      {action ? <div>{action}</div> : null}
    </div>
  );
}
