import { HOME_SUPERHUB_ROUTES } from './homeSuperhubRoutes';
import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ChevronDown, Moon, Sparkles, Sun, Sunrise } from 'lucide-react';
import { clsx } from 'clsx';
import type { ReactNode } from 'react';
import { CaptureSuperModule } from '@/modules/capture/CaptureSuperModule';
import { ParalysPanel } from '@/features/dailyLife/wellbeing/compasses/components/ParalysPanel';
import { KasamEvening } from '@/features/dailyLife/wellbeing/compasses/components/KasamEvening';
import { KompassradPanel } from '@/features/dailyLife/wellbeing/compasses/components/KompassradPanel';
import { CompassQuickWidgetRail } from '@/features/dailyLife/wellbeing/compasses/components/CompassQuickWidgetRail';
import type { CompassFlow } from '@/features/dailyLife/wellbeing/compasses/utils/compassTime';
import { useStore } from '@/core/store';
import { useTheme } from '@/core/theme';
import { isOdForgeBridgeActive } from '@/core/ui/forge';
import { saveCheckIn } from '@/core/firebase/firestore';
import { materialEnabled, type LifeHubPreset, type LifeHubPresetId } from '@/core/lifeOs/lifeHubPresets';
import {
  getHomeCompassPhase,
  phaseGlowClasses,
  phaseHeaderClasses,
  phaseLabel,
  phaseLead,
  phaseTitleClasses,
  type HomeCompassPhase,
} from './homeCompassPhase';
import { getHomeQuickNavForPreset, quickNavGridClass } from './homeQuickNav';
import { HomeSuperhubShortcuts } from './HomeSuperhubShortcuts';
import { HomeForgeKompassBridge } from './HomeForgeKompassBridge';
import { HomeKompassDiscoverySection } from './HomeKompassDiscoverySection';
import { SanningensAnkarePreview } from './SanningensAnkarePreview';
import { isLowHomeCapacity } from './homeCapacityGate';
import { AnchorVariantForge } from '@/core/ui/ankare';
import { BentoCard } from '@/shared/ui/BentoCard';
import { useEvolutionStore } from '@/core/store/useEvolutionStore';
import { useAdaptationStore } from '@/core/store/useAdaptationStore';
import { useAdaptationClickSignal } from '@/core/adaptation/useAdaptationClickSignal';
import { useCapacityScore, useListenToCapacityState } from '@/core/store/useCapacityGate';

function phaseToCompassFlow(phase: HomeCompassPhase): CompassFlow {
  if (phase === 'morgon') return 'morning';
  if (phase === 'dag') return 'day';
  return 'evening';
}

const PHASE_OPTIONS: { id: HomeCompassPhase; short: string }[] = [
  { id: 'morgon', short: 'Morgon' },
  { id: 'dag', short: 'Dag' },
  { id: 'kvall', short: 'Kväll' },
];

type Props = {
  onSaved?: () => void;
  preset: LifeHubPreset;
  presetId: LifeHubPresetId;
  /** Tvinga fas (CompassModuleStrip / widget). */
  forcedPhase?: HomeCompassPhase | null;
  /** Kognitiv sköld / orbit — renderas ovanför snabbknappar utan egen panel-ruta. */
  orbitHero?: ReactNode;
};

/** Adaptiv hemkompass — dygnsfas + LifeHub-preset (Obsidian Calm 2.0). */
export function HomeAdaptiveCompass({
  onSaved,
  preset,
  presetId,
  forcedPhase = null,
  orbitHero,
}: Props) {
  const navigate = useNavigate();
  const user = useStore((s) => s.user);
  const evolutionDoc = useEvolutionStore((s) => s.doc);
  const listenToEvolutionHub = useEvolutionStore((s) => s.listenToEvolutionHub);
  const adaptationLayerEnabled = useAdaptationStore((s) => s.layerEnabled);
  const adaptationPrefs = useAdaptationStore((s) => s.prefs);
  const fireAdaptationClick = useAdaptationClickSignal();
  const capacityScore = useCapacityScore();
  const listenToCapacityState = useListenToCapacityState();
  const { themeId } = useTheme();
  const forgeActive = isOdForgeBridgeActive(themeId);
  const [discoveryFlowActive, setDiscoveryFlowActive] = useState(false);

  const lowCapacity = isLowHomeCapacity(evolutionDoc, capacityScore, {
    layerEnabled: adaptationLayerEnabled,
    prefs: adaptationPrefs,
  });

  useEffect(() => {
    if (!user?.uid) return;
    const unsubEvolution = listenToEvolutionHub(user.uid);
    const unsubCapacity = listenToCapacityState(user.uid);
    return () => {
      unsubEvolution();
      unsubCapacity();
    };
  }, [user?.uid, listenToEvolutionHub, listenToCapacityState]);

  const [timePhase, setTimePhase] = useState<HomeCompassPhase>(() => getHomeCompassPhase());
  const [manualPhase, setManualPhase] = useState<HomeCompassPhase | null>(null);
  const activePhase = forcedPhase ?? manualPhase ?? timePhase;

  const [morningIntention, setMorningIntention] = useState('');
  const [morningGrounded, setMorningGrounded] = useState(false);
  const [morningSaving, setMorningSaving] = useState(false);
  const [morningSaved, setMorningSaved] = useState(false);
  const [morningError, setMorningError] = useState<string | null>(null);
  const [paralysKey, setParalysKey] = useState(0);
  const [inkastOpen, setInkastOpen] = useState(false);

  useEffect(() => {
    if (!inkastOpen) return;
    fireAdaptationClick('inkast_open_home', 'core');
  }, [inkastOpen, fireAdaptationClick]);
  const inkastSectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const sync = () => setTimePhase(getHomeCompassPhase());
    sync();
    const interval = setInterval(sync, 60_000);
    return () => clearInterval(interval);
  }, []);

  const showCheckIn = materialEnabled(preset, 'home_hero_checkin');
  const showInkast = materialEnabled(preset, 'home_inkast') && showCheckIn;
  const showQuickNav = materialEnabled(preset, 'home_snabbval');
  const quickNavAll = showQuickNav ? getHomeQuickNavForPreset(presetId) : [];
  const quickNav = lowCapacity ? quickNavAll.slice(0, 2) : quickNavAll;

  useEffect(() => {
    if (!showInkast) return;
    if (window.location.hash.replace(/^#/, '') !== 'inkast-lite') return;
    setInkastOpen(true);
    inkastSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [showInkast]);

  const handleMorningSave = async () => {
    if (!user || morningIntention.trim().length < 2) {
      setMorningError('Skriv minst ett par ord.');
      return;
    }
    setMorningSaving(true);
    setMorningError(null);
    try {
      await saveCheckIn(user.uid, {
        questionId: 'compass_morning',
        questionText: 'Morgon — enda prioritet',
        optionSelected: morningGrounded ? 'forge_grounded' : 'intention',
        taskCategory: 'morning',
        taskNote: morningIntention.trim(),
      });
      setMorningSaved(true);
      onSaved?.();
    } catch {
      setMorningError('Kunde inte spara. Kontrollera nätverk.');
    } finally {
      setMorningSaving(false);
    }
  };

  const resetParalys = () => {
    setParalysKey((k) => k + 1);
  };

  const quickNavGrid =
    quickNav.length > 0 ? (
      <div
        className={clsx(
          'home-adaptive-compass__quick-nav grid gap-2.5',
          quickNavGridClass(quickNav.length),
        )}
        aria-label="Snabbnavigering"
      >
        {quickNav.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => navigate(item.to)}
              className="home-adaptive-compass__quick-btn"
            >
              <Icon className="home-adaptive-compass__quick-icon" aria-hidden />
              <span className="home-adaptive-compass__quick-label">{item.label}</span>
            </button>
          );
        })}
      </div>
    ) : null;

  return (
    <div className="home-adaptive-compass animate-fade-in mx-auto flex w-full max-w-2xl flex-col gap-4">
      <HomeForgeKompassBridge />

      {forgeActive ? null : showCheckIn ? (
        <div className="home-adaptive-compass__core">
          <div className="home-adaptive-compass__advice">
            <KompassradPanel />
          </div>

          <BentoCard
            bare
            depth
            glow="gold"
            noHover
            className={clsx(
              'home-adaptive-compass__card home-adaptive-compass__card--depth flex flex-col overflow-hidden !rounded-[14px] border-[2px] border-accent/25 transition-all duration-700',
              phaseGlowClasses(activePhase),
            )}
          >
            <div
              className={clsx(
                'flex flex-col gap-3 border-b px-6 py-5 sm:flex-row sm:items-center sm:justify-between',
                phaseHeaderClasses(activePhase),
              )}
            >
              <div className="flex items-center gap-3.5">
                {activePhase === 'morgon' && <Sunrise className="h-6 w-6 text-accent-light" aria-hidden />}
                {activePhase === 'dag' && <Sun className="h-6 w-6 text-accent" aria-hidden />}
                {activePhase === 'kvall' && <Moon className="h-6 w-6 text-accent" aria-hidden />}
                <div>
                  <h2
                    className={clsx(
                      'font-display-serif text-sm uppercase tracking-[0.2em]',
                      phaseTitleClasses(activePhase),
                    )}
                  >
                    {phaseLabel(activePhase)}
                  </h2>
                  <p className="mt-1 text-[11px] text-text-muted">{phaseLead(activePhase)}</p>
                </div>
              </div>

              {!forcedPhase ? (
                <div
                  className="home-adaptive-compass__tabs"
                  role="tablist"
                  aria-label="Välj kompass"
                >
                  {PHASE_OPTIONS.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      role="tab"
                      aria-selected={activePhase === opt.id}
                      onClick={() => setManualPhase(opt.id)}
                      className={clsx(
                        'home-adaptive-compass__tab',
                        activePhase === opt.id && 'home-adaptive-compass__tab--active',
                      )}
                    >
                      {opt.short}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>

            {!discoveryFlowActive && !forcedPhase ? (
              <CompassQuickWidgetRail
                flow={phaseToCompassFlow(activePhase)}
                className="compass-quick-widget-rail--in-module border-b border-border/20 px-4 pb-3 pt-2"
              />
            ) : null}

            {!discoveryFlowActive ? (
              <div className="flex min-h-[140px] flex-col justify-center p-6">
              {activePhase === 'morgon' && (
                <div className="animate-fade-in space-y-4">
                  <AnchorVariantForge
                    focus="Vad är din enda prioritet idag?"
                    quote="Inte hela dagen — bara det viktigaste nu."
                    intention={morningIntention}
                    onIntentionChange={setMorningIntention}
                    onGroundingChange={setMorningGrounded}
                    onSave={() => void handleMorningSave()}
                    saving={morningSaving}
                    saved={morningSaved}
                    error={morningError}
                    disabled={!user}
                  />
                  <SanningensAnkarePreview />
                </div>
              )}

              {activePhase === 'dag' && (
                <div className="animate-fade-in">
                  <ParalysPanel
                    key={paralysKey}
                    embedded
                    simplified={lowCapacity}
                    onDone={resetParalys}
                  />
                </div>
              )}

              {activePhase === 'kvall' && (
                <div className="animate-fade-in space-y-3">
                  <SanningensAnkarePreview />
                  {user ? (
                    <KasamEvening
                      userId={user.uid}
                      embedded
                      onSaved={onSaved}
                      onKlar={() => undefined}
                    />
                  ) : (
                    <>
                      <p className="mx-auto max-w-sm text-center text-xs leading-relaxed text-text-muted">
                        {showInkast
                          ? 'Skriv av dig dagens brus i Inkastet nedan. Lämna allt som inte är ditt ansvar.'
                          : 'Landning i kväll — en kort rad i Dagbok räcker om du vill.'}
                      </p>
                      {!showInkast ? (
                        <button
                          type="button"
                          onClick={() => navigate(HOME_SUPERHUB_ROUTES.hjartatQuickMirror)}
                          className="btn-pill--ghost mx-auto block text-xs"
                        >
                          Öppna Dagbok
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => navigate(HOME_SUPERHUB_ROUTES.hjartatReflektion)}
                          className="btn-pill--ghost mx-auto block text-xs"
                        >
                          Öppna full reflektion i Hjärtat
                        </button>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
            ) : null}

            <HomeKompassDiscoverySection
              userId={user?.uid}
              onFlowActiveChange={setDiscoveryFlowActive}
            />

            {showInkast && !discoveryFlowActive ? (
              <section
                id="inkast-lite"
                ref={inkastSectionRef}
                className={clsx(
                  'home-adaptive-compass__inkast flex flex-col gap-3 scroll-mt-28',
                  inkastOpen && 'home-adaptive-compass__inkast--open',
                )}
              >
                <div className="home-adaptive-compass__inkast-head flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-3.5 w-3.5 text-accent" aria-hidden />
                    <span className="font-display-serif text-[10px] font-semibold uppercase tracking-[0.2em] text-text-dim">
                      Smart Inkast
                    </span>
                  </div>
                  <Link
                    to={HOME_SUPERHUB_ROUTES.hjartatReflektion}
                    className="text-[10px] uppercase tracking-wider text-accent/80 hover:text-accent"
                  >
                    Öppna full reflektion i Hjärtat
                  </Link>
                </div>
                <button
                  type="button"
                  className="home-adaptive-compass__inkast-toggle"
                  aria-expanded={inkastOpen}
                  onClick={() => setInkastOpen((open) => !open)}
                >
                  <span>{inkastOpen ? 'Stäng Inkast' : 'Skriv av dig — öppna Inkast'}</span>
                  <ChevronDown
                    className={clsx(
                      'home-adaptive-compass__inkast-chevron',
                      inkastOpen && 'home-adaptive-compass__inkast-chevron--open',
                    )}
                    strokeWidth={1.75}
                    aria-hidden
                  />
                </button>
                {inkastOpen ? <CaptureSuperModule variant="kompass" onSaved={onSaved} /> : null}
              </section>
            ) : null}
          </BentoCard>
        </div>
      ) : forgeActive ? null : (
        <p className="text-center text-xs text-text-dim">
          Hemprofil «{preset.label}» — check-in via{' '}
          <button
            type="button"
            className="text-accent underline-offset-2 hover:underline"
            onClick={() => navigate('/vardagen?tab=kompasser')}
          >
            Kompasser
          </button>
          .
        </p>
      )}

      {orbitHero ? (
        <div className="home-adaptive-compass__orbit -mt-1 flex justify-center">{orbitHero}</div>
      ) : null}

      {quickNavGrid}

      <HomeSuperhubShortcuts presetId={presetId} />
    </div>
  );
}
