import { Navigate } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';
import { Anchor, BookHeart, Heart, HeartHandshake, Sparkles, Users } from 'lucide-react';
import { DrogfrihetHubPage } from '@/features/dailyLife/drogfrihet';

import { HubPageShell } from '../layout/HubPageShell';
import { HubDropdownNav, type DropdownItem } from '../ui/HubDropdownNav';
import { CognitiveLoadStrip } from '../ui/CognitiveLoadStrip';
import { MaterialPackShortcuts, useLifeHubPreset } from '@/core/lifeOs';
import { NAV_PATHS, vaultDrawerPath } from '../navigation/navTruth';
import { vaultRedirectSearch } from '../navigation/vaultLegacyRedirect';
import { useFamiljenShell } from '@/features/family/children/hooks/useFamiljenShell';
import { FamiljenChildPicker } from '@/features/family/children/components/familjen/FamiljenChildPicker';
import { FamiljenLivsloggTab } from '@/features/family/children/components/familjen/FamiljenLivsloggTab';
import { FamiljenReflektionTab } from '@/features/family/children/components/familjen/FamiljenReflektionTab';
import { FamiljenTillsammansTab } from '@/features/family/children/components/familjen/FamiljenTillsammansTab';
import { ParentReminderFooter } from '@/features/family/children/components/ParentReminderFooter';
import { SafeHarborPage } from '@/features/family/safeHarbor/components/SafeHarborPage';
import { BarnportenInboxPanel } from '@/features/onboarding/barnporten/components/BarnportenInboxPanel';
import { BarnportenOrkesterPanel } from '@/features/onboarding/barnporten/components/BarnportenOrkesterPanel';
import { BarnportenQrPanel } from '@/features/onboarding/barnporten/components/BarnportenQrPanel';
import { FamiljenInputSuperModule } from '@/features/family/children/supermodule/FamiljenInputSuperModule';
import {
  FAMILJEN_TAB_IDS,
  isFamiljenTabId,
  type FamiljenTabId,
} from '@/features/family/children/constants/familjenTabs';
import { HubErrorBoundary } from '@/shared/ui/HubErrorBoundary';

const FAMILJ_OPTIONS: DropdownItem<FamiljenTabId>[] = [
  { id: 'reflektion', label: 'Dagens Barnfokus', icon: <Sparkles className="h-4 w-4" /> },
  { id: 'livslogg', label: 'Livslogg', icon: <BookHeart className="h-4 w-4" /> },
  { id: 'tillsammans', label: 'Tillsammans', icon: <Users className="h-4 w-4" /> },
  { id: 'barnporten', label: 'Barnporten', icon: <Heart className="h-4 w-4" /> },
  { id: 'hamn', label: 'Trygg Hamn (BIFF)', icon: <Anchor className="h-4 w-4" /> },
  { id: 'drogfrihet', label: 'Drogfrihet', icon: <HeartHandshake className="h-4 w-4" /> },
];

const VALID_TABS = new Set<FamiljenTabId>(FAMILJEN_TAB_IDS);

function resolveTab(raw: string | null): FamiljenTabId {
  if (raw && VALID_TABS.has(raw as FamiljenTabId)) return raw as FamiljenTabId;
  return 'reflektion';
}

const LEGACY_TAB_REDIRECTS: Record<string, { pathname: string; search: string }> = {
  kunskap: { pathname: NAV_PATHS.VALVET, search: vaultRedirectSearch('kunskapsbank') },
  monster: { pathname: NAV_PATHS.VALVET, search: vaultRedirectSearch('familjen_monster') },
  analys: { pathname: NAV_PATHS.VALVET, search: vaultRedirectSearch('hamn_analys') },
};

/** smoke:orkester — vaultDrawerPath kanon (runtime via vaultRedirectSearch). */
export type FamiljenValvDrawerWiring = typeof vaultDrawerPath;

/** Zon 3 — Familjehubben: barnfokus, livslogg, tillsammans, barnporten, BIFF. */
export function FamiljenPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const shell = useFamiljenShell();
  const { preset } = useLifeHubPreset();
  const rawTab = searchParams.get('tab');
  const legacyRedirect = rawTab ? LEGACY_TAB_REDIRECTS[rawTab] : undefined;
  const activeTab = resolveTab(rawTab);

  const handleTabChange = (id: FamiljenTabId) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.set('tab', id);
        return next;
      },
      { replace: true },
    );
  };

  if (legacyRedirect) {
    return <Navigate to={legacyRedirect} replace />;
  }

  if (rawTab && !isFamiljenTabId(rawTab)) {
    return <Navigate to="/familjen?tab=reflektion" replace />;
  }

  if (!shell.user) {
    return <p className="text-sm text-text-muted">Logga in för att öppna Familjen.</p>;
  }

  const showChildPicker =
    activeTab === 'reflektion' || activeTab === 'livslogg' || activeTab === 'barnporten';

  return (
    <HubErrorBoundary
      title="Familjen kunde inte laddas"
      glow="blue"
      backTo={NAV_PATHS.HOME}
      backLabel="Till Hem"
      logTag="FamiljenPage"
    >
      <HubPageShell
        eyebrow="Familjen"
        title="Familjehubben"
        lead="Den trygga hamnen. Barnfokus, neutral livslogg och Grey Rock-gränser — ett steg i taget."
        footerSlot={
          activeTab === 'reflektion' ? (
            <ParentReminderFooter childAlias={shell.activeChild} />
          ) : undefined
        }
        lockViewport
      >
        <div className="mx-auto max-w-5xl space-y-4 pb-12">
        <CognitiveLoadStrip
          label="Kognitiv sköld aktiv"
          hint="Allt brus är bortfiltrerat. Välj ditt fokus i menyn nedan."
        />

        <div className="py-2">
          <HubDropdownNav<FamiljenTabId>
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
          {(activeTab === 'reflektion' || activeTab === 'livslogg') && (
            <div className="space-y-4">
              <FamiljenInputSuperModule shell={shell} />
              {activeTab === 'reflektion' ? (
                <FamiljenReflektionTab shell={shell} />
              ) : (
                <FamiljenLivsloggTab shell={shell} />
              )}
            </div>
          )}

          {activeTab === 'tillsammans' && <FamiljenTillsammansTab shell={shell} />}

          {activeTab === 'barnporten' && (
            <div className="space-y-4">
              <BarnportenQrPanel />
              <BarnportenInboxPanel />
              <BarnportenOrkesterPanel />
              <a href="/barnporten" className="btn-pill--ghost text-sm">
                Öppna Barnporten (barn-PWA)
              </a>
            </div>
          )}

          {activeTab === 'hamn' && <SafeHarborPage embedded />}

          {activeTab === 'drogfrihet' && <DrogfrihetHubPage embedded />}
        </main>

        <MaterialPackShortcuts preset={preset} hub="familjen" />
        </div>
      </HubPageShell>
    </HubErrorBoundary>
  );
}
