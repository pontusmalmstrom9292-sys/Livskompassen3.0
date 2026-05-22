import { clsx } from 'clsx';
import type { ReactNode } from 'react';

type AlertBannerProps = {
  variant?: 'info' | 'warning' | 'danger' | 'accent';
  children: ReactNode;
  className?: string;
};

export function AlertBanner({ variant = 'info', children, className }: AlertBannerProps) {
  return (
    <div
      className={clsx(
        variant === 'warning' && 'alert-banner--warning',
        variant === 'danger' && 'alert-banner--danger',
        variant === 'info' && 'alert-banner--info',
        variant === 'accent' && 'alert-banner--accent',
        className
      )}
      role={variant === 'danger' ? 'alert' : 'status'}
    >
      {children}
    </div>
  );
}
