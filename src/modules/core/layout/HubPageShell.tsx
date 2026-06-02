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
  /** Obsidian Calm 2.0 — lås hub-höjd, scroll endast i calm-scroll-island */
  lockViewport?: boolean;
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
  lockViewport = false,
  children,
}: Props) {
  const h = hubHeaderClasses();

  return (
    <div
      className={clsx(
        'hub-page-shell space-y-4',
        lockViewport && 'hub-view-lock',
        className,
      )}
    >
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

      <div className="hub-page-shell__body space-y-4">
        {lockViewport ? (
          <div className="calm-scroll-island space-y-4">{children}</div>
        ) : (
          children
        )}
      </div>

      {footerSlot ? (
        <footer className="hub-page-shell__footer border-t border-border pt-4">{footerSlot}</footer>
      ) : null}
    </div>
  );
}
