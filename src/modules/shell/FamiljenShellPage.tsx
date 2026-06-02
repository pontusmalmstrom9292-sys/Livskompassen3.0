import { Navigate } from 'react-router-dom';
import { TabBar } from '../core/ui/TabBar';
import { HubPageShell } from '../core/layout/HubPageShell';
import { useHubTab } from '../core/navigation/hooks/useHubTab';
import { useFamiljenShell } from '@/features/family/children/hooks/useFamiljenShell';
import { FamiljenChildPicker } from '@/features/family/children/components/familjen/FamiljenChildPicker';
import { FamiljenReflektionTab } from '@/features/family/children/components/familjen/FamiljenReflektionTab';
import { FamiljenLivsloggTab } from '@/features/family/children/components/familjen/FamiljenLivsloggTab';
import { FamiljenTillsammansTab } from '@/features/family/children/components/familjen/FamiljenTillsammansTab';
import { ParentReminderFooter } from '@/features/family/children/components/ParentReminderFooter';
import { BarnportenInboxPanel } from '@/features/onboarding/barnporten/components/BarnportenInboxPanel';
import { BarnportenOrkesterPanel } from '@/features/onboarding/barnporten/components/BarnportenOrkesterPanel';
import { SafeHarborPage } from '@/features/family/safeHarbor';
import { MaterialPackShortcuts, useLifeHubPreset } from '../core/lifeOs';

export function FamiljenShellPage() {
  const { tabs, activeTab, setTab, legacyRedirect } = useHubTab('familjen', {
    defaultTab: 'reflektion',
  });
  const shell = useFamiljenShell();
  const { preset } = useLifeHubPreset();

  if (legacyRedirect) {
    return <Navigate to={legacyRedirect} replace />;
  }

  const showChildPicker =
    activeTab === 'livslogg' || activeTab === 'reflektion' || activeTab === 'barnporten';

  if (!shell.user) {
    return <p className="text-sm text-text-muted">Logga in för att öppna Familjen.</p>;
  }

  return (
    <div className="familjen-hub relative">
      <div className="familjen-hub__aurora" aria-hidden />
      <HubPageShell
        className="relative z-[1]"
        eyebrow="Familjen"
        title="Barnfokus & Trygg Hamn"
        lead="Stärk banden, logga neutralt och filtrera kommunikation mot ex-partner."
        footerSlot={activeTab === 'reflektion' ? <ParentReminderFooter /> : undefined}
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
          {activeTab === 'reflektion' && <FamiljenReflektionTab shell={shell} />}
          {activeTab === 'livslogg' && <FamiljenLivsloggTab shell={shell} />}
          {activeTab === 'tillsammans' && <FamiljenTillsammansTab shell={shell} />}
          {activeTab === 'barnporten' && (
            <div className="space-y-4">
              <BarnportenInboxPanel />
              <BarnportenOrkesterPanel />
              <a href="/barnporten" className="btn-pill--ghost text-sm">
                Öppna Barnporten (barn-PWA)
              </a>
            </div>
          )}
          {activeTab === 'hamn' && <SafeHarborPage />}
        </div>
      </HubPageShell>
    </div>
  );
}
