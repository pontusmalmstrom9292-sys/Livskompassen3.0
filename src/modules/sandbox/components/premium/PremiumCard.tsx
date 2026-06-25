import { clsx } from 'clsx';
import type { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  className?: string;
};

/** Premium-kort — ekonomi, planering, valv. Guld-kant, gradient. */
export function PremiumCard({ children, className }: Props) {
  return (
    <div className={clsx('design-freeport__premium-card', className)}>
      {children}
    </div>
  );
}
