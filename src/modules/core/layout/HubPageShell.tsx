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
  /** Stricter one-viewport fit on mobile — pairs with lockViewport */
  fitViewport?: boolean;
  /** Obsidian Depth 3D glass banner on header */
  depth?: boolean;
  /** When lockViewport: wrap body in calm-scroll-island (default true). Set false for split fixed+scroll layouts. */
  contentIsland?: boolean;
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
  fitViewport = false,
  depth = true,
  contentIsland = true,
  children,
}: Props) {
  const h = hubHeaderClasses();

  return (
    <div
      className={clsx(
        'hub-page-shell hub-page-shell--obsidian-bento flex min-h-0 flex-col gap-4',
        lockViewport && 'hub-view-lock',
        lockViewport && fitViewport && 'hub-view-lock--fit',
        className,
      )}
    >
      <header
        className={clsx(
          'hub-page-shell__header shrink-0 px-0.5',
          depth && 'hub-page-shell__header--depth hub-page-shell__header--bento',
          headerAside && 'flex items-start justify-between gap-2',
        )}
      >
        <div
          className={clsx(
            'hub-page-shell__top-bar min-w-0 flex-1',
            depth && 'hub-page-shell__top-bar--glass',
          )}
        >
          <p className={h.eyebrow}>{eyebrow}</p>
          <h1 className={h.title}>{title}</h1>
          {lead ? <p className={h.lead}>{lead}</p> : null}
        </div>
        {headerAside ? (
          <div className="hub-page-shell__header-aside shrink-0">{headerAside}</div>
        ) : null}
      </header>

      <div className="hub-page-shell__body flex min-h-0 flex-1 flex-col gap-4">
        {lockViewport && contentIsland !== false ? (
          <div className="calm-scroll-island space-y-4">{children}</div>
        ) : lockViewport ? (
          <div className="flex min-h-0 flex-1 flex-col">{children}</div>
        ) : (
          children
        )}
      </div>

      {footerSlot ? (
        <footer className="hub-page-shell__footer module-compact-footer">{footerSlot}</footer>
      ) : null}
    </div>
  );
}
