import type { ReactNode } from 'react';

type EmptyStateProps = {
  message: string;
  action?: ReactNode;
};

export function EmptyState({ message, action }: EmptyStateProps) {
  return (
    <div className="space-y-3">
      <p className="text-sm text-text-dim">{message}</p>
      {action}
    </div>
  );
}
