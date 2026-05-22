import type { ReactNode } from 'react';
import { TabBar, type TabBarItem } from './TabBar';
import type { ClusterTone } from '../navigation/appNavigation';

const toneClass: Record<ClusterTone, string> = {
  gold: 'cluster-shell--gold',
  indigo: 'cluster-shell--indigo',
  lavender: 'cluster-shell--lavender',
  emerald: 'cluster-shell--emerald',
};

type ClusterShellProps<T extends string> = {
  title: string;
  description: string;
  tone?: ClusterTone;
  hint?: string;
  tabs?: TabBarItem<T>[];
  activeTab?: T;
  onTabChange?: (id: T) => void;
  children: ReactNode;
};

export function ClusterShell<T extends string>({
  title,
  description,
  tone = 'gold',
  hint,
  tabs,
  activeTab,
  onTabChange,
  children,
}: ClusterShellProps<T>) {
  return (
    <div className={`cluster-shell space-y-4 ${toneClass[tone]}`}>
      <header className="cluster-shell__header">
        <h2 className="cluster-shell__title">{title}</h2>
        <p className="cluster-shell__desc">{description}</p>
        {hint && <p className="cluster-shell__hint">{hint}</p>}
      </header>

      {tabs && activeTab !== undefined && onTabChange && (
        <TabBar tabs={tabs} active={activeTab} onChange={onTabChange} variant="cluster" />
      )}

      <div className="cluster-shell__body">{children}</div>
    </div>
  );
}
