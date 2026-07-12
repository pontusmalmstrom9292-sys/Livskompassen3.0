import type { KeyboardEvent, ReactNode } from 'react';

export type TabBarItem<T extends string = string> = {
  id: T;
  label: string;
  icon?: ReactNode;
};

type TabBarProps<T extends string> = {
  tabs: TabBarItem<T>[];
  active: T;
  onChange: (id: T) => void;
  /** Kompakt padding (t.ex. Valv). */
  size?: 'default' | 'compact';
};

export function TabBar<T extends string>({
  tabs,
  active,
  onChange,
  size = 'default',
}: TabBarProps<T>) {
  const pad = size === 'compact' ? 'px-3 py-2' : 'px-4 py-2.5';

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    const nextIdx =
      e.key === 'ArrowRight' ? Math.min(index + 1, tabs.length - 1) : Math.max(index - 1, 0);
    const next = tabs[nextIdx];
    if (next && next.id !== tabs[index]?.id) {
      e.preventDefault();
      onChange(next.id);
    }
  };

  return (
    <div className="tab-bar-rail overflow-x-auto overscroll-x-contain sm:overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden max-sm:overflow-x-visible max-sm:overscroll-x-auto">
      <div
        className="tab-bar-rail__inner flex min-w-min gap-2 max-sm:w-full max-sm:min-w-0 max-sm:flex-wrap"
        role="tablist"
        aria-label="Flikar"
      >
        {tabs.map(({ id, label, icon }, index) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={isActive}
              tabIndex={isActive ? 0 : -1}
              onClick={() => onChange(id)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className={`flex shrink-0 touch-manipulation items-center gap-2 rounded-full min-h-[var(--ds-touch-target,2.75rem)] max-sm:min-w-0 max-sm:flex-1 max-sm:justify-center ${pad} text-xs uppercase tracking-widest focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent/50 ${
                isActive ? 'chip--active' : 'chip--idle'
              }`}
            >
              {icon}
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
