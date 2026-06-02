import { useSearchParams } from 'react-router-dom';
import { Sprout, Wallet, Clock } from 'lucide-react';
import { useStore } from '../store';

// Layout & UI
import { HubPageShell } from '../layout/HubPageShell';
import { HubDropdownNav, type DropdownItem } from '../ui/HubDropdownNav';
import { CognitiveLoadStrip } from '../ui/CognitiveLoadStrip';

// Innehållskomponenter
import { DashboardPage as CompassDashboard } from '@/features/dailyLife/wellbeing/compasses/components/DashboardPage';
import { EconomyOverviewPanel } from '@/features/dailyLife/wellbeing/economy/components/EconomyOverviewPanel';
import { TimeSheetPanel } from '@/features/dailyLife/wellbeing/economy/components/TimeSheetPanel';

type VardagTabId = 'kompasser' | 'ekonomi' | 'tidrapportering';

const VARDAG_OPTIONS: DropdownItem<VardagTabId>[] = [
  { id: 'kompasser', label: 'Dygns-Kompassen', icon: <Sprout className="h-4 w-4" /> },
  { id: 'ekonomi', label: 'Ekonomi & Mål', icon: <Wallet className="h-4 w-4" /> },
  { id: 'tidrapportering', label: 'Tid & Stämpel', icon: <Clock className="h-4 w-4" /> },
];

const VALID_TABS = new Set<VardagTabId>(VARDAG_OPTIONS.map((t) => t.id));

function resolveTab(raw: string | null, fallback?: VardagTabId): VardagTabId {
  if (raw && VALID_TABS.has(raw as VardagTabId)) return raw as VardagTabId;
  return fallback ?? 'kompasser';
}

type Props = {
  initialTab?: VardagTabId;
};

export function VardagenPage({ initialTab }: Props) {
  const [searchParams, setSearchParams] = useSearchParams();
  const user = useStore((s) => s.user);

  const activeTab = resolveTab(searchParams.get('tab'), initialTab);

  const handleTabChange = (id: VardagTabId) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.set('tab', id);
        return next;
      },
      { replace: true },
    );
  };

  return (
    <HubPageShell
      eyebrow="ZON 2 — Vardag & Återhämtning"
      title="Vardagshubben"
      lead="Dina dagliga rutiner, exekutiva mikrosteg och ekonomiska logistik samlat i en trygg vy."
    >
      <div className="mx-auto max-w-5xl space-y-4 pb-12">
        <CognitiveLoadStrip
          label="Ett steg i taget"
          hint="Välj ditt fokusområde i menyn nedan. Resten av systemet vilar."
        />

        <div className="py-2">
          <HubDropdownNav<VardagTabId>
            items={VARDAG_OPTIONS}
            activeId={activeTab}
            onChange={handleTabChange}
            glowColor="gold"
            ariaLabel="Välj vy i Vardagen"
          />
        </div>

        <main className="mt-2 animate-fade-in">
          {activeTab === 'kompasser' && (
            <div className="space-y-4">
              <CompassDashboard />
            </div>
          )}

          {activeTab === 'ekonomi' && (
            <div className="space-y-4">
              <EconomyOverviewPanel userId={user?.uid ?? ''} />
            </div>
          )}

          {activeTab === 'tidrapportering' && (
            <div className="space-y-4">
              <div className="rounded-3xl border border-border/30 bg-surface-2/70 p-5 shadow-lg backdrop-blur-xl glow-bottom-gold">
                <h3 className="text-sm font-semibold text-accent">Tid & Stämpel</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-text-muted">
                  Här hanterar du din arbetstid, flextimmar och överlämningar.
                </p>
                {user?.uid && <TimeSheetPanel userId={user.uid} />}
              </div>
            </div>
          )}
        </main>
      </div>
    </HubPageShell>
  );
}
