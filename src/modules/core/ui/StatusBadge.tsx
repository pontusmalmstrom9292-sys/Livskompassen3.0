import { clsx } from 'clsx';
import { Badge, type BadgeVariant } from '@/design-system';

type StatusBadgeVariant = 'worm' | 'locked' | 'risk' | 'ai';

type StatusBadgeProps = {
  variant: StatusBadgeVariant;
  label: string;
  className?: string;
};

/** @deprecated Prefer `Badge` from `@/design-system` directly. */
export function StatusBadge({ variant, label, className }: StatusBadgeProps) {
  return (
    <Badge variant={variant as BadgeVariant} className={clsx(className)}>
      {label}
    </Badge>
  );
}
