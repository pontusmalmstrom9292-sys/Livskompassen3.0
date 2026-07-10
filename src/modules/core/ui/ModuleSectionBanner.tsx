import type { ReactNode } from 'react';
import { clsx } from 'clsx';
import { Banner } from '@/design-system';

type Props = {
  eyebrow?: string;
  title: string;
  lead?: string;
  aside?: ReactNode;
  /** Obsidian Depth 3D glass treatment */
  depth?: boolean;
  className?: string;
};

/** @deprecated Prefer `Banner variant="section"` from `@/design-system`. */
export function ModuleSectionBanner({
  eyebrow,
  title,
  lead,
  aside,
  depth = true,
  className,
}: Props) {
  return (
    <Banner
      variant="section"
      eyebrow={eyebrow}
      title={title}
      lead={lead}
      aside={aside}
      className={clsx(
        'module-section-banner',
        depth && 'module-section-banner--depth',
        className,
      )}
    >
      {null}
    </Banner>
  );
}
