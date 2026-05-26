import { clsx } from 'clsx';
import type { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  active?: boolean;
  /** Sidolänkar (Familjen/Hamn) — rund platta; övrigt avrundad kvadrat. */
  variant?: 'side' | 'slot';
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
        active && 'hub-chrome-tile--active',
        className,
      )}
      aria-hidden
    >
      {children}
    </span>
  );
}
