import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { clsx } from 'clsx';

export type DropdownItem<T extends string> = {
  id: T;
  label: string;
  icon?: React.ReactNode;
};

export type HubDropdownGlow = 'gold' | 'blue' | 'green';

type Props<T extends string> = {
  items: DropdownItem<T>[];
  activeId: T;
  onChange: (id: T) => void;
  glowColor?: HubDropdownGlow;
  /** Tillgänglig etikett för skärmläsare */
  ariaLabel?: string;
};

const GLOW_OPEN: Record<HubDropdownGlow, string> = {
  gold: 'border-accent/40 shadow-[0_4px_15px_-3px_rgba(212,175,55,0.15)] text-accent',
  blue: 'border-indigo-500/40 shadow-[0_4px_15px_-3px_rgba(99,102,241,0.15)] text-indigo-400',
  green: 'border-emerald-500/40 shadow-[0_4px_15px_-3px_rgba(16,185,129,0.15)] text-emerald-400',
};

const GLOW_ICON: Record<HubDropdownGlow, string> = {
  gold: 'text-accent',
  blue: 'text-indigo-400',
  green: 'text-emerald-400',
};

/** Obsidian Calm 2.0 — hub-vy: en rullgardin istället för horisontella flikrader. */
export function HubDropdownNav<T extends string>({
  items,
  activeId,
  onChange,
  glowColor = 'blue',
  ariaLabel = 'Välj vy',
}: Props<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const activeItem = items.find((item) => item.id === activeId) ?? items[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    if (isOpen) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen]);

  const handleSelect = (id: T) => {
    onChange(id);
    setIsOpen(false);
  };

  if (!activeItem) return null;

  return (
    <div className="relative z-40 w-full" ref={dropdownRef}>
      <button
        type="button"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={ariaLabel}
        onClick={() => setIsOpen(!isOpen)}
        className={clsx(
          'flex w-full items-center justify-between rounded-2xl border bg-surface-2/70 p-3.5 backdrop-blur-xl transition-all duration-300',
          isOpen ? GLOW_OPEN[glowColor] : 'border-border/30 text-text hover:bg-surface-3/50',
        )}
      >
        <div className="flex min-w-0 items-center gap-2.5">
          {activeItem.icon ? (
            <span
              className={clsx(
                'shrink-0 transition-colors',
                isOpen ? GLOW_ICON[glowColor] : 'text-text-dim',
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
            isOpen ? 'rotate-180' : 'text-text-dim',
          )}
          aria-hidden
        />
      </button>

      <div
        role="listbox"
        aria-label={ariaLabel}
        className={clsx(
          'absolute left-0 right-0 top-full mt-2 origin-top rounded-2xl border border-border/40 bg-surface/95 p-1.5 shadow-2xl backdrop-blur-2xl transition-all duration-300',
          isOpen ? 'pointer-events-auto scale-y-100 opacity-100' : 'pointer-events-none scale-y-95 opacity-0',
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
              onClick={() => handleSelect(item.id)}
              className={clsx(
                'group flex w-full items-center justify-between rounded-xl p-3 text-left text-sm font-medium transition-all',
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
                      selected ? GLOW_ICON[glowColor] : 'text-text-dim group-hover:text-text',
                    )}
                  >
                    {item.icon}
                  </span>
                ) : null}
                <span className="truncate">{item.label}</span>
              </div>
              {selected ? <Check className="h-4 w-4 shrink-0 text-text-dim" aria-hidden /> : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
