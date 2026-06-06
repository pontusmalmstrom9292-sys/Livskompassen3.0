import { NAV_PATHS } from '@/core/navigation/navTruth';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, Moon, Sparkles, Sun, Sunrise, Brain, CheckCircle2 } from 'lucide-react';
import { clsx } from 'clsx';
import type { ReactNode } from 'react';
import { CaptureSuperModule } from '@/modules/capture/CaptureSuperModule';
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

type Props = {
  onSaved?: () => void;
  preset: LifeHubPreset;
  presetId: LifeHubPresetId;
  /** Kognitiv sköld / orbit — renderas ovanför snabbknappar utan egen panel-ruta. */
  orbitHero?: ReactNode;
};

/** Adaptiv hemkompass — dygnsfas + LifeHub-preset (Obsidian Calm 2.0). */
export function HomeAdaptiveCompass({ onSaved, preset, presetId, orbitHero }: Props) {
  const navigate = useNavigate();
  const user = useStore((s) => s.user);

  const [timePhase, setTimePhase] = useState<HomeCompassPhase>(() => getHomeCompassPhase());
  const [morningIntention, setMorningIntention] = useState('');
  const [morningSaving, setMorningSaving] = useState(false);
  const [morningSaved, setMorningSaved] = useState(false);
  const [morningError, setMorningError] = useState<string | null>(null);

  useEffect(() => {
    const sync = () => setTimePhase(getHomeCompassPhase());
    sync();
    const interval = setInterval(sync, 60_000);
    return () => clearInterval(interval);
  }, []);

  const [paralysisTask, setParalysisTask] = useState('');
  const [microStep, setMicroStep] = useState<string | null>(null);

  const showCheckIn = materialEnabled(preset, 'home_hero_checkin');
  const showInkast = materialEnabled(preset, 'home_inkast') && showCheckIn;
  const quickNav = getHomeQuickNavForPreset(presetId);

  const handleParalysisBreakdown = () => {
    if (!paralysisTask.trim()) return;
    setMicroStep(
      'Gör bara detta: Öppna det du behöver och titta på det i 1 minut. Stäng sedan om det är för tungt.',
    );
  };

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

  return (
    <div className="animate-fade-in mx-auto flex w-full max-w-2xl flex-col gap-5">
      {orbitHero ? (
        <div className="home-adaptive-compass__orbit -mt-1 flex justify-center">{orbitHero}</div>
      ) : null}

      {quickNav.length > 0 ? (
        <div className={clsx('grid gap-3', quickNavGridClass(quickNav.length))}>
          {quickNav.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => navigate(item.to)}
                className="flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-2xl border border-border/30 bg-surface-2/60 p-3.5 shadow-sm backdrop-blur-md transition-all hover:bg-surface-3"
              >
                <Icon className="h-4 w-4 text-accent" aria-hidden />
                <span className="text-[10px] font-medium text-text-muted">{item.label}</span>
              </button>
            );
          })}
        </div>
      ) : null}

      {showCheckIn ? (
        <div
          className={clsx(
            'calm-card flex flex-col overflow-hidden rounded-2xl border border-border/30 bg-surface-2/70 backdrop-blur-xl transition-all duration-700',
            phaseGlowClasses(timePhase),
          )}
        >
          <div
            className={clsx(
              'flex items-center justify-between border-b px-6 py-5',
              phaseHeaderClasses(timePhase),
            )}
          >
            <div className="flex items-center gap-3.5">
              {timePhase === 'morgon' && <Sunrise className="h-6 w-6 text-amber-400" aria-hidden />}
              {timePhase === 'dag' && <Sun className="h-6 w-6 text-accent" aria-hidden />}
              {timePhase === 'kvall' && <Moon className="h-6 w-6 text-indigo-400" aria-hidden />}
              <div>
                <h2
                  className={clsx(
                    'font-display-serif text-sm uppercase tracking-[0.2em]',
                    phaseTitleClasses(timePhase),
                  )}
                >
                  {phaseLabel(timePhase)}
                </h2>
                <p className="mt-1 text-[11px] text-text-muted">{phaseLead(timePhase)}</p>
              </div>
            </div>
          </div>

          <div className="flex min-h-[140px] flex-col justify-center p-6">
            {timePhase === 'morgon' && (
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

            {timePhase === 'dag' && (
              <div className="animate-fade-in space-y-4">
                {!microStep ? (
                  <>
                    <label className="flex items-center gap-1.5 text-xs font-medium text-text-dim">
                      <Brain className="h-3.5 w-3.5 text-accent" aria-hidden />
                      Paralys-Brytaren
                    </label>
                    <input
                      type="text"
                      value={paralysisTask}
                      onChange={(e) => setParalysisTask(e.target.value)}
                      placeholder="Vad skjuter du upp just nu?"
                      className="input-glass w-full text-sm"
                    />
                    <button
                      type="button"
                      onClick={handleParalysisBreakdown}
                      disabled={!paralysisTask.trim()}
                      className="btn-pill--accent w-full text-xs disabled:opacity-40"
                    >
                      Ge mig ett mikrosteg
                    </button>
                  </>
                ) : (
                  <div className="rounded-2xl border border-accent/20 bg-accent/5 p-4 text-center">
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-accent">
                      Ditt mikrosteg
                    </span>
                    <p className="mt-2 text-sm font-medium leading-relaxed text-text">{microStep}</p>
                    <button
                      type="button"
                      onClick={() => setMicroStep(null)}
                      className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-surface-2 py-2.5 text-xs font-semibold text-accent transition-colors hover:text-accent-light"
                    >
                      <CheckCircle2 className="h-4 w-4" aria-hidden />
                      Klar, gå vidare
                    </button>
                  </div>
                )}
              </div>
            )}

            {timePhase === 'kvall' && (
              <div className="animate-fade-in space-y-3 text-center">
                <p className="mx-auto max-w-sm text-xs leading-relaxed text-text-muted">
                  {showInkast
                    ? 'Skriv av dig dagens brus i Inkastet nedan. Lämna allt som inte är ditt ansvar.'
                    : 'Landning i kväll — en kort rad i Dagbok räcker om du vill.'}
                </p>
                {!showInkast ? (
                  <button
                    type="button"
                    onClick={() => navigate(NAV_PATHS.HJARTAT)}
                    className="btn-pill--ghost text-xs"
                  >
                    Öppna Dagbok
                  </button>
                ) : null}
              </div>
            )}
          </div>

          {showInkast ? (
            <div
              id="inkast"
              className="flex flex-col gap-3 border-t border-border/20 bg-surface-3/20 p-5 scroll-mt-24"
            >
              <div className="mb-1 flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-accent" aria-hidden />
                <span className="text-[10px] font-semibold uppercase tracking-widest text-text-dim">
                  Smart Inkast
                </span>
              </div>
              <CaptureSuperModule variant="kompass" onSaved={onSaved} />
            </div>
          ) : null}
        </div>
      ) : (
        <p className="text-center text-xs text-text-dim">
          Hemprofil «{preset.label}» — check-in via{' '}
          <button type="button" className="text-accent underline-offset-2 hover:underline" onClick={() => navigate('/vardagen?tab=kompasser')}>
            Kompasser
          </button>
          .
        </p>
      )}
    </div>
  );
}
