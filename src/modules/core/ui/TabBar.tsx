import type { ReactNode } from 'react';
import { clsx } from 'clsx';

export type TabBarItem<T extends string = string> = {
  id: T;
  label: string;
  icon?: ReactNode;
};

type TabBarVariant = 'cluster' | 'module';

type TabBarProps<T extends string> = {
  tabs: TabBarItem<T>[];
  active: T;
  onChange: (id: T) => void;
  variant?: TabBarVariant;
};

export function TabBar<T extends string>({
  tabs,
  active,
  onChange,
  variant = 'module',
}: TabBarProps<T>) {
  const isCluster = variant === 'cluster';

  return (
    <div
      className={clsx('tab-bar', isCluster && 'tab-bar--cluster')}
      role="tablist"
      aria-label="Flikar"
    >
      <div className={clsx('tab-bar__track', isCluster && 'tab-bar__track--cluster')}>
        {tabs.map(({ id, label, icon }) => {
          const selected = active === id;
          return (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={selected}
              tabIndex={selected ? 0 : -1}
              onClick={() => onChange(id)}
              className={clsx(
                'tab-bar__item',
                isCluster ? 'tab-bar__item--cluster' : 'tab-bar__item--module',
                selected && (isCluster ? 'tab-bar__item--cluster-active' : 'chip--active'),
                !selected && !isCluster && 'chip--idle',
              )}
            >
              {icon}
              <span>{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
