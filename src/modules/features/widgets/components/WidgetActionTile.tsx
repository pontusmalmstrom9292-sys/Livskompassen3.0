import type { LucideIcon } from 'lucide-react';
import { clsx } from 'clsx';

export type WidgetActionTileProps = {
  label: string;
  icon: LucideIcon;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
};

/**
 * Grid-tile för widget-genvägar — taktil bevel, accent-ring vid aktiv.
 */
export function WidgetActionTile({
  label,
  icon: Icon,
  active,
  disabled,
  onClick,
  className,
}: WidgetActionTileProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={clsx(
        'widget-action-tile',
        active && 'widget-action-tile--on',
        disabled && 'widget-action-tile--disabled',
        className,
      )}
      aria-pressed={active}
    >
      <span className="widget-action-tile__icon" aria-hidden>
        <Icon className="h-5 w-5" strokeWidth={1.5} />
      </span>
      <span className="widget-action-tile__label">{label}</span>
    </button>
  );
}

export type WidgetActionGridProps = {
  children: React.ReactNode;
  columns?: 2 | 3 | 4;
  className?: string;
};

export function WidgetActionGrid({ children, columns = 3, className }: WidgetActionGridProps) {
  return (
    <div
      className={clsx('widget-action-grid', `widget-action-grid--cols-${columns}`, className)}
      role="group"
    >
      {children}
    </div>
  );
}
