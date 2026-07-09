import type { ReactNode } from 'react';
import { Banner } from '@/design-system';

type AlertBannerProps = {
  variant?: 'info' | 'warning' | 'danger';
  children: ReactNode;
  className?: string;
};

/** @deprecated Prefer `Banner` from `@/design-system`. */
export function AlertBanner({ variant = 'info', children, className }: AlertBannerProps) {
  return (
    <Banner variant={variant} className={className}>
      {children}
    </Banner>
  );
}
