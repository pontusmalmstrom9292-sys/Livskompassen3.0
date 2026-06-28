import { useEffect, useId, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../utils/cn';

export type SheetProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  /** When hideHeader, use ariaLabel for dialog name */
  ariaLabel?: string;
  children: ReactNode;
  className?: string;
  panelClassName?: string;
  bodyClassName?: string;
  /** Render to document.body (default true) */
  portal?: boolean;
  /** Bottom sheet on mobile vs always centered */
  placement?: 'sheet' | 'center';
  /** Tall panel — project/material editors (max-w-2xl, 85vh) */
  size?: 'default' | 'tall';
  hideHeader?: boolean;
  headerAction?: ReactNode;
  lockScroll?: boolean;
};

/**
 * Sheet — bottom sheet on mobile, centered panel on sm+.
 * Escape dismiss, backdrop click, token glass panel.
 */
export function Sheet({
  open,
  onClose,
  title,
  description,
  ariaLabel,
  children,
  className,
  panelClassName,
  bodyClassName,
  portal = true,
  placement = 'sheet',
  size = 'default',
  hideHeader = false,
  headerAction,
  lockScroll = true,
}: SheetProps) {
  const titleId = useId();
  const descId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const dialogLabel = title ?? ariaLabel;

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', onKeyDown);
    panelRef.current?.focus();

    if (lockScroll) {
      document.body.style.overflow = 'hidden';
    }

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      if (lockScroll) {
        document.body.style.overflow = '';
      }
    };
  }, [open, onClose, lockScroll]);

  if (!open) return null;

  const overlayClass =
    placement === 'center' ? 'ds-overlay ds-overlay--center' : 'ds-overlay ds-overlay--sheet';

  const content = (
    <div
      className={cn(overlayClass, className)}
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={hideHeader && !title ? ariaLabel : undefined}
        aria-labelledby={!hideHeader && dialogLabel ? titleId : undefined}
        aria-describedby={description ? descId : undefined}
        tabIndex={-1}
        className={cn(
          'ds-sheet-panel ds-card glow-bottom-gold outline-none',
          size === 'tall' && 'ds-sheet-panel--tall',
          panelClassName,
        )}
      >
        {!hideHeader && dialogLabel ? (
          <div className="flex items-start justify-between gap-[var(--ds-space-3)]">
            <div className="min-w-0 flex-1">
              <h2
                id={titleId}
                className="font-[family-name:var(--ds-font-display)] text-[length:var(--ds-font-size-lg)] text-accent"
              >
                {title}
              </h2>
              {description ? (
                <p id={descId} className="mt-1 text-[length:var(--ds-font-size-xs)] text-text-dim">
                  {description}
                </p>
              ) : null}
            </div>
            {headerAction ? <div className="shrink-0">{headerAction}</div> : null}
          </div>
        ) : headerAction ? (
          <div className="relative">{headerAction}</div>
        ) : null}
        <div
          className={cn(
            hideHeader ? undefined : 'mt-[var(--ds-space-4)]',
            bodyClassName,
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );

  if (portal && typeof document !== 'undefined') {
    return createPortal(content, document.body);
  }

  return content;
}

export type SheetBodyProps = {
  children: ReactNode;
  className?: string;
};

export function SheetBody({ children, className }: SheetBodyProps) {
  return <div className={cn('min-h-0 flex-1 overflow-y-auto', className)}>{children}</div>;
}

export type SheetFooterProps = {
  children: ReactNode;
  className?: string;
};

export function SheetFooter({ children, className }: SheetFooterProps) {
  return (
    <div className={cn('mt-[var(--ds-space-5)] flex flex-wrap gap-[var(--ds-space-2)]', className)}>
      {children}
    </div>
  );
}
