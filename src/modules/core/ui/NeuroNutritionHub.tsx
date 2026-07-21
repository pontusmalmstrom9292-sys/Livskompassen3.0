import { useState } from 'react';
import { Brain, Droplets, ShoppingCart, Utensils, Zap, CheckCircle2, Circle } from 'lucide-react';
import { clsx } from 'clsx';
import { textStyles } from '@/design-system';

type Tab = 'intag' | 'prepp' | 'inkop';

type IntakeKey = 'vatten' | 'protein' | 'omega3';

const SHOPPING_BASE = [
  'Ägg (Kolinkälla)',
  'Valnötter (Omega-3)',
  'Blåbär (Antioxidanter)',
  'Avokado (Fetter)',
  'Mörk choklad 70%+',
  'Färdig kyckling',
  'Naturell kvarg',
  'Fryst broccoli',
] as const;

/** Neuro-nutrition — dagens intag, låg-krav-prepp, basinköp. Lokalt state, noll skuld. */
export function NeuroNutritionHub() {
  const [activeTab, setActiveTab] = useState<Tab>('intag');
  const [intake, setIntake] = useState<Record<IntakeKey, boolean>>({
    vatten: false,
    protein: false,
    omega3: false,
  });

  const toggleIntake = (key: IntakeKey) => {
    setIntake((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="calm-card glow-bottom-green relative w-full p-5">

      <header className="mb-5 flex items-center justify-between border-b border-border pb-4">
        <div className="flex items-center gap-3">
          <div className="rounded-lg border border-success/30 bg-success/10 p-2">
            <Brain className="h-5 w-5 text-success" aria-hidden />
          </div>
          <div>
            <h2 className="font-display-serif text-lg tracking-wide text-text">Neuro-Nutrition</h2>
            <p className={textStyles.eyebrow}>
              Biokemisk stabilisering
            </p>
          </div>
        </div>
        <div className="flex gap-1" aria-label="Dagens intag — status">
          <div
            className={clsx('h-2 w-2 rounded-full', intake.vatten ? 'bg-success' : 'bg-surface-3')}
          />
          <div
            className={clsx('h-2 w-2 rounded-full', intake.protein ? 'bg-success' : 'bg-surface-3')}
          />
          <div
            className={clsx('h-2 w-2 rounded-full', intake.omega3 ? 'bg-success' : 'bg-surface-3')}
          />
        </div>
      </header>

      <nav
        className="mb-5 flex gap-2 rounded-lg border border-border bg-surface-2/80 p-1"
        aria-label="Neuro-nutrition — välj flik"
      >
        <button
          type="button"
          onClick={() => setActiveTab('intag')}
          className={clsx(
            'flex flex-1 items-center justify-center gap-2 rounded-md px-2 py-2 text-xs font-medium transition-all',
            activeTab === 'intag'
              ? 'border border-success/40 bg-success/15 text-success shadow-inner'
              : 'text-text-dim hover:text-text-muted',
          )}
        >
          <Zap className="h-3.5 w-3.5" aria-hidden />
          Dagens Intag
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('prepp')}
          className={clsx(
            'flex flex-1 items-center justify-center gap-2 rounded-md px-2 py-2 text-xs font-medium transition-all',
            activeTab === 'prepp'
              ? 'border border-accent-secondary/40 bg-accent-secondary/15 text-accent-light shadow-inner'
              : 'text-text-dim hover:text-text-muted',
          )}
        >
          <Utensils className="h-3.5 w-3.5" aria-hidden />
          Prepp (Låg-krav)
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('inkop')}
          className={clsx(
            'flex flex-1 items-center justify-center gap-2 rounded-md px-2 py-2 text-xs font-medium transition-all',
            activeTab === 'inkop'
              ? 'border border-accent/30 bg-accent/15 text-accent shadow-inner'
              : 'text-text-dim hover:text-text-muted',
          )}
        >
          <ShoppingCart className="h-3.5 w-3.5" aria-hidden />
          Inköp
        </button>
      </nav>

      <div className="min-h-[160px]">
        {activeTab === 'intag' && (
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => toggleIntake('vatten')}
              className="flex w-full items-center justify-between rounded-lg border border-border bg-surface-2/50 p-3 transition-colors hover:bg-surface-3"
            >
              <div className="flex items-center gap-3">
                <Droplets
                  className={clsx('h-5 w-5', intake.vatten ? 'text-accent-light' : 'text-text-dim')}
                  aria-hidden
                />
                <div className="text-left">
                  <p
                    className={clsx(
                      'text-sm font-medium',
                      intake.vatten ? 'text-text' : 'text-text-muted',
                    )}
                  >
                    Hydrering (Kortisol-flush)
                  </p>
                  <p className="text-xs text-text-dim">2 glas vatten direkt på morgonen.</p>
                </div>
              </div>
              {intake.vatten ? (
                <CheckCircle2 className="h-5 w-5 text-success" aria-hidden />
              ) : (
                <Circle className="h-5 w-5 text-text-dim" aria-hidden />
              )}
            </button>

            <button
              type="button"
              onClick={() => toggleIntake('protein')}
              className="flex w-full items-center justify-between rounded-lg border border-border bg-surface-2/50 p-3 transition-colors hover:bg-surface-3"
            >
              <div className="flex items-center gap-3">
                <Zap
                  className={clsx('h-5 w-5', intake.protein ? 'text-success' : 'text-text-dim')}
                  aria-hidden
                />
                <div className="text-left">
                  <p
                    className={clsx(
                      'text-sm font-medium',
                      intake.protein ? 'text-text' : 'text-text-muted',
                    )}
                  >
                    Protein (Dopamin-bas)
                  </p>
                  <p className="text-xs text-text-dim">Ägg, kvarg eller nötter före kl 10.</p>
                </div>
              </div>
              {intake.protein ? (
                <CheckCircle2 className="h-5 w-5 text-success" aria-hidden />
              ) : (
                <Circle className="h-5 w-5 text-text-dim" aria-hidden />
              )}
            </button>

            <button
              type="button"
              onClick={() => toggleIntake('omega3')}
              className="flex w-full items-center justify-between rounded-lg border border-border bg-surface-2/50 p-3 transition-colors hover:bg-surface-3"
            >
              <div className="flex items-center gap-3">
                <Brain
                  className={clsx('h-5 w-5', intake.omega3 ? 'text-accent-secondary' : 'text-text-dim')}
                  aria-hidden
                />
                <div className="text-left">
                  <p
                    className={clsx(
                      'text-sm font-medium',
                      intake.omega3 ? 'text-text' : 'text-text-muted',
                    )}
                  >
                    Omega-3 (Anti-inflammation)
                  </p>
                  <p className="text-xs text-text-dim">Dämpar hjärnans stressrespons.</p>
                </div>
              </div>
              {intake.omega3 ? (
                <CheckCircle2 className="h-5 w-5 text-accent-secondary" aria-hidden />
              ) : (
                <Circle className="h-5 w-5 text-text-dim" aria-hidden />
              )}
            </button>
          </div>
        )}

        {activeTab === 'prepp' && (
          <div className="space-y-4">
            <div className="rounded-lg border border-accent-secondary/30 bg-accent-secondary/10 p-3">
              <p className="text-sm leading-relaxed text-text-muted">
                <strong className="mb-1 block text-accent-light">Noll-friktions-regeln:</strong>
                När allostatisk stress är hög, stängs frontalloben av. Laga inte mat. Montera mat.
              </p>
            </div>
            <ul className="space-y-2">
              <li className="flex items-start gap-2 text-sm text-text-muted">
                <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-secondary" />
                <span>Koka 6 ägg och ha i kylen. Färdigt protein direkt.</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-text-muted">
                <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-secondary" />
                <span>Ställ fram en skål med valnötter synligt på bänken.</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-text-muted">
                <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-secondary" />
                <span>Köp färdiggrillad kyckling och påssallad. Inget hackande.</span>
              </li>
            </ul>
          </div>
        )}

        {activeTab === 'inkop' && (
          <div>
            <p className={`mb-3 ${textStyles.eyebrow} text-accent/80`}>
              Hjärnskyddande Basvaror
            </p>
            <div className="grid grid-cols-2 gap-2">
              {SHOPPING_BASE.map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-2 rounded border border-border bg-surface-2/50 p-2 text-xs text-text-muted"
                >
                  <div className="h-1 w-1 rounded-full bg-accent/70" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
