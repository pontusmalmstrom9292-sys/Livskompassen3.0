import { Navigate } from 'react-router-dom';
import type { DrawerHubId } from '../navigation/hubTabs';
import type { HubLegacyRedirectTarget } from '../navigation/hooks/useHubTab';
import { useHubTab } from '../navigation/hooks/useHubTab';
import { HubDropdownNav, type HubDropdownGlow } from './HubDropdownNav';

type HubTabBarProps = {
  hubId: DrawerHubId;
  defaultTab?: string;
  legacyTabRedirects?: Record<string, HubLegacyRedirectTarget>;
  className?: string;
  /** Visad aktiv flik (t.ex. Hjärtat när Valv är öppet). */
  displayActive?: string;
  onTabChange?: (id: string) => void;
  /** Obsidian Calm 2.0 — silo-glow på rullgardin. */
  glowColor?: HubDropdownGlow;
  size?: 'default' | 'compact';
};

function defaultGlowForHub(hubId: DrawerHubId): HubDropdownGlow {
  if (hubId === 'familjen' || hubId === 'familj' || hubId === 'dagbok') return 'blue';
  return 'gold';
}

export function HubTabBar({
  hubId,
  defaultTab,
  legacyTabRedirects,
  className,
  displayActive,
  onTabChange,
  glowColor,
}: HubTabBarProps) {
  const { tabs, activeTab, setTab, legacyRedirect } = useHubTab(hubId, {
    defaultTab,
    legacyTabRedirects,
  });

  if (legacyRedirect) {
    return <Navigate to={legacyRedirect} replace />;
  }

  const active = displayActive ?? activeTab;
  const glow = glowColor ?? defaultGlowForHub(hubId);

  return (
    <div className={className}>
      <HubDropdownNav
        items={tabs}
        activeId={active}
        onChange={(id) => (onTabChange ? onTabChange(id) : setTab(id))}
        glowColor={glow}
        ariaLabel="Välj del i hubben"
      />
    </div>
  );
}
