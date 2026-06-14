import { clsx } from 'clsx';
import type { ReactNode } from 'react';

export type OdForgeBentoItem = {
  id: string;
  label: string;
  icon: ReactNode;
};

type Props = {
  items: OdForgeBentoItem[];
  activeId: string;
  onSelect: (id: string) => void;
};

export function OdForgeBentoGrid({ items, activeId, onSelect }: Props) {
  return (
    <div className="od-forge__bento" role="group" aria-label="Zoner">
      {items.map((item) => {
        const isActive = activeId === item.id;
        return (
          <button
            key={item.id}
            type="button"
            className={clsx('od-forge__bento-card', isActive && 'od-forge__bento-card--active')}
            aria-pressed={isActive}
            onClick={() => onSelect(item.id)}
          >
            <span className="od-forge__bento-icon">{item.icon}</span>
            <span className="od-forge__bento-label">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}
