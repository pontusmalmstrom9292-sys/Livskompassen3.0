import { useState } from 'react';
import { Wallet, Utensils, CheckCircle2, Leaf, PiggyBank, Clock, Sparkles } from 'lucide-react';
import { clsx } from 'clsx';

type InternalTab = 'budget' | 'kost_prepp' | 'smarta_verktyg';

type Props = {
  userId: string;
};

export function EconomyOverviewPanel({ userId: _userId }: Props) {
  const [activeTab, setActiveTab] = useState<InternalTab>('budget');

  // Dummy-data för demonstration. Kopplas till Firestore/Zustand senare.
  const weeklyBudget = 1500;
  const spent = 450;
  const left = weeklyBudget - spent;
  const progressPercent = Math.min(100, Math.round((spent / weeklyBudget) * 100));

  const [adventureFund, setAdventureFund] = useState(1200);

  const prepItems = [
    { id: 1, text: 'Ugnsrostad kyckling (Dopamin-prekursor)', done: true },
    { id: 2, text: 'Kokt broccoli & spenat (Anti-inflammatoriskt)', done: false },
    { id: 3, text: 'Matlådor portionerade i kyl/frys', done: false },
  ];

  const handleMealPrepWin = () => {
    setAdventureFund((prev) => prev + 100);
    // I framtiden: anropa Firestore för att spara transaktionen
  };

  return (
    <div className="calm-card glow-bottom-gold p-1">
      {/* Interna flikar - Multihubb (Max 3 flikar) */}
      <div className="mb-2 flex gap-1 rounded-t-xl border-b border-border/30 bg-surface-2 p-1">
        <button
          type="button"
          onClick={() => setActiveTab('budget')}
          className={clsx(
            'flex flex-1 items-center justify-center gap-1.5 rounded-lg px-2 py-2.5 text-[11px] font-medium transition-all duration-200',
            activeTab === 'budget'
              ? 'border border-accent/20 bg-accent/10 text-accent shadow-[0_0_10px_rgba(212,175,55,0.05)]'
              : 'border border-transparent text-text-dim hover:bg-surface-3/50 hover:text-text',
          )}
        >
          <Wallet className="h-3.5 w-3.5" />
          Budget
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('kost_prepp')}
          className={clsx(
            'flex flex-1 items-center justify-center gap-1.5 rounded-lg px-2 py-2.5 text-[11px] font-medium transition-all duration-200',
            activeTab === 'kost_prepp'
              ? 'border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.05)]'
              : 'border border-transparent text-text-dim hover:bg-surface-3/50 hover:text-text',
          )}
        >
          <Leaf className="h-3.5 w-3.5" />
          Neuro-Kost
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('smarta_verktyg')}
          className={clsx(
            'flex flex-1 items-center justify-center gap-1.5 rounded-lg px-2 py-2.5 text-[11px] font-medium transition-all duration-200',
            activeTab === 'smarta_verktyg'
              ? 'border border-indigo-500/20 bg-indigo-500/10 text-indigo-400 shadow-[0_0_10px_rgba(99,102,241,0.05)]'
              : 'border border-transparent text-text-dim hover:bg-surface-3/50 hover:text-text',
          )}
        >
          <PiggyBank className="h-3.5 w-3.5" />
          Smarta Verktyg
        </button>
      </div>

      {/* Innehållsyta */}
      <div className="animate-fade-in min-h-[260px] p-4 sm:p-5">
        {activeTab === 'budget' && (
          <div className="space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-sm font-semibold text-text">Mat & Veckopeng</h3>
                <p className="mt-1 text-xs text-text-muted">
                  Säkert att spendera-zonen. Fasta utgifter är redan dragna.
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs tabular-nums">
                <span className="text-text-dim">
                  Förbrukat: <strong className="text-text">{spent} kr</strong>
                </span>
                <span className="text-text-dim">
                  Kvar att leva på: <strong className="text-accent">{left} kr</strong>
                </span>
              </div>
              <div className="h-3 w-full overflow-hidden rounded-full border border-border/50 bg-surface-3">
                <div
                  className="h-full rounded-full bg-accent shadow-accent-glow transition-all duration-700"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'kost_prepp' && (
          <div className="space-y-5">
            <div>
              <h3 className="text-sm font-semibold text-emerald-400">Blodsocker- & Energisäkring</h3>
              <p className="mt-1 text-xs leading-relaxed text-text-muted">
                Preppa matlådor för att undvika exekutiva krascher och dyra impulsköp under stressiga
                logistikdagar.
              </p>
            </div>

            <ul className="space-y-2.5">
              {prepItems.map((item) => (
                <li
                  key={item.id}
                  className="flex items-start gap-3 rounded-lg border border-border/30 bg-surface-2 p-2.5"
                >
                  <button
                    type="button"
                    className={clsx(
                      'mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-sm transition-colors',
                      item.done
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'border border-border-strong text-transparent hover:border-emerald-500/50',
                    )}
                    aria-label={item.done ? 'Markerad' : 'Ej markerad'}
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  </button>
                  <span
                    className={clsx(
                      'text-xs leading-relaxed transition-colors',
                      item.done
                        ? 'text-text-dim line-through decoration-text-dim/50'
                        : 'text-text-muted',
                    )}
                  >
                    {item.text}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {activeTab === 'smarta_verktyg' && (
          <div className="space-y-5">
            <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-4">
              <div className="mb-3 flex items-start justify-between">
                <div>
                  <h4 className="flex items-center gap-1.5 text-xs font-semibold text-indigo-300">
                    <Sparkles className="h-3.5 w-3.5" />
                    Barnens Äventyrskassa
                  </h4>
                  <p className="mt-1 text-[10px] text-text-muted">Mål: Liseberg till sommaren</p>
                </div>
                <span className="text-sm font-bold tabular-nums text-indigo-400">{adventureFund} kr</span>
              </div>

              <button
                type="button"
                onClick={handleMealPrepWin}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-indigo-500/30 bg-indigo-500/10 py-2 text-xs text-indigo-300 transition-colors hover:bg-indigo-500/20"
              >
                <Utensils className="h-3.5 w-3.5" />
                Åt en matlåda idag! (+100 kr till kassan)
              </button>
            </div>

            <div className="rounded-xl border border-border bg-surface-2 p-4">
              <h4 className="flex items-center gap-1.5 text-xs font-semibold text-text">
                <Clock className="h-3.5 w-3.5 text-text-dim" />
                Impulsparkeringen (24h regel)
              </h4>
              <p className="mb-3 mt-1 text-[10px] leading-relaxed text-text-muted">
                Sug efter att köpa något? Skriv in det här. Om du fortfarande vill ha det imorgon, köp det
                utan skam.
              </p>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="T.ex. Nya hörlurar..."
                  className="input-glass flex-1 rounded-lg px-3 py-1.5 text-xs"
                />
                <button
                  type="button"
                  className="btn-pill--ghost rounded-lg border border-border/50 bg-surface-3 px-3 py-1.5 text-xs"
                >
                  Parkera
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
