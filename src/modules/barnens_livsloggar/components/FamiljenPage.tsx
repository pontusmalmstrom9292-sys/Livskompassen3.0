import { useEffect } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';
import { TabBar } from '../../core/ui/TabBar';
import { FAMILJEN_TABS, isFamiljenTabId, type FamiljenTabId } from '../constants/familjenTabs';
import { useFamiljenShell } from '../hooks/useFamiljenShell';
import { FamiljenChildPicker } from './familjen/FamiljenChildPicker';
import { FamiljenReflektionTab } from './familjen/FamiljenReflektionTab';
import { FamiljenLivsloggTab } from './familjen/FamiljenLivsloggTab';
import { FamiljenTillsammansTab } from './familjen/FamiljenTillsammansTab';
import { HubPageShell } from '../../core/layout/HubPageShell';
import { ParentReminderFooter } from './ParentReminderFooter';
import { vaultDrawerPath } from '../../core/navigation/navTruth';
import { MaterialPackShortcuts, useLifeHubPreset } from '../../core/lifeOs';

function vaultRedirectSearch(vaultTab: string): string {
  const vaultPath = vaultDrawerPath(vaultTab);
  const qIndex = vaultPath.indexOf('?');
  return qIndex >= 0 ? vaultPath.slice(qIndex) : '';
}

export function FamiljenPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');
  const shell = useFamiljenShell();
  const { preset } = useLifeHubPreset();

  const setTab = (id: FamiljenTabId) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('tab', id);
      return next;
    });
  };

  useEffect(() => {
    if (tabParam && !isFamiljenTabId(tabParam) && tabParam !== 'kunskap' && tabParam !== 'monster') {
      setTab('reflektion');
    }
  }, [tabParam]);

  if (tabParam === 'kunskap') {
    return <Navigate to={{ pathname: '/dagbok', search: vaultRedirectSearch('kunskapsbank') }} replace />;
  }

  if (tabParam === 'monster') {
    return <Navigate to={{ pathname: '/dagbok', search: vaultRedirectSearch('familjen_monster') }} replace />;
  }

  const activeTab: FamiljenTabId = isFamiljenTabId(tabParam) ? tabParam : 'reflektion';

  if (!shell.user) {
    return <p className="text-sm text-text-muted">Logga in för att öppna Familjen.</p>;
  }

  const showChildPicker = activeTab !== 'tillsammans';

  return (
    <div className="familjen-hub relative">
      <div className="familjen-hub__aurora" aria-hidden />
      <HubPageShell
        className="relative z-[1]"
        eyebrow="Familjen"
        title="Små steg. Stora minnen. Tillsammans."
        footerSlot={activeTab === 'reflektion' ? <ParentReminderFooter /> : undefined}
      >
        <MaterialPackShortcuts preset={preset} hub="familjen" />

        <div className="familjen-hub__tabs relative">
          <TabBar
            tabs={FAMILJEN_TABS.map((t) => {
              const Icon = t.icon;
              return {
                id: t.id,
                label: t.label,
                icon: <Icon className="h-3 w-3" />,
              };
            })}
            active={activeTab}
            onChange={setTab}
          />
        </div>

        {showChildPicker && activeTab !== 'reflektion' && (
          <FamiljenChildPicker
            activeChild={shell.activeChild}
            children={shell.childAliases}
            onChange={shell.setActiveChild}
          />
        )}

        <div className="relative space-y-4">
          {activeTab === 'reflektion' && <FamiljenReflektionTab shell={shell} />}
          {activeTab === 'livslogg' && <FamiljenLivsloggTab shell={shell} />}
          {activeTab === 'tillsammans' && <FamiljenTillsammansTab shell={shell} />}
        </div>
      </HubPageShell>
    </div>
  );
}
