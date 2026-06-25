import { clsx } from 'clsx';
import type { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  className?: string;
};

/** Bas-kort — 80% innehåll, lugn struktur. Endast --fp-* tokens. */
export function CalmCard({ children, className }: Props) {
  return (
    <div className={clsx('design-freeport__premium-calm-card', className)}>
      {children}
    </div>
  );
}
