import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Heart, Users } from 'lucide-react';
import { BentoCard } from '../../core/ui/BentoCard';
import { PinGate } from '../../core/ui/PinGate';
import { TabBar } from '../../core/ui/TabBar';
import { FAMILJEN_TABS, isFamiljenTabId, type FamiljenTabId } from '../constants/familjenTabs';
import { useFamiljenShell } from '../hooks/useFamiljenShell';
import { FamiljenChildPicker } from './familjen/FamiljenChildPicker';
import { FamiljenReflektionTab } from './familjen/FamiljenReflektionTab';
import { FamiljenLivsloggTab } from './familjen/FamiljenLivsloggTab';
import { FamiljenTillsammansTab } from './familjen/FamiljenTillsammansTab';
import { FamiljenMonsterTab } from './familjen/FamiljenMonsterTab';
import { FamiljenKunskapHubTab } from './familjen/FamiljenKunskapHubTab';

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

  if (!shell.unlocked) {
    return (
      <div className="space-y-6">
        <header className="text-center">
          <p className="text-[10px] uppercase tracking-[0.35em] text-accent">Familjen</p>
          <h1 className="mt-2 font-display text-2xl text-text-primary">
            Små steg. Stora minnen. Tillsammans.
          </h1>
          <p className="mt-2 text-sm text-text-muted">
            Reflektion, livslogg och kunskapshub — trygg hamn för Kasper och Arvid.
          </p>
        </header>
        <BentoCard title="Familjen" icon={<Users className="h-4 w-4" />}>
          <PinGate
            description="Separat PIN från Valv. Låses vid tab-byte (Zero Footprint)."
            pin={shell.pin}
            confirmPin={shell.confirmPin}
            setupMode={shell.needsSetup}
            error={shell.error}
            icon={<Heart className="h-4 w-4" />}
            onPinChange={shell.setPin}
            onConfirmPinChange={shell.setConfirmPin}
            onSubmit={shell.handleUnlock}
          />
        </BentoCard>
      </div>
    );
  }

  if (!shell.user) {
    return <p className="text-sm text-text-muted">Logga in för att öppna Familjen.</p>;
  }

  const showChildPicker = activeTab !== 'tillsammans' && activeTab !== 'kunskap';

  return (
    <div className="space-y-5 pb-8">
      <header className="text-center">
        <p className="text-[10px] uppercase tracking-[0.35em] text-accent">Familjen</p>
        <h1 className="mt-2 font-display text-2xl text-text-primary">
          Små steg. Stora minnen. Tillsammans.
        </h1>
      </header>

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

      {showChildPicker && (
        <FamiljenChildPicker
          activeChild={shell.activeChild}
          children={shell.childAliases}
          onChange={shell.setActiveChild}
        />
      )}

      {activeTab === 'reflektion' && <FamiljenReflektionTab shell={shell} />}
      {activeTab === 'livslogg' && <FamiljenLivsloggTab shell={shell} />}
      {activeTab === 'tillsammans' && <FamiljenTillsammansTab shell={shell} />}
      {activeTab === 'monster' && <FamiljenMonsterTab shell={shell} />}
      {activeTab === 'kunskap' && <FamiljenKunskapHubTab activeChild={shell.activeChild} />}
    </div>
  );
}
