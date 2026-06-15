import type { ReactNode } from 'react';
import { clsx } from 'clsx';
import { HubPageShell } from './HubPageShell';
import { CognitiveLoadStrip } from '../ui/CognitiveLoadStrip';

type CognitiveStripProps = {
  label?: string;
  hint?: string;
};

type Props = {
  eyebrow: string;
  title: string;
  lead?: string;
  headerAside?: ReactNode;
  /** Toolbar row below header (e.g. HubDropdownNav, mode select). */
  toolbar?: ReactNode;
  footerSlot?: ReactNode;
  className?: string;
  /** Obsidian Calm 2.0 — lås hub-höjd, scroll endast i calm-scroll-island */
  lockViewport?: boolean;
  /** Stricter mobile one-viewport fit (hub-view-lock--fit). */
  fitViewport?: boolean;
  /** Obsidian Depth 3D glass banner on hub header */
  depth?: boolean;
  /** Split layout: fixed chrome + inner calm-scroll-island (Familjen superhub). */
  contentIsland?: boolean;
  cognitiveStrip?: CognitiveStripProps | false;
  children: ReactNode;
};

/**
 * Shared module shell for Familjen, Hjärtat, Vardagen hubs.
 * Wraps HubPageShell with depth chrome, optional cognitive strip, and toolbar slot.
 */
export function ModuleShell({
  eyebrow,
  title,
  lead,
  headerAside,
  toolbar,
  footerSlot,
  className,
  lockViewport = false,
  fitViewport = false,
  depth = true,
  contentIsland,
  cognitiveStrip,
  children,
}: Props) {
  return (
    <HubPageShell
      eyebrow={eyebrow}
      title={title}
      lead={lead}
      headerAside={headerAside}
      footerSlot={footerSlot}
      lockViewport={lockViewport}
      fitViewport={fitViewport}
      depth={depth}
      contentIsland={contentIsland}
      className={clsx(
        'module-shell module-shell--obsidian-bento flex min-h-0 flex-1 flex-col',
        depth && 'module-shell--depth',
        className,
      )}
    >
      <div
        className={clsx(
          'module-shell__stack mx-auto max-w-5xl space-y-4',
          lockViewport ? 'flex min-h-0 flex-1 flex-col pb-2' : 'pb-12',
        )}
      >
        {cognitiveStrip !== false ? (
          <CognitiveLoadStrip
            label={cognitiveStrip?.label}
            hint={cognitiveStrip?.hint}
          />
        ) : null}

        {toolbar ? (
          <div className="module-shell__toolbar module-shell__toolbar--bento shrink-0 py-2">
            {toolbar}
          </div>
        ) : null}

        <div
          className={clsx(
            'module-shell__content animate-fade-in',
            lockViewport && 'flex min-h-0 flex-1 flex-col',
          )}
        >
          {children}
        </div>
      </div>
    </HubPageShell>
  );
}
