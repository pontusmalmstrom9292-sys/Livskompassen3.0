import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../utils/cn';

export type GlassPanelProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  /** Fuller hero glass treatment */
  variant?: 'default' | 'hero';
  /** Padding using spacing tokens */
  padded?: boolean;
};

/**
 * GlassPanel — frosted surface without card hover semantics.
 * Use for toolbars, strips, and inline glass regions.
 */
export function GlassPanel({
  children,
  className,
  variant = 'default',
  padded = true,
  ...rest
}: GlassPanelProps) {
  return (
    <div
      className={cn(
        'ds-glass-panel',
        variant === 'hero' && 'ds-glass-panel--hero',
        padded && 'p-[var(--ds-space-4)]',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
