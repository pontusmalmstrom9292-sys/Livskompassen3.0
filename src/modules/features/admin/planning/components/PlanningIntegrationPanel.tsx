import { useState } from 'react';
import { Mail, Calendar, Sliders, ShieldCheck, Lock, Clock } from 'lucide-react';
import { clsx } from 'clsx';

type ActiveSubTab = 'email_rules' | 'calendar_sync';

/** Planering — integration (visuell mockup). OAuth/Kalender/Gmail-synk pausad till Fas 2. */
export function PlanningIntegrationPanel() {
  const [activeSubTab, setActiveSubTab] = useState<ActiveSubTab>('email_rules');

  const rules = [
    { id: '1', label: 'Skolmeddelanden (Kasper/Arvid)', pattern: 'skola.se', route: 'planering' },
    { id: '2', label: 'Direkt ex-kommunikation', pattern: 'mamma', route: 'hamn' },
  ];

  const getRouteLabel = (route: string) => {
    switch (route) {
      case 'planering':
        return 'Planering (Kanban)';
      case 'vault':
        return 'Arkiv';
      case 'hamn':
        return 'Trygg Hamn (BIFF)';
      default:
        return 'Inkorg';
    }
  };

  return (
    <div className="calm-card glow-bottom-gold mx-auto max-w-2xl p-1 shadow-lg">
      <div className="mb-2 flex gap-1 rounded-t-2xl border-b border-border/20 bg-surface-3/40 p-1">
        <button
          type="button"
          onClick={() => setActiveSubTab('email_rules')}
          className={clsx(
            'flex flex-1 items-center justify-center gap-1.5 rounded-xl px-2 py-3 text-xs font-medium transition-all duration-300',
            activeSubTab === 'email_rules'
              ? 'border border-accent/20 bg-accent/10 text-accent shadow-[0_0_15px_rgba(212,175,55,0.05)]'
              : 'border border-transparent text-text-dim hover:bg-surface-3 hover:text-text',
          )}
        >
          <Mail className="h-4 w-4" aria-hidden />
          E-post-sorterare (Fas 2)
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab('calendar_sync')}
          className={clsx(
            'flex flex-1 items-center justify-center gap-1.5 rounded-xl px-2 py-3 text-xs font-medium transition-all duration-300',
            activeSubTab === 'calendar_sync'
              ? 'border border-indigo-500/20 bg-indigo-500/10 text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.05)]'
              : 'border border-transparent text-text-dim hover:bg-surface-3 hover:text-text',
          )}
        >
          <Calendar className="h-4 w-4" aria-hidden />
          Kalendersynk (Fas 2)
        </button>
      </div>

      <div className="animate-fade-in min-h-[260px] p-5 sm:p-6">
        {activeSubTab === 'email_rules' && (
          <div className="space-y-5">
            <div>
              <h3 className="flex items-center gap-2 text-sm font-semibold text-text">
                <Sliders className="h-4 w-4 text-accent" aria-hidden />
                Regelmotor för E-post
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-text-muted">
                Manuell e-postsortering. Här sätter du upp regler för hur viktiga mejl ska hanteras
                när systemet är fullt utbyggt.
              </p>
            </div>

            <div className="space-y-2.5">
              {rules.map((rule) => (
                <div
                  key={rule.id}
                  className="flex items-center justify-between rounded-2xl border border-border/40 bg-surface-3/30 p-3.5 transition-colors hover:bg-surface-3/50"
                >
                  <div className="space-y-1">
                    <span className="text-xs font-medium text-text">{rule.label}</span>
                    <div className="flex items-center gap-1.5 text-[10px] text-text-dim">
                      <span>
                        Innehåller:{' '}
                        <strong className="font-mono text-text-muted">{rule.pattern}</strong>
                      </span>
                      <span className="text-border-strong" aria-hidden>
                        •
                      </span>
                      <span className="text-accent/90">{getRouteLabel(rule.route)}</span>
                    </div>
                  </div>
                  <Lock className="h-4 w-4 text-text-dim/50" aria-hidden />
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-center justify-center gap-2 rounded-xl border border-border-strong bg-surface-2 p-3 text-xs text-text-dim">
              <Clock className="h-3.5 w-3.5" aria-hidden />
              Automatiseringen aktiveras i Fas 2.
            </div>
          </div>
        )}

        {activeSubTab === 'calendar_sync' && (
          <div className="flex h-full min-h-[220px] flex-col items-center justify-center space-y-5 pt-4 text-center">
            <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full border border-indigo-500/20 bg-indigo-500/10">
              <Calendar className="h-5 w-5 text-indigo-400" aria-hidden />
            </div>

            <div>
              <h3 className="text-sm font-semibold text-text">Säker Kalenderanslutning</h3>
              <p className="mx-auto mt-2 max-w-sm text-xs leading-relaxed text-text-muted">
                Att koppla externa API:er kräver tunga serverresurser och behörigheter. För att
                skydda systemets stabilitet och din kognitiva belastning är detta pausat till Fas 2.
              </p>
            </div>

            <div className="mt-2 flex w-full max-w-sm items-center justify-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3.5">
              <ShieldCheck className="h-4 w-4 text-emerald-400" aria-hidden />
              <span className="text-xs font-medium text-emerald-400">
                Ditt system är säkrat och lokalt.
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
