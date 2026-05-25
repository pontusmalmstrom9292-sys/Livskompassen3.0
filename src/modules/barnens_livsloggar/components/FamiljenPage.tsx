import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { TabBar } from '../../core/ui/TabBar';
import { FAMILJEN_TABS, isFamiljenTabId, type FamiljenTabId } from '../constants/familjenTabs';
import { useFamiljenShell } from '../hooks/useFamiljenShell';
import { FamiljenChildPicker } from './familjen/FamiljenChildPicker';
import { FamiljenReflektionTab } from './familjen/FamiljenReflektionTab';
import { FamiljenLivsloggTab } from './familjen/FamiljenLivsloggTab';
import { FamiljenTillsammansTab } from './familjen/FamiljenTillsammansTab';
import { FamiljenMonsterTab } from './familjen/FamiljenMonsterTab';
import { FamiljenKunskapHubTab } from './familjen/FamiljenKunskapHubTab';
import { VaultZoneGate } from '../../core/security/VaultZoneGate';
import { HubPageShell } from '../../core/layout/HubPageShell';
import { ParentReminderFooter } from './ParentReminderFooter';

export function FamiljenPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');
  const activeTab: FamiljenTabId = isFamiljenTabId(tabParam) ? tabParam : 'reflektion';

  const shell = useFamiljenShell();

  const setTab = (id: FamiljenTabId) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('tab', id);
      return next;
    });
  };

  useEffect(() => {
    if (tabParam && !isFamiljenTabId(tabParam)) {
      setTab('reflektion');
    }
  }, [tabParam]);

  if (!shell.user) {
    return <p className="text-sm text-text-muted">Logga in för att öppna Familjen.</p>;
  }

  const showChildPicker = activeTab !== 'tillsammans' && activeTab !== 'kunskap';

  return (
    <div className="familjen-hub relative">
      <div className="familjen-hub__aurora" aria-hidden />
      <HubPageShell
        className="relative z-[1]"
        eyebrow="Familjen"
        title="Små steg. Stora minnen. Tillsammans."
        footerSlot={activeTab === 'reflektion' ? <ParentReminderFooter /> : undefined}
      >
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
        {(activeTab === 'monster' || activeTab === 'kunskap') && (
          <VaultZoneGate
            zone="familjen_forensic"
            title="Familjen — analys & kunskap"
            description="Mönster och RAG-sökning. Samma PIN som Valv. Sessionen gäller tills du lämnar fliken eller varit inaktiv 15 min."
          >
            {activeTab === 'monster' && <FamiljenMonsterTab shell={shell} />}
            {activeTab === 'kunskap' && <FamiljenKunskapHubTab activeChild={shell.activeChild} />}
          </VaultZoneGate>
        )}
      </div>
      </HubPageShell>
    </div>
  );
}
