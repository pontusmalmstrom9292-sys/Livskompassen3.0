import { Navigate } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';
import { clsx } from 'clsx';
import { Anchor, BookHeart, Heart, HeartHandshake, Sparkles, Users } from 'lucide-react';

import { ModuleShell } from '../layout/ModuleShell';
import { HubDropdownNav, type DropdownItem } from '../ui/HubDropdownNav';
import { MaterialPackShortcuts, useLifeHubPreset } from '@/core/lifeOs';
import { ModuleHelpFromRegistry } from '@/core/help/ModuleHelpFromRegistry';
import { NAV_PATHS, vaultDrawerPath } from '../navigation/navTruth';
import { vaultRedirectSearch } from '../navigation/vaultLegacyRedirect';
import { lazy, Suspense } from 'react';
import { useFamiljenShell } from '@/features/family/children/hooks/useFamiljenShell';
import { FamiljenChildPicker } from '@/features/family/children/components/familjen/FamiljenChildPicker';

const FamiljenLivsloggTab = lazy(() => import('@/features/family/children/components/familjen/FamiljenLivsloggTab').then(m => ({ default: m.FamiljenLivsloggTab })));
const FamiljenReflektionTab = lazy(() => import('@/features/family/children/components/familjen/FamiljenReflektionTab').then(m => ({ default: m.FamiljenReflektionTab })));
const FamiljenTillsammansTab = lazy(() => import('@/features/family/children/components/familjen/FamiljenTillsammansTab').then(m => ({ default: m.FamiljenTillsammansTab })));
const SafeHarborPage = lazy(() => import('@/features/family/safeHarbor/components/SafeHarborPage').then(m => ({ default: m.SafeHarborPage })));
const BarnportenParentHubPanel = lazy(() => import('@/features/onboarding/barnporten/components/BarnportenParentHubPanel').then(m => ({ default: m.BarnportenParentHubPanel })));
const FamiljenInputSuperModule = lazy(() => import('@/features/family/children/supermodule/FamiljenInputSuperModule').then(m => ({ default: m.FamiljenInputSuperModule })));
const DrogfrihetHubPage = lazy(() => import('@/features/dailyLife/drogfrihet').then(m => ({ default: m.DrogfrihetHubPage })));
import {
  FAMILJEN_TAB_IDS,
  isFamiljenTabId,
  type FamiljenTabId,
} from '@/features/family/children/constants/familjenTabs';
import { isBarnportenChildPwaRolloutEnabled } from '@/features/onboarding/barnporten/constants/barnportenRollout';
import { EmptyState } from '@/core/ui/EmptyState';
import { HubErrorBoundary } from '@/shared/ui/HubErrorBoundary';
import { BentoCard } from '@/shared/ui/BentoCard';
import { FamiljenBentoShell } from '@/features/family/children/components/familjen/FamiljenBentoShell';
import { ParentReminderFooter } from '@/features/family/children/components/ParentReminderFooter';
import { useMinWidthSm } from '../hooks/useMinWidthSm';

const FAMILJ_OPTIONS: DropdownItem<FamiljenTabId>[] = [
  { id: 'reflektion', label: 'Dagens Barnfokus', icon: <Sparkles className="h-4 w-4" /> },
  { id: 'livslogg', label: 'Livslogg', icon: <BookHeart className="h-4 w-4" /> },
  { id: 'tillsammans', label: 'Tillsammans', icon: <Users className="h-4 w-4" /> },
  ...(isBarnportenChildPwaRolloutEnabled()
    ? [{ id: 'barnporten' as const, label: 'Barnporten', icon: <Heart className="h-4 w-4" /> }]
    : []),
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

  if (rawTab === 'barnporten' && !isBarnportenChildPwaRolloutEnabled()) {
    return <Navigate to="/familjen?tab=reflektion" replace />;
  }

  if (!shell.user) {
    return (
      <EmptyState message="Logga in för att öppna Familjen." />
    );
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
        title=""
        lead="Relationell närvaro."
        headerAside={<ModuleHelpFromRegistry moduleId="hub_familjen" preset={preset} />}
        lockViewport={desktopHubLock}
        fitViewport={desktopHubLock}
        toolbar={
          <FamiljenHubToolbar activeTab={activeTab} onTabChange={handleTabChange} />
        }
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

          <Suspense fallback={<div className="p-4 text-center text-sm text-text-muted">Laddar Familjen-verktyg...</div>}>
            {(activeTab === 'reflektion' || activeTab === 'livslogg') && (
              <>
                <div className="pt-4 pb-2">
                  <FamiljenInputSuperModule shell={shell} flowWithIsland={desktopHubLock} />
                </div>
                <div className="familjen-tab-panel">
                  {activeTab === 'reflektion' ? (
                    <FamiljenReflektionTab shell={shell} />
                  ) : (
                    <FamiljenLivsloggTab shell={shell} />
                  )}
                </div>
              </>
            )}

            {activeTab === 'tillsammans' && (
              <BentoCard glow="blue" bare noHover className="familjen-tab-panel !p-4 sm:!p-5">
                <FamiljenTillsammansTab shell={shell} />
              </BentoCard>
            )}

            {activeTab === 'barnporten' && (
              <BentoCard glow="blue" bare noHover className="familjen-tab-panel !p-4 sm:!p-5">
                <BarnportenParentHubPanel activeChild={shell.activeChild} />
              </BentoCard>
            )}

            {activeTab === 'hamn' && (
              <BentoCard glow="blue" bare noHover className="familjen-tab-panel !p-4 sm:!p-5">
                <SafeHarborPage embedded />
              </BentoCard>
            )}

            {activeTab === 'drogfrihet' && (
              <BentoCard glow="green" bare noHover className="familjen-tab-panel !p-4 sm:!p-5">
                <DrogfrihetHubPage embedded />
              </BentoCard>
            )}
          </Suspense>

          {(activeTab === 'reflektion' || activeTab === 'livslogg') && (
            <ParentReminderFooter childAlias={shell.activeChild} />
          )}

          <MaterialPackShortcuts preset={preset} hub="familjen" />
        </FamiljenBentoShell>
      </ModuleShell>
    </HubErrorBoundary>
  );
}
