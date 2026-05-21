import type { ReactNode } from 'react';

export type TabBarItem<T extends string = string> = {
  id: T;
  label: string;
  icon?: ReactNode;
};

type TabBarProps<T extends string> = {
  tabs: TabBarItem<T>[];
  active: T;
  onChange: (id: T) => void;
};

export function TabBar<T extends string>({ tabs, active, onChange }: TabBarProps<T>) {
  return (
    <div className="flex gap-2">
      {tabs.map(({ id, label, icon }) => (
        <button
          key={id}
          type="button"
          onClick={() => onChange(id)}
          className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs uppercase tracking-widest ${
            active === id ? 'chip--active' : 'chip--idle'
          }`}
        >
          {icon}
          {label}
        </button>
      ))}
    </div>
  );
}
