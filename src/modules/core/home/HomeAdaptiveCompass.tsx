import { NAV_PATHS } from '@/core/navigation/navTruth';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, Moon, Sparkles, Sun, Sunrise } from 'lucide-react';
import { clsx } from 'clsx';
import type { ReactNode } from 'react';
import { CaptureSuperModule } from '@/modules/capture/CaptureSuperModule';
import { ParalysPanel } from '@/features/dailyLife/wellbeing/compasses/components/ParalysPanel';
import { KasamEvening } from '@/features/dailyLife/wellbeing/compasses/components/KasamEvening';
import { KompassradPanel } from '@/features/dailyLife/wellbeing/compasses/components/KompassradPanel';
import { useStore } from '@/core/store';
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

  const [timePhase, setTimePhase] = useState<HomeCompassPhase>(() => getHomeCompassPhase());
  const [manualPhase, setManualPhase] = useState<HomeCompassPhase | null>(null);
  const activePhase = forcedPhase ?? manualPhase ?? timePhase;

  const [morningIntention, setMorningIntention] = useState('');
  const [morningSaving, setMorningSaving] = useState(false);
  const [morningSaved, setMorningSaved] = useState(false);
  const [morningError, setMorningError] = useState<string | null>(null);
  const [paralysKey, setParalysKey] = useState(0);
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
  const quickNav = showQuickNav ? getHomeQuickNavForPreset(presetId) : [];

  useEffect(() => {
    if (!showInkast) return;
    if (window.location.hash.replace(/^#/, '') !== 'inkast-lite') return;
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
        optionSelected: 'intention',
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
      {orbitHero ? (
        <div className="home-adaptive-compass__orbit -mt-1 flex justify-center">{orbitHero}</div>
      ) : null}

      {showCheckIn ? (
        <div className="home-adaptive-compass__core">
          <div className="home-adaptive-compass__advice">
            <KompassradPanel />
          </div>

          <div
            className={clsx(
              'home-adaptive-compass__card calm-card glow-bottom-gold flex flex-col overflow-hidden rounded-2xl border border-border/30 bg-surface-2/70 backdrop-blur-xl transition-all duration-700',
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
                {activePhase === 'morgon' && <Sunrise className="h-6 w-6 text-amber-400" aria-hidden />}
                {activePhase === 'dag' && <Sun className="h-6 w-6 text-accent" aria-hidden />}
                {activePhase === 'kvall' && <Moon className="h-6 w-6 text-indigo-400" aria-hidden />}
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

            <div className="flex min-h-[140px] flex-col justify-center p-6">
              {activePhase === 'morgon' && (
                <div className="animate-fade-in space-y-3">
                  {morningSaved ? (
                    <p className="text-center text-xs text-success">Morgonankare sparat.</p>
                  ) : (
                    <>
                      <p className="mx-auto max-w-sm text-center text-xs leading-relaxed text-text-muted">
                        Allt yttre brus stannar utanför. Vad är din enda riktiga prioritet idag?
                      </p>
                      <input
                        type="text"
                        value={morningIntention}
                        onChange={(e) => setMorningIntention(e.target.value)}
                        placeholder="T.ex. hämta barnen i lugn takt"
                        className="input-glass w-full text-sm"
                      />
                      {morningError ? (
                        <p className="text-center text-xs text-danger">{morningError}</p>
                      ) : null}
                      <button
                        type="button"
                        onClick={() => void handleMorningSave()}
                        disabled={morningSaving || !user}
                        className="btn-pill--accent w-full text-xs disabled:opacity-40"
                      >
                        {morningSaving ? (
                          <Loader2 className="mx-auto h-4 w-4 animate-spin" />
                        ) : (
                          'Spara morgonankare'
                        )}
                      </button>
                    </>
                  )}
                </div>
              )}

              {activePhase === 'dag' && (
                <div className="animate-fade-in">
                  <ParalysPanel key={paralysKey} embedded onDone={resetParalys} />
                </div>
              )}

              {activePhase === 'kvall' && (
                <div className="animate-fade-in space-y-3">
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
                          onClick={() => navigate(NAV_PATHS.HJARTAT)}
                          className="btn-pill--ghost mx-auto block text-xs"
                        >
                          Öppna Dagbok
                        </button>
                      ) : null}
                    </>
                  )}
                </div>
              )}
            </div>

            {showInkast ? (
              <section
                id="inkast-lite"
                ref={inkastSectionRef}
                className="home-adaptive-compass__inkast flex flex-col gap-3 scroll-mt-28"
              >
                <div className="home-adaptive-compass__inkast-head">
                  <Sparkles className="h-3.5 w-3.5 text-accent" aria-hidden />
                  <span className="font-display-serif text-[10px] font-semibold uppercase tracking-[0.2em] text-text-dim">
                    Smart Inkast
                  </span>
                </div>
                <CaptureSuperModule variant="kompass" onSaved={onSaved} />
              </section>
            ) : null}
          </div>
        </div>
      ) : (
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

      {quickNavGrid}
    </div>
  );
}
