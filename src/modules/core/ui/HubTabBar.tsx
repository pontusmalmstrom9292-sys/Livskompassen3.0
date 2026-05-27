import { Navigate } from 'react-router-dom';
import type { DrawerHubId } from '../navigation/hubTabs';
import type { HubLegacyRedirectTarget } from '../navigation/hooks/useHubTab';
import { useHubTab } from '../navigation/hooks/useHubTab';
import { TabBar } from './TabBar';

type HubTabBarProps = {
  hubId: DrawerHubId;
  defaultTab?: string;
  legacyTabRedirects?: Record<string, HubLegacyRedirectTarget>;
  className?: string;
  /** Visad aktiv flik (t.ex. Hjärtat när Valv är öppet). */
  displayActive?: string;
  onTabChange?: (id: string) => void;
  size?: 'default' | 'compact';
};

export function HubTabBar({
  hubId,
  defaultTab,
  legacyTabRedirects,
  className,
  displayActive,
  onTabChange,
  size = 'default',
}: HubTabBarProps) {
  const { tabs, activeTab, setTab, legacyRedirect } = useHubTab(hubId, {
    defaultTab,
    legacyTabRedirects,
  });

  if (legacyRedirect) {
    return <Navigate to={legacyRedirect} replace />;
  }

  const active = displayActive ?? activeTab;

  return (
    <div className={className}>
      <TabBar
        size={size}
        tabs={tabs}
        active={active}
        onChange={(id) => (onTabChange ? onTabChange(id) : setTab(id))}
      />
    </div>
  );
}
