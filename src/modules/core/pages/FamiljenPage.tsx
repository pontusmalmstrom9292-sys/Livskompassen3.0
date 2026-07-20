/** @locked MOD-FAM-HUB — låst modul; unlock via docs/evaluations/*-unlock-MOD-FAM-HUB.md */
import { Navigate } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';
import { Button } from '@/design-system';
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
import { FamiljenZoneIntro } from '@/features/family/children/components/familjen/FamiljenZoneIntro';
import { ParentReminderFooter } from '@/features/family/children/components/ParentReminderFooter';
import type { FamiljenInputMode } from '@/features/family/children/supermodule/familjenInputModes';

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

type FamiljenTabPolish = {
  eyebrow: string;
  lead: string;
};

const FAMILJEN_TAB_POLISH: Partial<Record<FamiljenTabId, FamiljenTabPolish>> = {
  reflektion: {
    eyebrow: 'Barnfokus',
    lead: 'Ett tryggt mikrosteg i taget. Fråga, lyssna, logga — utan att översvämma vardagen.',
  },
  livslogg: {
    eyebrow: 'Livslogg',
    lead: 'Samla stunder, mönster och signaler med tydlig barnsilo och lugn dokumentation.',
  },
  barnporten: {
    eyebrow: 'Barnporten',
    lead: 'Barnens kanal hålls separat. Granskning sker i föräldraflödet innan något lyfts vidare.',
  },
  hamn: {
    eyebrow: 'Trygg Hamn',
    lead: 'BIFF och Grey Rock för svåra meddelanden. Inget skickas automatiskt och panelen rensas vid avslut.',
  },
};

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
        <Button
          key={item.id}
          type="button"
          variant="ghost"
          className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider text-text-muted hover:text-text"
          onClick={() => onTabChange(item.id)}
        >
          {item.icon}
          {item.label}
        </Button>
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
  /** Hem/legacy — Barnfokus är Superhub-läge, inte egen toppflik */
  barnfokus: {
    pathname: NAV_PATHS.FAMILJEN,
    search: '?tab=reflektion&inputMode=barnfokus',
  },
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
  const tabPolish = FAMILJEN_TAB_POLISH[activeTab];
  const initialInputMode: FamiljenInputMode | undefined =
    activeTab === 'livslogg' ? 'livslogg_stund' : undefined;

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
        lead="Barnfokus, logg och trygg hamn — ett steg i taget."
        headerAside={<ModuleHelpFromRegistry moduleId="hub_familjen" preset={preset} />}
        lockViewport
        fitViewport
        className="familjen-route-page"
        toolbar={
          <FamiljenHubToolbar activeTab={activeTab} onTabChange={handleTabChange} />
        }
      >
        <div className="familjen-page">
          <FamiljenBentoShell>
            <div className="familjen-page__header space-y-4">
              <FamiljenZoneIntro activeTab={activeTab} />
              {showChildPicker && (
                <BentoCard glow="blue" noHover className="familjen-page__card !p-3">
                  <FamiljenChildPicker
                    activeChild={shell.activeChild}
                    children={shell.childAliases}
                    onChange={shell.setActiveChild}
                  />
                </BentoCard>
              )}

              {tabPolish && (
                <BentoCard glow="blue" noHover className="familjen-page__card !p-3 sm:!p-4">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-accent-secondary/80">
                    {tabPolish.eyebrow}
                  </p>
                  <p className="mt-1 text-xs text-text-dim">{tabPolish.lead}</p>
                </BentoCard>
              )}
            </div>

            <Suspense fallback={<div className="p-4 text-center text-sm text-text-muted">Laddar Familjen-verktyg...</div>}>
              {(activeTab === 'reflektion' || activeTab === 'livslogg') && (
                <>
                  <div className="pt-4 pb-2">
                    <FamiljenInputSuperModule
                      shell={shell}
                      flowWithIsland
                      initialMode={initialInputMode}
                    />
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
        </div>
      </ModuleShell>
    </HubErrorBoundary>
  );
}
