import type { ReactNode } from 'react';
import { clsx } from 'clsx';
import { textStyles } from '@/design-system';

type Props = {
  eyebrow?: string;
  title: string;
  lead?: string;
  aside?: ReactNode;
  /** Optional scenic gradient band behind title */
  scenic?: boolean;
  className?: string;
};

/** Scenic hub header — skin only, no data fetching. */
export function ExecutiveHubHeader({
  eyebrow,
  title,
  lead,
  aside,
  scenic = false,
  className,
}: Props) {
  return (
    <header
      className={clsx(
        'executive-hub-header shrink-0',
        scenic && 'executive-hub-header--scenic',
        className,
      )}
    >
      <div className="executive-hub-header__inner">
        {eyebrow ? (
          <p className={clsx('executive-hub-header__eyebrow', textStyles.eyebrow, 'text-accent')}>
            {eyebrow}
          </p>
        ) : null}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h1 className="executive-hub-header__title font-display-serif text-xl uppercase tracking-[0.15em] text-text">
              {title}
            </h1>
            {lead ? (
              <p className="executive-hub-header__lead mt-1 text-sm text-text-muted">{lead}</p>
            ) : null}
          </div>
          {aside ? <div className="shrink-0">{aside}</div> : null}
        </div>
      </div>
    </header>
  );
}
