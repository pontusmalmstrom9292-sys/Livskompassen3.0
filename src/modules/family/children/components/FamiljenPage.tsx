import { Navigate } from 'react-router-dom';
import { TabBar } from '../../../core/ui/TabBar';
import { useHubTab } from '../../../core/navigation/hooks/useHubTab';
import { vaultDrawerPath } from '../../../core/navigation/navTruth';
import { useFamiljenShell } from '../hooks/useFamiljenShell';
import { FamiljenChildPicker } from './familjen/FamiljenChildPicker';
import { FamiljenReflektionTab } from './familjen/FamiljenReflektionTab';
import { FamiljenLivsloggTab } from './familjen/FamiljenLivsloggTab';
import { FamiljenTillsammansTab } from './familjen/FamiljenTillsammansTab';
import { HubPageShell } from '../../../core/layout/HubPageShell';
import { ParentReminderFooter } from './ParentReminderFooter';
import { MaterialPackShortcuts, useLifeHubPreset } from '../../../core/lifeOs';
import type { FamiljenTabId } from '../constants/familjenTabs';

function vaultRedirectSearch(vaultTab: string): string {
  const vaultPath = vaultDrawerPath(vaultTab);
  const qIndex = vaultPath.indexOf('?');
  return qIndex >= 0 ? vaultPath.slice(qIndex) : '';
}

export function FamiljenPage() {
  const { tabs, activeTab, setTab, legacyRedirect } = useHubTab('familjen', {
    legacyTabRedirects: {
      kunskap: { pathname: '/dagbok', search: '?tab=bevis&vaultTab=kunskapsbank' },
      monster: { pathname: '/dagbok', search: vaultRedirectSearch('familjen_monster') },
    },
  });
  const shell = useFamiljenShell();
  const { preset } = useLifeHubPreset();

  if (legacyRedirect) {
    return <Navigate to={legacyRedirect} replace />;
  }

  const tab = activeTab as FamiljenTabId;

  if (!shell.user) {
    return <p className="text-sm text-text-muted">Logga in för att öppna Familjen.</p>;
  }

  const showChildPicker = tab !== 'tillsammans';

  return (
    <div className="familjen-hub relative">
      <div className="familjen-hub__aurora" aria-hidden />
      <HubPageShell
        className="relative z-[1]"
        eyebrow="Familjen"
        title="Små steg. Stora minnen. Tillsammans."
        footerSlot={tab === 'reflektion' ? <ParentReminderFooter /> : undefined}
      >
        <MaterialPackShortcuts preset={preset} hub="familjen" />

        <div className="familjen-hub__tabs relative">
          <TabBar tabs={tabs} active={tab} onChange={setTab} />
        </div>

        {showChildPicker && tab !== 'reflektion' && (
          <FamiljenChildPicker
            activeChild={shell.activeChild}
            children={shell.childAliases}
            onChange={shell.setActiveChild}
          />
        )}

        <div className="relative space-y-4">
          {tab === 'reflektion' && <FamiljenReflektionTab shell={shell} />}
          {tab === 'livslogg' && <FamiljenLivsloggTab shell={shell} />}
          {tab === 'tillsammans' && <FamiljenTillsammansTab shell={shell} />}
        </div>
      </HubPageShell>
    </div>
  );
}
