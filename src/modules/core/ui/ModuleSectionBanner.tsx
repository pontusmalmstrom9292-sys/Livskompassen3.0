import type { ReactNode } from 'react';
import { clsx } from 'clsx';
import { sectionEyebrowClass } from './typeScale';

type Props = {
  eyebrow?: string;
  title: string;
  lead?: string;
  aside?: ReactNode;
  /** Obsidian Depth 3D glass treatment */
  depth?: boolean;
  className?: string;
};

/** In-module section header — glass banner consistent with Obsidian Depth. */
export function ModuleSectionBanner({
  eyebrow,
  title,
  lead,
  aside,
  depth = true,
  className,
}: Props) {
  return (
    <header
      className={clsx(
        'module-section-banner',
        depth && 'module-section-banner--depth',
        aside && 'module-section-banner--with-aside',
        className,
      )}
    >
      <div className="module-section-banner__inner min-w-0">
        {eyebrow ? <p className={sectionEyebrowClass}>{eyebrow}</p> : null}
        <h2 className="module-section-banner__title">{title}</h2>
        {lead ? <p className="module-section-banner__lead">{lead}</p> : null}
      </div>
      {aside ? <div className="module-section-banner__aside shrink-0">{aside}</div> : null}
    </header>
  );
}
