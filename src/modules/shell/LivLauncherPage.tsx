import { useEffect } from 'react';
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Briefcase,
  Clock,
  FolderKanban,
  ListTodo,
  Sparkles,
  Sprout,
  Wallet,
} from 'lucide-react';
import { useStore } from '@/core/store';
import { HubPageShell } from '@/core/layout/HubPageShell';
import { HubDropdownNav, type DropdownItem } from '@/core/ui/HubDropdownNav';
import { CognitiveLoadStrip } from '@/core/ui/CognitiveLoadStrip';
import { DashboardPage as CompassDashboard } from '@/features/dailyLife/wellbeing/compasses/components/DashboardPage';
import { EconomyOverviewPanel } from '@/features/dailyLife/wellbeing/economy/components/EconomyOverviewPanel';
import {
  LIV_LAUNCHER_EXTERNAL,
  LIV_LAUNCHER_INLINE_TABS,
  resolveLivLegacyTabRedirect,
} from './livLauncherRoutes';

type LivInlineTab = 'kompasser' | 'ekonomi';
type LivLauncherId = LivInlineTab | keyof typeof LIV_LAUNCHER_EXTERNAL;

const LAUNCHER_OPTIONS: DropdownItem<LivLauncherId>[] = [
  { id: 'kompasser', label: 'Dygns-Kompassen', icon: <Sprout className="h-4 w-4" /> },
  { id: 'ekonomi', label: 'Ekonomi & Mål', icon: <Wallet className="h-4 w-4" /> },
  { id: 'mabra', label: 'MåBra', icon: <Sparkles className="h-4 w-4" /> },
  { id: 'handling', label: 'Handling (Kanban)', icon: <ListTodo className="h-4 w-4" /> },
  { id: 'projekt', label: 'Projekt', icon: <FolderKanban className="h-4 w-4" /> },
  { id: 'arbetsliv', label: 'Arbetsliv & stämpel', icon: <Clock className="h-4 w-4" /> },
];

function resolveInlineTab(raw: string | null): LivInlineTab {
  if (raw === 'ekonomi') return 'ekonomi';
  return 'kompasser';
}

/**
 * Liv och göra — launcher-hub.
 * En dropdown; kompass/ekonomi inline, övrigt navigerar till egen fullsid-route.
 */
export function LivLauncherPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const user = useStore((s) => s.user);
  const rawTab = searchParams.get('tab');
  const legacyTarget = resolveLivLegacyTabRedirect(rawTab);

  useEffect(() => {
    if (!legacyTarget) return;
    navigate(legacyTarget, { replace: true });
  }, [legacyTarget, navigate]);

  if (legacyTarget) {
    return <Navigate to={legacyTarget} replace />;
  }

  const activeTab = resolveInlineTab(rawTab);

  const handleChange = (id: LivLauncherId) => {
    const external = LIV_LAUNCHER_EXTERNAL[id];
    if (external) {
      navigate(external);
      return;
    }
    if (LIV_LAUNCHER_INLINE_TABS.has(id)) {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (id === 'kompasser') next.delete('tab');
          else next.set('tab', id);
          return next;
        },
        { replace: true },
      );
    }
  };

  return (
    <HubPageShell
      eyebrow="ZON 2 — Liv och göra"
      title="Vardagsstart"
      lead="Välj vad du ska fokusera på. MåBra, planering och arbete öppnas på egna sidor — utan flikar i flikar."
    >
      <div className="mx-auto max-w-5xl space-y-4 pb-12">
        <CognitiveLoadStrip
          label="Ett steg i taget"
          hint="Kompass och ekonomi visas här. Övriga val tar dig till rätt verktyg direkt."
        />

        <div className="py-2">
          <HubDropdownNav<LivLauncherId>
            items={LAUNCHER_OPTIONS}
            activeId={activeTab}
            onChange={handleChange}
            glowColor="gold"
            ariaLabel="Välj fokus i Liv och göra"
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
        </main>

        <p className="text-center text-[11px] text-text-dim">
          <Briefcase className="mr-1 inline h-3 w-3 opacity-60" aria-hidden />
          MåBra · Handling · Projekt · Arbetsliv — egna sidor, en menynivå vardera.
        </p>
      </div>
    </HubPageShell>
  );
}
