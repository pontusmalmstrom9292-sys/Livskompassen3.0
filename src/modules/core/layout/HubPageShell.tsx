import type { ReactNode } from 'react';
import { clsx } from 'clsx';
import { hubHeaderClasses } from '../ui/typeScale';

type Props = {
  eyebrow: string;
  title: string;
  lead?: string;
  headerAside?: ReactNode;
  footerSlot?: ReactNode;
  className?: string;
  children: ReactNode;
};

/** Shared hub layout — header, content, optional module footer above global dock. */
export function HubPageShell({
  eyebrow,
  title,
  lead,
  headerAside,
  footerSlot,
  className,
  children,
}: Props) {
  const h = hubHeaderClasses();

  return (
    <div className={clsx('hub-page-shell space-y-4', className)}>
      <header
        className={clsx(
          'hub-page-shell__header px-0.5',
          headerAside && 'flex items-start justify-between gap-2',
        )}
      >
        <div className="min-w-0">
          <p className={h.eyebrow}>{eyebrow}</p>
          <h1 className={h.title}>{title}</h1>
          {lead ? <p className={h.lead}>{lead}</p> : null}
        </div>
        {headerAside}
      </header>

      <div className="hub-page-shell__body space-y-4">{children}</div>

      {footerSlot ? (
        <footer className="hub-page-shell__footer border-t border-border pt-4">{footerSlot}</footer>
      ) : null}
    </div>
  );
}
