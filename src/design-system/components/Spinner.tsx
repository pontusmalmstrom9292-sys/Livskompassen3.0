import type { SVGProps } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../utils/cn';

export type SpinnerProps = SVGProps<SVGSVGElement> & {
  size?: 'sm' | 'md' | 'lg';
};

const SIZE_CLASS = {
  sm: 'h-3.5 w-3.5',
  md: 'h-5 w-5',
  lg: 'h-8 w-8',
} as const;

/** Spinner — DS loading indicator. */
export function Spinner({ size = 'md', className, ...rest }: SpinnerProps) {
  return (
    <Loader2
      className={cn('ds-spinner animate-spin text-accent', SIZE_CLASS[size], className)}
      aria-hidden={rest['aria-hidden'] ?? true}
      {...rest}
    />
  );
}
