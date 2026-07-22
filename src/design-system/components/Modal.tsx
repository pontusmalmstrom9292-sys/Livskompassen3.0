import { useEffect, useId, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../utils/cn';
import { trapTabKey } from '../utils/trapTabKey';
import { useScrollLock } from '@/core/hooks/useScrollLock';

export type ModalProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  ariaLabel?: string;
  children: ReactNode;
  className?: string;
  panelClassName?: string;
  hideHeader?: boolean;
  headerAction?: ReactNode;
  portal?: boolean;
  lockScroll?: boolean;
  /** Initial focus element — defaults to panel */
  initialFocusRef?: React.RefObject<HTMLElement>;
};

/**
 * Modal — centered dialog with Escape dismiss, focus trap, and focus restore.
 */
export function Modal({
  open,
  onClose,
  title,
  description,
  ariaLabel,
  children,
  className,
  panelClassName,
  hideHeader = false,
  headerAction,
  portal = true,
  lockScroll = true,
  initialFocusRef,
}: ModalProps) {
  const titleId = useId();
  const descId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);
  const dialogLabel = title ?? ariaLabel;

  useScrollLock(open && lockScroll);

  useEffect(() => {
    if (!open) return;

    previouslyFocusedRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      trapTabKey(e, panelRef.current);
    };

    window.addEventListener('keydown', onKeyDown);
    const focusTarget = initialFocusRef?.current ?? panelRef.current;
    focusTarget?.focus();

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      previouslyFocusedRef.current?.focus?.();
      previouslyFocusedRef.current = null;
    };
  }, [open, onClose, initialFocusRef]);

  if (!open) return null;

  const content = (
    <div
      className={cn('ds-overlay ds-overlay--center', className)}
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
        className={cn('ds-modal-panel ds-card glow-bottom-gold outline-none', panelClassName)}
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
                <p id={descId} className="mt-1 text-[length:var(--ds-font-size-xs)] text-text-muted">
                  {description}
                </p>
              ) : null}
            </div>
            {headerAction ? <div className="shrink-0">{headerAction}</div> : null}
          </div>
        ) : null}
        <div className={hideHeader ? undefined : 'mt-[var(--ds-space-4)]'}>{children}</div>
      </div>
    </div>
  );

  if (portal && typeof document !== 'undefined') {
    return createPortal(content, document.body);
  }

  return content;
}

export type ModalFooterProps = {
  children: ReactNode;
  className?: string;
};

export function ModalFooter({ children, className }: ModalFooterProps) {
  return (
    <div className={cn('mt-[var(--ds-space-5)] flex flex-wrap gap-[var(--ds-space-2)]', className)}>
      {children}
    </div>
  );
}
