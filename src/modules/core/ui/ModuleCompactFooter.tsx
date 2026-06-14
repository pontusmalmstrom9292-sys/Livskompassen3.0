import type { ReactNode } from 'react';
import { clsx } from 'clsx';

type Props = {
  children: ReactNode;
  className?: string;
};

/** Compact module footer — sits above global dock without heavy chrome. */
export function ModuleCompactFooter({ children, className }: Props) {
  return (
    <footer className={clsx('module-compact-footer', className)}>{children}</footer>
  );
}
