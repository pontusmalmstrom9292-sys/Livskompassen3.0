import { useEffect, useMemo, useState } from 'react';
import { useStore } from '@/core/store';
import { useIsEconomyAdvancedUnlocked } from '@/core/store/useCapacityGate';
import { EconomyGateway } from './economy_gateway';
import {
  TrendingUp,
  ShieldAlert,
  Wallet,
  Clock,
  PiggyBank,
  ShoppingCart,
  Plus,
  Loader2,
} from 'lucide-react';
import type {
  EconomyLedgerRow,
  BudgetEnvelopeRow,
  BudgetSavingsRow,
  EconomyImpulseRow,
} from '@/core/types/firestore';
/** Huvudingång för avancerad ekonomi — /ekonomi och /ekonomi/avancerad.
 *  Kapacitetslyssnare + route-guard hanteras av EconomyDashboardRoute i AppRoutes. */
export default function EconomyDashboard() {
  const user = useStore((state) => state.user);
  const isEconomyAdvancedUnlocked = useIsEconomyAdvancedUnlocked();

  const gateway = useMemo(() => {
    if (!user?.uid) return null;
    return new EconomyGateway(user.uid, isEconomyAdvancedUnlocked);
  }, [user?.uid, isEconomyAdvancedUnlocked]);

  const [ledger, setLedger] = useState<EconomyLedgerRow[]>([]);
  const [envelopes, setEnvelopes] = useState<BudgetEnvelopeRow[]>([]);
  const [savings, setSavings] = useState<BudgetSavingsRow[]>([]);
  const [impulses, setImpulses] = useState<EconomyImpulseRow[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isEconomyAdvancedUnlocked && gateway) {
      let isMounted = true;
      const fetchData = async () => {
        setIsDataLoading(true);
        setError(null);
        try {
          const [ledgerData, envelopesData, savingsData, impulsesData] = await Promise.all([
            gateway.getLedgerEntries(5),
            gateway.getBudgetEnvelopes(),
            gateway.getSavingsGoals(),
            gateway.getImpulseQueue(),
          ]);

          if (isMounted) {
            setLedger(ledgerData);
            setEnvelopes(envelopesData);
            setSavings(savingsData);
            setImpulses(impulsesData);
          }
        } catch (err) {
          console.error('[EconomyDashboard] Error loading data:', err);
          if (isMounted) {
            setError('Kunde inte ladda ekonomisk data. Kontrollera dina behörigheter.');
          }
        } finally {
          if (isMounted) {
            setIsDataLoading(false);
          }
        }
      };

      fetchData();
      return () => {
        isMounted = false;
      };
    }
  }, [isEconomyAdvancedUnlocked, gateway]);

  return (
    <div className="w-full min-h-[85vh] p-4 sm:p-6 md:p-8 text-text bg-bg transition-colors duration-300">
      <div className="max-w-6xl mx-auto space-y-8">

        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/30 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display-serif text-3xl text-accent tracking-wide">Avancerad Ekonomi</h1>
              <span className="flex items-center gap-1 rounded-full border border-success/40 bg-success/10 px-2 py-0.5 text-[10px] uppercase tracking-wider text-success">
                <TrendingUp className="h-3 w-3" /> Stabil kapacitet
              </span>
            </div>
            <p className="mt-1 text-sm text-text-muted">
              Säkra, kognitivt avlastade verktyg för din personliga ekonomi och långsiktiga mål.
            </p>
          </div>
        </header>

        {error && (
          <div className="flex items-start gap-3 rounded-lg border border-danger/30 bg-danger/10 p-4 text-sm text-danger">
            <ShieldAlert className="h-5 w-5 shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          <div className="rounded-xl border border-border bg-surface-2 p-5 shadow-indigo-glow flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Wallet className="h-5 w-5 text-accent" />
                  <h3 className="font-semibold text-text">Kuvertbudget</h3>
                </div>
                <span className="text-xs text-text-dim">Månadsvis</span>
              </div>
              <p className="mt-2 text-xs text-text-muted">
                Fördela dina resurser i virtuella kuvert för att få stenkoll utan komplicerade grafer.
              </p>

              <div className="mt-4 space-y-2.5">
                {isDataLoading ? (
                  <div className="h-12 flex items-center justify-center"><Loader2 className="h-4 w-4 animate-spin text-text-dim" /></div>
                ) : envelopes.length > 0 ? (
                  envelopes.slice(0, 3).map(env => (
                    <div key={env.id} className="text-xs">
                      <div className="flex justify-between text-text-muted">
                        <span>{env.title}</span>
                        <span className="font-mono text-text">{env.spentSek} / {env.allocatedSek} kr</span>
                      </div>
                      <div className="mt-1 h-1 w-full rounded-full bg-surface-3 overflow-hidden">
                        <div
                          className="h-full bg-accent"
                          style={{ width: `${Math.min(100, (env.spentSek / env.allocatedSek) * 100)}%` }}
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-text-dim italic">Inga kuvert skapade ännu.</p>
                )}
              </div>
            </div>

            <button type="button" className="mt-6 flex items-center justify-center gap-1.5 w-full rounded-lg border border-border/50 bg-surface-3 py-2 text-xs font-medium text-accent hover:bg-surface-3/80 transition-colors">
              <Plus className="h-3.5 w-3.5" /> Hantera Kuvert
            </button>
          </div>

          <div className="rounded-xl border border-border bg-surface-2 p-5 shadow-indigo-glow flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <PiggyBank className="h-5 w-5 text-accent-secondary" />
                  <h3 className="font-semibold text-text">Buffert & Sparmål</h3>
                </div>
                <span className="text-xs text-text-dim">Målsparande</span>
              </div>
              <p className="mt-2 text-xs text-text-muted">
                Sparande utan stress. Håll koll på dina familjeprojekt och din långsiktiga trygghet.
              </p>

              <div className="mt-4 space-y-2.5">
                {isDataLoading ? (
                  <div className="h-12 flex items-center justify-center"><Loader2 className="h-4 w-4 animate-spin text-text-dim" /></div>
                ) : savings.length > 0 ? (
                  savings.slice(0, 3).map(goal => (
                    <div key={goal.id} className="text-xs">
                      <div className="flex justify-between text-text-muted">
                        <span>{goal.title}</span>
                        <span className="font-mono text-text">{goal.currentSek} / {goal.targetSek} kr</span>
                      </div>
                      <div className="mt-1 h-1 w-full rounded-full bg-surface-3 overflow-hidden">
                        <div
                          className="h-full bg-accent-secondary"
                          style={{ width: `${Math.min(100, (goal.currentSek / goal.targetSek) * 100)}%` }}
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-text-dim italic">Inga sparmål aktiverade.</p>
                )}
              </div>
            </div>

            <button type="button" className="mt-6 flex items-center justify-center gap-1.5 w-full rounded-lg border border-border/50 bg-surface-3 py-2 text-xs font-medium text-accent-secondary hover:bg-surface-3/80 transition-colors">
              <Plus className="h-3.5 w-3.5" /> Hantera Sparande
            </button>
          </div>

          <div className="rounded-xl border border-border bg-surface-2 p-5 shadow-indigo-glow flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5 text-accent-ai" />
                  <h3 className="font-semibold text-text">Impulsköpspaus</h3>
                </div>
                <span className="text-xs text-text-dim">Pauskö</span>
              </div>
              <p className="mt-2 text-xs text-text-muted">
                Parkera planerade köp i 24 timmar för att låta impulsiva känslor lägga sig före köpbeslut.
              </p>

              <div className="mt-4">
                {isDataLoading ? (
                  <div className="h-12 flex items-center justify-center"><Loader2 className="h-4 w-4 animate-spin text-text-dim" /></div>
                ) : impulses.length > 0 ? (
                  <div className="rounded-lg bg-surface-3 p-3 text-center border border-border/30">
                    <span className="text-2xl font-display text-accent-ai">{impulses.length}</span>
                    <p className="text-[10px] text-text-muted uppercase tracking-wider mt-1">
                      Köp blockerade i väntelistan
                    </p>
                  </div>
                ) : (
                  <div className="rounded-lg bg-surface-3 p-3 text-center border border-border/30">
                    <p className="text-xs text-text-dim italic">Impulslistan är tom. Bra jobbat!</p>
                  </div>
                )}
              </div>
            </div>

            <button type="button" className="mt-6 flex items-center justify-center gap-1.5 w-full rounded-lg border border-border/50 bg-surface-3 py-2 text-xs font-medium text-accent-ai hover:bg-surface-3/80 transition-colors">
              Öppna Pauslistan
            </button>
          </div>

          <div className="md:col-span-2 lg:col-span-3 rounded-xl border border-border bg-surface-2 p-5 shadow-accent-glow">
            <div className="flex items-center justify-between border-b border-border/20 pb-3">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-accent" />
                <h3 className="font-semibold text-text">Ekonomilogg (WORM)</h3>
              </div>
              <span className="text-[10px] uppercase tracking-wider text-text-dim bg-surface-3 border border-border/50 px-2 py-0.5 rounded-full">
                Säker Beviskedja
              </span>
            </div>

            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-xs text-text-muted">
                <thead>
                  <tr className="border-b border-border/10 text-text-dim text-[10px] uppercase tracking-wider">
                    <th className="py-2">Datum</th>
                    <th className="py-2">Kategori</th>
                    <th className="py-2">Beskrivning</th>
                    <th className="py-2 text-right">Summa (kr)</th>
                  </tr>
                </thead>
                <tbody>
                  {isDataLoading ? (
                    <tr>
                      <td colSpan={4} className="py-8 text-center"><Loader2 className="h-5 w-5 animate-spin text-text-dim mx-auto" /></td>
                    </tr>
                  ) : ledger.length > 0 ? (
                    ledger.map((row) => (
                      <tr key={row.id} className="border-b border-border/10 hover:bg-surface-3/30 transition-colors">
                        <td className="py-2.5 font-mono">{new Date(row.createdAt).toLocaleDateString('sv-SE')}</td>
                        <td className="py-2.5">{row.category}</td>
                        <td className="py-2.5 text-text font-medium">{row.description}</td>
                        <td className={`py-2.5 text-right font-mono font-medium ${row.type === 'utgift' ? 'text-danger' : 'text-success'}`}>
                          {row.type === 'utgift' ? '-' : '+'}{row.amountSek}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="py-6 text-center text-text-dim italic">
                        Inga händelser registrerade i loggen ännu.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
