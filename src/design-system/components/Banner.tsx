import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../utils/cn';
import { textStyles } from '../tokens';

export type BannerVariant = 'info' | 'warning' | 'danger' | 'section';

export type BannerProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode;
  variant?: BannerVariant;
  eyebrow?: string;
  title?: string;
  lead?: string;
  aside?: ReactNode;
};

/**
 * Banner — alert, info, or in-module section header strip.
 */
export function Banner({
  children,
  className,
  variant = 'info',
  eyebrow,
  title,
  lead,
  aside,
  ...rest
}: BannerProps) {
  const isSection = variant === 'section';

  return (
    <header
      className={cn(
        isSection ? 'module-section-banner module-section-banner--depth' : 'ds-banner',
        !isSection && variant === 'warning' && 'ds-banner--warning',
        !isSection && variant === 'danger' && 'ds-banner--danger',
        !isSection && variant === 'info' && 'ds-banner--info',
        aside && 'module-section-banner--with-aside flex flex-wrap items-start justify-between gap-3',
        className,
      )}
      role={variant === 'danger' ? 'alert' : undefined}
      {...rest}
    >
      {(eyebrow || title || lead) ? (
        <div className="min-w-0 flex-1">
          {eyebrow ? <p className={textStyles.eyebrow}>{eyebrow}</p> : null}
          {title ? (
            <h2 className={cn(isSection ? 'module-section-banner__title' : textStyles.titleSection, 'mt-1')}>
              {title}
            </h2>
          ) : null}
          {lead ? (
            <p className={cn(isSection ? 'module-section-banner__lead' : textStyles.body, 'mt-1 text-text-muted')}>
              {lead}
            </p>
          ) : null}
        </div>
      ) : null}
      {children}
      {aside ? <div className="shrink-0">{aside}</div> : null}
    </header>
  );
}
