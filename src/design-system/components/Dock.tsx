import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../utils/cn';

export type DockProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode;
  /** Accessible label for bottom navigation region */
  label?: string;
};

/**
 * Dock — floating glass capsule shell for bottom navigation.
 * Children: Navigation items + compass slot. Does not replace route logic.
 */
export function Dock({ children, className, label = 'Huvudnavigation', ...rest }: DockProps) {
  return (
    <nav className={cn('ds-dock exec-dock-bar', className)} aria-label={label} {...rest}>
      {children}
    </nav>
  );
}

export type DockCompassSlotProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

/** Center compass elevation slot — breaks out of dock plane visually. */
export function DockCompassSlot({ children, className, ...rest }: DockCompassSlotProps) {
  return (
    <div className={cn('exec-dock-bar__compass-slot', className)} {...rest}>
      {children}
    </div>
  );
}
