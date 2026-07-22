import { useState, useRef, useEffect, useLayoutEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Check } from 'lucide-react';
import { clsx } from 'clsx';

export type DropdownItem<T extends string> = {
  id: T;
  label: string;
  icon?: React.ReactNode;
};

export type HubDropdownGlow = 'gold' | 'blue' | 'green';

type MenuPlacement = 'below' | 'above';

type MenuPosition = {
  top: number;
  left: number;
  width: number;
  placement: MenuPlacement;
};

type Props<T extends string> = {
  items: DropdownItem<T>[];
  activeId: T;
  onChange: (id: T) => void;
  glowColor?: HubDropdownGlow;
  /** Tillgänglig etikett för skärmläsare */
  ariaLabel?: string;
  /** Meddelar förälder när menyn öppnas/stängs (t.ex. dölj hjälptext under). */
  onOpenChange?: (open: boolean) => void;
};

const GLOW_OPEN: Record<HubDropdownGlow, string> = {
  gold: 'border-accent/40 shadow-[0_4px_15px_-3px_rgba(212,175,55,0.15)] text-accent',
  blue: 'border-accent/40 shadow-[0_4px_15px_-3px_rgba(212,175,55,0.15)] text-accent',
  green: 'border-accent/40 shadow-[0_4px_15px_-3px_rgba(212,175,55,0.15)] text-accent',
};

const GLOW_ICON: Record<HubDropdownGlow, string> = {
  gold: 'text-accent',
  blue: 'text-accent',
  green: 'text-accent',
};

const MENU_GAP_PX = 8;

function canUseDomPortal(): boolean {
  return typeof document !== 'undefined' && Boolean(document.body);
}

/** Obsidian Calm 2.0 — hub-vy: en rullgardin istället för horisontella flikrader. */
export function HubDropdownNav<T extends string>({
  items,
  activeId,
  onChange,
  glowColor = 'blue',
  ariaLabel = 'Välj vy',
  onOpenChange,
}: Props<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [menuPos, setMenuPos] = useState<MenuPosition | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const activeItem = items.find((item) => item.id === activeId) ?? items[0];

  const setOpen = useCallback(
    (open: boolean) => {
      setIsOpen(open);
      onOpenChange?.(open);
      if (!open) setMenuPos(null);
    },
    [onOpenChange],
  );

  const updateMenuPosition = useCallback(() => {
    const trigger = triggerRef.current;
    if (!trigger || !isOpen) return;

    const rect = trigger.getBoundingClientRect();
    const viewportHeight = window.visualViewport?.height ?? window.innerHeight;
    const menuHeight = menuRef.current?.offsetHeight ?? items.length * 48 + 16;
    const spaceBelow = viewportHeight - rect.bottom - MENU_GAP_PX;
    const placement: MenuPlacement =
      spaceBelow >= Math.min(menuHeight, 200) ? 'below' : 'above';
    const top =
      placement === 'below'
        ? rect.bottom + MENU_GAP_PX
        : Math.max(MENU_GAP_PX, rect.top - menuHeight - MENU_GAP_PX);

    const viewportWidth = window.visualViewport?.width ?? window.innerWidth;
    const maxWidth = viewportWidth - MENU_GAP_PX * 2;
    const width = Math.min(rect.width, maxWidth);
    const left = Math.min(
      Math.max(MENU_GAP_PX, rect.left),
      viewportWidth - width - MENU_GAP_PX,
    );

    setMenuPos({ top, left, width, placement });
  }, [isOpen, items.length]);

  useLayoutEffect(() => {
    if (!isOpen) return;
    updateMenuPosition();
    const raf = requestAnimationFrame(updateMenuPosition);
    return () => cancelAnimationFrame(raf);
  }, [isOpen, updateMenuPosition, activeId, items.length]);

  useEffect(() => {
    if (!isOpen) return;
    const onScrollOrResize = () => updateMenuPosition();
    window.addEventListener('resize', onScrollOrResize);
    window.addEventListener('scroll', onScrollOrResize, true);
    const vv = window.visualViewport;
    if (vv) {
      vv.addEventListener('resize', onScrollOrResize);
      vv.addEventListener('scroll', onScrollOrResize);
    }
    return () => {
      window.removeEventListener('resize', onScrollOrResize);
      window.removeEventListener('scroll', onScrollOrResize, true);
      vv?.removeEventListener('resize', onScrollOrResize);
      vv?.removeEventListener('scroll', onScrollOrResize);
    };
  }, [isOpen, updateMenuPosition]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (rootRef.current?.contains(target) || menuRef.current?.contains(target)) {
        return;
      }
      setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    if (isOpen) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, setOpen]);

  const handleSelect = (id: T) => {
    onChange(id);
    setOpen(false);
  };

  if (!activeItem) return null;

  const menuNode = (
    <div
      ref={menuRef}
      role="listbox"
      aria-label={ariaLabel}
      style={
        menuPos
          ? {
              position: 'fixed',
              top: menuPos.top,
              left: menuPos.left,
              width: menuPos.width,
              zIndex: 'var(--ds-z-overlay)',
            }
          : { position: 'fixed', visibility: 'hidden', pointerEvents: 'none' }
      }
      className={clsx(
        'hub-dropdown-nav__menu origin-top rounded-2xl border border-border/40 bg-surface/95 p-1.5 shadow-2xl backdrop-blur-2xl transition-all duration-300',
        menuPos?.placement === 'above' ? 'origin-bottom' : 'origin-top',
        isOpen && menuPos
          ? 'pointer-events-auto scale-y-100 opacity-100'
          : 'pointer-events-none scale-y-95 opacity-0',
      )}
    >
      {items.map((item) => {
        const selected = activeId === item.id;
        return (
          <button
            key={item.id}
            type="button"
            role="option"
            aria-selected={selected}
            aria-label={item.label}
            onClick={() => handleSelect(item.id)}
            className={clsx(
              'hub-dropdown-nav__option group flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-all',
              selected
                ? 'bg-surface-3 text-text'
                : 'text-text-muted hover:bg-surface-2 hover:text-text',
            )}
          >
            <div className="flex min-w-0 items-center gap-2.5">
              {item.icon ? (
                <span
                  className={clsx(
                    'shrink-0 transition-colors',
                    selected ? GLOW_ICON[glowColor] : 'text-text-muted group-hover:text-text',
                  )}
                >
                  {item.icon}
                </span>
              ) : null}
              <span className="truncate">{item.label}</span>
            </div>
            {selected ? <Check className="h-4 w-4 shrink-0 text-text-muted" aria-hidden /> : null}
          </button>
        );
      })}
    </div>
  );

  return (
    <div
      className={clsx(
        'hub-dropdown-nav relative w-full',
        isOpen && 'hub-dropdown-nav--open',
      )}
      ref={rootRef}
    >
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={ariaLabel}
        onClick={() => setOpen(!isOpen)}
        className={clsx(
          'hub-dropdown-nav__trigger flex w-full min-h-[var(--ds-touch-target,2.75rem)] items-center justify-between rounded-2xl border bg-surface-2/70 p-3.5 backdrop-blur-xl transition-all duration-300',
          isOpen ? GLOW_OPEN[glowColor] : 'border-border/30 text-text hover:bg-surface-3/50',
        )}
      >
        <div className="flex min-w-0 items-center gap-2.5">
          {activeItem.icon ? (
            <span
              className={clsx(
                'shrink-0 transition-colors',
                isOpen ? GLOW_ICON[glowColor] : 'text-text-muted',
              )}
            >
              {activeItem.icon}
            </span>
          ) : null}
          <span className="truncate text-sm font-semibold tracking-wide">{activeItem.label}</span>
        </div>
        <ChevronDown
          className={clsx(
            'h-4 w-4 shrink-0 transition-transform duration-300',
            isOpen ? 'rotate-180' : 'text-text-muted',
          )}
          aria-hidden
        />
      </button>

      {isOpen && canUseDomPortal() ? createPortal(menuNode, document.body) : null}
    </div>
  );
}
