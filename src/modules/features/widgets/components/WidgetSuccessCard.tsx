import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { clsx } from 'clsx';
import { WidgetButton } from './WidgetButton';

type Props = {
  message: string;
  icon?: LucideIcon;
  detail?: ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
};

/** Enhetligt success/done-kort i fristående widgets. */
export function WidgetSuccessCard({
  message,
  icon: Icon,
  detail,
  actionLabel = 'Fortsätt',
  onAction,
  className,
}: Props) {
  return (
    <div className={clsx('widget-success-card', className)}>
      <p className="widget-success-card__message">
        {Icon ? <Icon className="h-4 w-4 shrink-0" strokeWidth={1.5} aria-hidden /> : null}
        <span>{message}</span>
      </p>
      {detail ? <div className="widget-success-card__detail">{detail}</div> : null}
      {onAction ? (
        <WidgetButton type="button" variant="ghost" fullWidth className="mt-3 text-xs min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40" onClick={onAction}>
          {actionLabel}
        </WidgetButton>
      ) : null}
    </div>
  );
}
