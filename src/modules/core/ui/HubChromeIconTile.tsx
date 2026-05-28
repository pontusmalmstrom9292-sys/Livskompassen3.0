import { clsx } from 'clsx';
import type { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  active?: boolean;
  /** Sidolänkar (Familjen/Hamn) — rund platta; dock = större band-tiles. */
  variant?: 'side' | 'slot' | 'dock' | 'dock-side';
  className?: string;
};

/** L2 hub-chrome — disk + guldlinje (dock, Mer-panel). */
export function HubChromeIconTile({
  children,
  active,
  variant = 'slot',
  className,
}: Props) {
  return (
    <span
      className={clsx(
        'hub-chrome-tile',
        variant === 'side' && 'hub-chrome-tile--side',
        variant === 'dock' && 'hub-chrome-tile--dock',
        variant === 'dock-side' && 'hub-chrome-tile--dock-side',
        active && 'hub-chrome-tile--active',
        className,
      )}
      aria-hidden
    >
      {children}
    </span>
  );
}
