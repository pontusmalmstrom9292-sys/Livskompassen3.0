import { clsx } from 'clsx';

type StatusBadgeVariant = 'worm' | 'locked' | 'risk' | 'ai';

type StatusBadgeProps = {
  variant: StatusBadgeVariant;
  label: string;
  className?: string;
};

const variantClass: Record<StatusBadgeVariant, string> = {
  worm: 'badge-worm',
  locked: 'badge-locked',
  risk: 'badge-risk',
  ai: 'badge-ai',
};

export function StatusBadge({ variant, label, className }: StatusBadgeProps) {
  return <span className={clsx(variantClass[variant], className)}>{label}</span>;
}
