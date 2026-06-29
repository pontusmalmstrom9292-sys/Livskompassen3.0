import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../utils/cn';

export type HeaderProps = HTMLAttributes<HTMLElement> & {
  title?: string;
  left?: ReactNode;
  center?: ReactNode;
  right?: ReactNode;
  children?: ReactNode;
};

/**
 * Header — floating glass chrome shell.
 * Slot-based: preserves existing AppHeaderBar / DesignPackCenterHeader composition.
 */
export function Header({ title = 'LIVSKOMPASSEN', left, center, right, children, className, ...rest }: HeaderProps) {
  if (children) {
    return (
      <header className={cn('ds-header', className)} aria-label={title} {...rest}>
        {children}
      </header>
    );
  }

  return (
    <header className={cn('ds-header', className)} aria-label={title} {...rest}>
      <div className="ds-header__inner">
        <div className="flex min-w-0 justify-start">{left}</div>
        <div className="min-w-0 text-center">
          {center ?? <h1 className="ds-header__title">{title}</h1>}
        </div>
        <div className="flex min-w-0 justify-end">{right}</div>
      </div>
    </header>
  );
}

export type HeaderButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
};

/** Header icon button — 44px touch target with focus ring. */
export function HeaderButton({ className, children, ...rest }: HeaderButtonProps) {
  return (
    <button
      type="button"
      className={cn('ds-btn ds-btn--ghost ds-btn--icon header-chrome-btn header-chrome-btn--round', className)}
      {...rest}
    >
      {children}
    </button>
  );
}
