import { Navigate } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';
import { clsx } from 'clsx';
import { Anchor, BookHeart, Heart, HeartHandshake, Sparkles, Users } from 'lucide-react';
import { DrogfrihetHubPage } from '@/features/dailyLife/drogfrihet';

import { ModuleShell } from '../layout/ModuleShell';
import { HubDropdownNav, type DropdownItem } from '../ui/HubDropdownNav';
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
import { BentoCard } from '@/shared/ui/BentoCard';
import { FamiljenBentoShell } from '@/features/family/children/components/familjen/FamiljenBentoShell';
import { useMinWidthSm } from '../hooks/useMinWidthSm';

const FAMILJ_OPTIONS: DropdownItem<FamiljenTabId>[] = [
  { id: 'reflektion', label: 'Dagens Barnfokus', icon: <Sparkles className="h-4 w-4" /> },
  { id: 'livslogg', label: 'Livslogg', icon: <BookHeart className="h-4 w-4" /> },
  { id: 'tillsammans', label: 'Tillsammans', icon: <Users className="h-4 w-4" /> },
  { id: 'barnporten', label: 'Barnporten', icon: <Heart className="h-4 w-4" /> },
  { id: 'hamn', label: 'Trygg Hamn (BIFF)', icon: <Anchor className="h-4 w-4" /> },
  { id: 'drogfrihet', label: 'Drogfrihet', icon: <HeartHandshake className="h-4 w-4" /> },
];

const VALID_TABS = new Set<FamiljenTabId>(FAMILJEN_TAB_IDS);

/** F3 — Barnfokus/Livslogg: supermodule-picker räcker; full HubDropdownNav på övriga flikar. */
const FAMILJEN_INPUT_HUB_TABS: FamiljenTabId[] = ['reflektion', 'livslogg'];

function FamiljenHubToolbar({
  activeTab,
  onTabChange,
}: {
  activeTab: FamiljenTabId;
  onTabChange: (id: FamiljenTabId) => void;
}) {
  if (!FAMILJEN_INPUT_HUB_TABS.includes(activeTab)) {
    return (
      <HubDropdownNav<FamiljenTabId>
        items={FAMILJ_OPTIONS}
        activeId={activeTab}
        onChange={onTabChange}
        glowColor="blue"
        ariaLabel="Välj vy i Familjen"
      />
    );
  }

  return (
    <nav
      aria-label="Fler vyer i Familjen"
      className="flex flex-wrap items-center gap-1.5 sm:gap-2"
    >
      {FAMILJ_OPTIONS.filter((item) => item.id !== activeTab).map((item) => (
        <button
          key={item.id}
          type="button"
          className="btn-pill--ghost inline-flex items-center gap-1.5 text-xs uppercase tracking-wider text-text-muted hover:text-text"
          onClick={() => onTabChange(item.id)}
        >
          {item.icon}
          {item.label}
        </button>
      ))}
    </nav>
  );
}

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
  const desktopHubLock = useMinWidthSm();
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
      <ModuleShell
        eyebrow="Familjen"
        title="Familjehubben"
        lead="Den trygga hamnen. Barnfokus, neutral livslogg och Grey Rock-gränser — ett steg i taget."
        footerSlot={
          activeTab === 'reflektion' ? (
            <ParentReminderFooter childAlias={shell.activeChild} />
          ) : undefined
        }
        lockViewport={desktopHubLock}
        fitViewport={desktopHubLock}
        depth
        cognitiveStrip={{
          label: 'Kognitiv sköld aktiv',
          hint: 'Allt brus är bortfiltrerat. Välj ditt fokus i menyn nedan.',
        }}
        toolbar={<FamiljenHubToolbar activeTab={activeTab} onTabChange={handleTabChange} />}
      >
        <FamiljenBentoShell className={clsx(!desktopHubLock && 'pb-2')}>
          {showChildPicker && (
            <BentoCard glow="blue" noHover className="!p-3">
              <FamiljenChildPicker
                activeChild={shell.activeChild}
                children={shell.childAliases}
                onChange={shell.setActiveChild}
              />
            </BentoCard>
          )}

          {(activeTab === 'reflektion' || activeTab === 'livslogg') && (
            <>
              <FamiljenInputSuperModule shell={shell} flowWithIsland={desktopHubLock} />
              <BentoCard
                glow="blue"
                bare
                noHover
                className="familjen-tab-panel !p-4 sm:!p-5"
              >
                {activeTab === 'reflektion' ? (
                  <FamiljenReflektionTab shell={shell} />
                ) : (
                  <FamiljenLivsloggTab shell={shell} />
                )}
              </BentoCard>
            </>
          )}

          {activeTab === 'tillsammans' && (
            <BentoCard glow="blue" bare noHover className="familjen-tab-panel !p-4 sm:!p-5">
              <FamiljenTillsammansTab shell={shell} />
            </BentoCard>
          )}

          {activeTab === 'barnporten' && (
            <BentoCard glow="blue" bare noHover className="familjen-tab-panel space-y-4 !p-4 sm:!p-5">
              <BarnportenQrPanel />
              <BarnportenInboxPanel />
              <BarnportenOrkesterPanel />
              <a href="/barnporten" className="btn-pill--ghost text-sm">
                Öppna Barnporten (barn-PWA)
              </a>
            </BentoCard>
          )}

          {activeTab === 'hamn' && (
            <BentoCard glow="indigo" bare noHover className="familjen-tab-panel !p-4 sm:!p-5">
              <SafeHarborPage embedded />
            </BentoCard>
          )}

          {activeTab === 'drogfrihet' && (
            <BentoCard glow="green" bare noHover className="familjen-tab-panel !p-4 sm:!p-5">
              <DrogfrihetHubPage embedded />
            </BentoCard>
          )}

          <MaterialPackShortcuts preset={preset} hub="familjen" />
        </FamiljenBentoShell>
      </ModuleShell>
    </HubErrorBoundary>
  );
}
