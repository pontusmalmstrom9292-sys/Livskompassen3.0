import type { LucideIcon } from 'lucide-react';
import type { SVGAttributes } from 'react';
import { cn } from '../utils/cn';

export type IconSize = 'sm' | 'md' | 'lg';

export type IconProps = {
  icon: LucideIcon;
  size?: IconSize;
  strokeWidth?: number;
  className?: string;
  label?: string;
} & Omit<SVGAttributes<SVGElement>, 'children'>;

const SIZE_CLASS: Record<IconSize, string> = {
  sm: 'ds-icon--sm',
  md: 'ds-icon--md',
  lg: 'ds-icon--lg',
};

/** Default stroke — one family, one optical weight (premium-ui.mdc). */
export const DS_ICON_STROKE = 1.5;

/**
 * Icon — Lucide wrapper with consistent stroke and token sizing.
 * For custom SVG brand marks (compass), use dedicated assets — not this wrapper.
 */
export function Icon({
  icon: IconComponent,
  size = 'md',
  strokeWidth = DS_ICON_STROKE,
  className,
  label,
  ...rest
}: IconProps) {
  return (
    <span className={cn('ds-icon', SIZE_CLASS[size], className)} aria-hidden={!label}>
      <IconComponent strokeWidth={strokeWidth} aria-label={label} {...rest} />
    </span>
  );
}
