import { useSearchParams } from 'react-router-dom';
import { Users, Anchor, Heart, Shield } from 'lucide-react';

import { HubPageShell } from '../layout/HubPageShell';
import { HubDropdownNav, type DropdownItem } from '../ui/HubDropdownNav';
import { CognitiveLoadStrip } from '../ui/CognitiveLoadStrip';
import { useFamiljenShell } from '@/features/family/children/hooks/useFamiljenShell';
import { FamiljenChildPicker } from '@/features/family/children/components/familjen/FamiljenChildPicker';
import { FamiljenReflektionTab } from '@/features/family/children/components/familjen/FamiljenReflektionTab';
import { ParentReminderFooter } from '@/features/family/children/components/ParentReminderFooter';
import { BarnensPage } from '@/features/family/children/components/BarnensPage';
import { SafeHarborPage } from '@/features/family/safeHarbor/components/SafeHarborPage';
import { DrogfrihetHubPage as DrogfrihetPage } from '@/features/dailyLife/drogfrihet/components/DrogfrihetHubPage';

type FamiljTabId = 'reflektion' | 'livslogg' | 'hamn' | 'drogfrihet';

const FAMILJ_OPTIONS: DropdownItem<FamiljTabId>[] = [
  { id: 'reflektion', label: 'Dagens Barnfokus', icon: <Heart className="h-4 w-4" /> },
  { id: 'livslogg', label: 'Livslogg (Barnen)', icon: <Users className="h-4 w-4" /> },
  { id: 'hamn', label: 'Trygg Hamn (BIFF)', icon: <Anchor className="h-4 w-4" /> },
  { id: 'drogfrihet', label: 'Drogfrihet & Räknare', icon: <Shield className="h-4 w-4" /> },
];

const VALID_TABS = new Set<FamiljTabId>(FAMILJ_OPTIONS.map((t) => t.id));

function resolveTab(raw: string | null): FamiljTabId {
  if (raw && VALID_TABS.has(raw as FamiljTabId)) return raw as FamiljTabId;
  return 'reflektion';
}

export function FamiljenPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const shell = useFamiljenShell();
  const activeTab = resolveTab(searchParams.get('tab'));

  const handleTabChange = (id: FamiljTabId) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.set('tab', id);
        return next;
      },
      { replace: true },
    );
  };

  if (!shell.user) {
    return <p className="text-sm text-text-muted">Logga in för att öppna Familjen.</p>;
  }

  const showChildPicker = activeTab === 'reflektion' || activeTab === 'livslogg';

  return (
    <HubPageShell
      eyebrow="ZON 3 — Familjen & Gränser"
      title="Familjehubben"
      lead="Den trygga hamnen. Här hanterar du logistik för barnen och sätter stenhårda gränser via Grey Rock."
      footerSlot={activeTab === 'reflektion' ? <ParentReminderFooter /> : undefined}
      lockViewport
    >
      <div className="mx-auto max-w-5xl space-y-4 pb-12">
        <CognitiveLoadStrip
          label="Kognitiv sköld aktiv"
          hint="Allt brus är bortfiltrerat. Välj ditt fokus i menyn nedan."
        />

        <div className="py-2">
          <HubDropdownNav<FamiljTabId>
            items={FAMILJ_OPTIONS}
            activeId={activeTab}
            onChange={handleTabChange}
            glowColor="blue"
            ariaLabel="Välj vy i Familjen"
          />
        </div>

        {showChildPicker && (
          <FamiljenChildPicker
            activeChild={shell.activeChild}
            children={shell.childAliases}
            onChange={shell.setActiveChild}
          />
        )}

        <main className="mt-2 animate-fade-in">
          {activeTab === 'reflektion' && <FamiljenReflektionTab shell={shell} />}

          {activeTab === 'livslogg' && (
            <div className="space-y-4">
              <BarnensPage embedded />
            </div>
          )}

          {activeTab === 'hamn' && (
            <div className="space-y-4">
              <SafeHarborPage />
            </div>
          )}

          {activeTab === 'drogfrihet' && (
            <div className="space-y-4">
              <DrogfrihetPage embedded />
            </div>
          )}
        </main>
      </div>
    </HubPageShell>
  );
}
