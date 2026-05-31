import { Navigate } from 'react-router-dom';
import { TabBar } from '../core/ui/TabBar';
import { HubPageShell } from '../core/layout/HubPageShell';
import { useHubTab } from '../core/navigation/hooks/useHubTab';
import { useFamiljenShell } from '../family/children/hooks/useFamiljenShell';
import { FamiljenChildPicker } from '../family/children/components/familjen/FamiljenChildPicker';
import { FamiljenReflektionTab } from '../family/children/components/familjen/FamiljenReflektionTab';
import { FamiljenLivsloggTab } from '../family/children/components/familjen/FamiljenLivsloggTab';
import { FamiljenTillsammansTab } from '../family/children/components/familjen/FamiljenTillsammansTab';
import { ParentReminderFooter } from '../family/children/components/ParentReminderFooter';
import { BarnportenInboxPanel } from '../barnporten/components/BarnportenInboxPanel';
import { BarnportenOrkesterPanel } from '../barnporten/components/BarnportenOrkesterPanel';
import { SafeHarborPage } from '../family/safeHarbor';
import { DrogfrihetHubPage } from '../drogfrihet';
import { MaterialPackShortcuts, useLifeHubPreset } from '../core/lifeOs';
import { vaultDrawerPath } from '../core/navigation/navTruth';
import type { FamiljenTabId } from '../family/children/constants/familjenTabs';

function vaultRedirectSearch(vaultTab: string): string {
  const vaultPath = vaultDrawerPath(vaultTab);
  const qIndex = vaultPath.indexOf('?');
  return qIndex >= 0 ? vaultPath.slice(qIndex) : '';
}

type FamiljShellTab = FamiljenTabId | 'hamn' | 'drogfrihet';

export function FamiljShellPage() {
  const { tabs, activeTab, setTab, legacyRedirect } = useHubTab('familj', {
    defaultTab: 'reflektion',
    legacyTabRedirects: {
      kunskap: { pathname: '/dagbok', search: '?tab=bevis&vaultTab=kunskapsbank' },
      monster: { pathname: '/dagbok', search: vaultRedirectSearch('familjen_monster') },
      familjen: { pathname: '/familj', search: '?tab=reflektion' },
    },
  });
  const shell = useFamiljenShell();
  const { preset } = useLifeHubPreset();

  if (legacyRedirect) {
    return <Navigate to={legacyRedirect} replace />;
  }

  const tab = activeTab as FamiljShellTab;
  const showChildPicker =
    tab === 'livslogg' || tab === 'reflektion' || tab === 'barnporten';

  if (!shell.user) {
    return <p className="text-sm text-text-muted">Logga in för att öppna Familj och gränser.</p>;
  }

  return (
    <div className="familjen-hub relative">
      <div className="familjen-hub__aurora" aria-hidden />
      <HubPageShell
        className="relative z-[1]"
        eyebrow="Familj och gränser"
        title="Barn · gränser · trygg hamn"
        lead="Barnfokus först. Hamn och stöd som egna flikar."
        footerSlot={tab === 'reflektion' ? <ParentReminderFooter /> : undefined}
      >
        <MaterialPackShortcuts preset={preset} hub="familjen" />
        <TabBar tabs={tabs} active={activeTab} onChange={setTab} />

        {showChildPicker && (
          <FamiljenChildPicker
            activeChild={shell.activeChild}
            children={shell.childAliases}
            onChange={shell.setActiveChild}
          />
        )}

        <div className="relative mt-4 space-y-4">
          {tab === 'reflektion' && <FamiljenReflektionTab shell={shell} />}
          {tab === 'livslogg' && <FamiljenLivsloggTab shell={shell} />}
          {tab === 'tillsammans' && <FamiljenTillsammansTab shell={shell} />}
          {tab === 'barnporten' && (
            <div className="space-y-4">
              <BarnportenInboxPanel />
              <BarnportenOrkesterPanel />
              <a href="/barnporten" className="btn-pill--ghost text-sm">
                Öppna Barnporten (barn-PWA)
              </a>
            </div>
          )}
          {tab === 'hamn' && <SafeHarborPage />}
          {tab === 'drogfrihet' && <DrogfrihetHubPage />}
        </div>
      </HubPageShell>
    </div>
  );
}
