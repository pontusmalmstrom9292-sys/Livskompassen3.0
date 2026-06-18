import { useState } from 'react';
import { clsx } from 'clsx';
import { ChevronUp, Zap, type LucideIcon } from 'lucide-react';

export type SnabbstartDockItem<T extends string = string> = {
  id: T;
  label: string;
  icon: LucideIcon;
};

type Props<T extends string> = {
  items: SnabbstartDockItem<T>[];
  activeId?: T;
  onSelect: (id: T) => void;
};

/** Ihopfällbar snabbstart ovanför executive-dock — dold som standard. */
export function FreeportExecSnabbstartDock<T extends string>({
  items,
  activeId,
  onSelect,
}: Props<T>) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={clsx(
        'design-freeport__exec-snabb-dock',
        open && 'design-freeport__exec-snabb-dock--open',
      )}
    >
      <div
        className={clsx(
          'design-freeport__exec-snabb-dock-strip',
          open && 'design-freeport__exec-snabb-dock-strip--open',
        )}
        aria-hidden={!open}
      >
        <p className="design-freeport__exec-snabb-dock-label">Snabbstart</p>
        <div className="design-freeport__exec-snabb-dock-scroll" role="list">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                role="listitem"
                className={clsx(
                  'design-freeport__exec-snabb-dock-chip',
                  activeId === item.id && 'design-freeport__exec-snabb-dock-chip--on',
                )}
                onClick={() => {
                  onSelect(item.id);
                  setOpen(false);
                }}
              >
                <Icon className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
      <button
        type="button"
        className="design-freeport__exec-snabb-dock-toggle"
        aria-expanded={open}
        aria-label={open ? 'Dölj snabbstart' : 'Visa snabbstart'}
        onClick={() => setOpen((v) => !v)}
      >
        <Zap className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
        <span>Snabbstart</span>
        <ChevronUp
          className={clsx(
            'design-freeport__exec-snabb-dock-chevron',
            open && 'design-freeport__exec-snabb-dock-chevron--open',
          )}
          strokeWidth={1.5}
          aria-hidden
        />
      </button>
    </div>
  );
}
