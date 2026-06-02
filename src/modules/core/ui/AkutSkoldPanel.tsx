import { useState, useEffect } from 'react';
import { ShieldAlert, Wind, Anchor, CheckCircle2 } from 'lucide-react';
import { clsx } from 'clsx';

type Tab = 'andas' | 'verklighet' | 'mikrosteg';
type BreathPhase = 'in' | 'håll' | 'ut';

const PHASE_DURATION: Record<BreathPhase, number> = {
  in: 4,
  håll: 7,
  ut: 8,
};

function nextPhase(phase: BreathPhase): BreathPhase {
  if (phase === 'in') return 'håll';
  if (phase === 'håll') return 'ut';
  return 'in';
}

/** Akut kognitiv sköld — 4-7-8, verklighetsankare, ett mikrosteg. */
export function AkutSkoldPanel() {
  const [activeTab, setActiveTab] = useState<Tab>('andas');
  const [breathPhase, setBreathPhase] = useState<BreathPhase>('in');
  const [timeLeft, setTimeLeft] = useState(PHASE_DURATION.in);

  useEffect(() => {
    if (activeTab !== 'andas') return;
    setBreathPhase('in');
    setTimeLeft(PHASE_DURATION.in);
  }, [activeTab]);

  useEffect(() => {
    if (activeTab !== 'andas') return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [activeTab]);

  useEffect(() => {
    if (activeTab !== 'andas' || timeLeft > 0) return;
    setBreathPhase((phase) => nextPhase(phase));
  }, [activeTab, timeLeft]);

  useEffect(() => {
    if (activeTab !== 'andas') return;
    setTimeLeft(PHASE_DURATION[breathPhase]);
  }, [activeTab, breathPhase]);

  return (
    <div className="relative mx-auto w-full max-w-md overflow-hidden rounded-2xl border border-border bg-surface p-5 shadow-2xl">
      <div
        className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-accent-secondary/10 blur-3xl"
        aria-hidden
      />

      <header className="mb-6 flex items-center gap-3 border-b border-border pb-4">
        <div className="rounded-lg border border-border bg-surface-2 p-2">
          <ShieldAlert className="h-6 w-6 text-accent-secondary" aria-hidden />
        </div>
        <div>
          <h2 className="font-display-serif text-lg tracking-wide text-text">Kognitiv Sköld</h2>
          <p className="text-xs font-medium uppercase tracking-wider text-text-dim">
            Systemet bär dig nu
          </p>
        </div>
      </header>

      <nav
        className="mb-6 flex gap-2 rounded-lg border border-border bg-surface-2/80 p-1"
        aria-label="Akut sköld — välj fokus"
      >
        <button
          type="button"
          onClick={() => setActiveTab('andas')}
          className={clsx(
            'flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-all',
            activeTab === 'andas'
              ? 'border border-accent-secondary/40 bg-accent-secondary/15 text-accent-light shadow-inner'
              : 'text-text-dim hover:text-text-muted',
          )}
        >
          <Wind className="h-4 w-4" aria-hidden />
          Reglera
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('verklighet')}
          className={clsx(
            'flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-all',
            activeTab === 'verklighet'
              ? 'border border-success/40 bg-success/15 text-success shadow-inner'
              : 'text-text-dim hover:text-text-muted',
          )}
        >
          <Anchor className="h-4 w-4" aria-hidden />
          Ankare
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('mikrosteg')}
          className={clsx(
            'flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-all',
            activeTab === 'mikrosteg'
              ? 'border border-accent/30 bg-accent/15 text-accent shadow-inner'
              : 'text-text-dim hover:text-text-muted',
          )}
        >
          <CheckCircle2 className="h-4 w-4" aria-hidden />
          Nästa
        </button>
      </nav>

      <div className="flex min-h-[180px] flex-col justify-center">
        {activeTab === 'andas' && (
          <div className="flex flex-col items-center justify-center text-center">
            <div className="relative mb-4 flex h-24 w-24 items-center justify-center">
              <div
                className={clsx(
                  'absolute inset-0 rounded-full border-2 transition-all duration-1000 ease-in-out',
                  breathPhase === 'in'
                    ? 'scale-110 border-accent-secondary opacity-100'
                    : breathPhase === 'håll'
                      ? 'scale-110 border-accent-light opacity-80'
                      : 'scale-75 border-border opacity-40',
                )}
                aria-hidden
              />
              <div className="font-display-serif text-3xl text-text">{Math.max(timeLeft, 0)}</div>
            </div>
            <h3 className="mb-1 text-lg font-medium text-text-muted">
              {breathPhase === 'in' && 'Andas in djupt...'}
              {breathPhase === 'håll' && 'Håll kvar...'}
              {breathPhase === 'ut' && 'Släpp ut långsamt...'}
            </h3>
            <p className="text-sm text-text-dim">Sänker kortisolet. Du är säker.</p>
          </div>
        )}

        {activeTab === 'verklighet' && (
          <div className="space-y-4">
            <div className="rounded-lg border border-success/30 bg-success/10 p-4">
              <p className="text-sm leading-relaxed text-text-muted">
                <strong className="mb-1 block text-success">Sanningens Ankare:</strong>
                Det du känner nu är en reaktion på manipulation, inte ett bevis på att du gjort fel.
                Gaslighting är designat för att skapa exakt denna förvirring. Din verklighet är giltig.
                Kasper och Arvid är trygga med dig.
              </p>
            </div>
            <p className="text-center text-xs uppercase tracking-widest text-success/70">
              Validera. Fixa inte. Förklara inte.
            </p>
          </div>
        )}

        {activeTab === 'mikrosteg' && (
          <div className="space-y-3">
            <p className="mb-4 text-center text-sm text-accent/80">
              Paralysbrytaren är aktiv. Gör exakt en sak:
            </p>
            <button
              type="button"
              className="group w-full rounded-lg border border-accent/30 bg-accent/10 p-4 text-left transition-colors hover:bg-accent/20"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-accent/50 group-hover:border-accent">
                  <div className="h-2 w-2 rounded-full bg-accent opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
                <span className="font-medium text-accent">Drick ett glas kallt vatten</span>
              </div>
            </button>
            <button
              type="button"
              className="group w-full rounded-lg border border-border bg-surface-2/50 p-4 text-left transition-colors hover:bg-surface-3"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-text-dim group-hover:border-text-muted">
                  <div className="h-2 w-2 rounded-full bg-text-muted opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
                <span className="font-medium text-text-muted">Lägg ifrån dig telefonen i 5 minuter</span>
              </div>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
