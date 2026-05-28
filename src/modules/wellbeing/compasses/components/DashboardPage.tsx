import { useState, useEffect, useCallback, type ReactNode } from 'react';
import { Sun, Check, Loader2 } from 'lucide-react';
import { BentoCard } from '../../../core/ui/BentoCard';
import { useStore } from '../../../core/store';
import { getVaultLogs, saveCheckIn } from '../../../core/firebase/firestore';
import type { VaultLog } from '../../../core/types/firestore';
import type { CompassFlow } from '../utils/compassTime';
import {
  COMPASS_FLOWS,
  EVENING_HERO,
  MORNING_ANCHOR,
  getFlowConfig,
} from '../config/compassFlows';
import { useCompassTimeFlow } from '../hooks/useCompassTimeFlow';
import { ParalysPanel } from './ParalysPanel';
import { KasamEvening } from './KasamEvening';

type DashboardPageProps = {
  embedded?: boolean;
  variant?: 'page' | 'hero' | 'hub' | 'module';
  /** När satt (t.ex. CompassModuleStrip): ingen FlowTabs, låst flöde. */
  forcedFlow?: CompassFlow;
  onCheckInSaved?: () => void;
};

function resetSessionState() {
  return {
    selected: null as string | null,
    saved: false,
    saving: false,
    error: null as string | null,
    showParalys: false,
  };
}

export function DashboardPage({
  embedded: _embedded = false,
  variant = 'page',
  forcedFlow,
  onCheckInSaved,
}: DashboardPageProps) {
  const timeHook = useCompassTimeFlow();
  const { timeFlow, switchFlow } = timeHook;
  const activeFlow = forcedFlow ?? timeHook.activeFlow;
  const hideFlowTabs = variant === 'module' || forcedFlow != null;
  const user = useStore((s) => s.user);

  const [session, setSession] = useState(resetSessionState);
  const [anchorLogs, setAnchorLogs] = useState<(VaultLog & { id: string })[]>([]);

  const clearSession = useCallback(() => {
    setSession(resetSessionState());
  }, []);

  const handleSwitchFlow = (id: CompassFlow) => {
    switchFlow(id);
    clearSession();
  };

  useEffect(() => () => clearSession(), [clearSession]);

  useEffect(() => {
    if (activeFlow !== 'morning' || !user) {
      setAnchorLogs([]);
      return;
    }
    getVaultLogs(user.uid)
      .then((logs) => {
        const pinned = logs.filter((l) => l.pinned);
        const pick = pinned.length > 0 ? pinned : logs.slice(0, 2);
        setAnchorLogs(pick.slice(0, 3));
      })
      .catch(() => setAnchorLogs([]));
  }, [activeFlow, user]);

  const heroMeta =
    activeFlow === 'evening'
      ? EVENING_HERO
      : getFlowConfig(activeFlow)!;

  if (activeFlow === 'evening') {
    if (!user) {
      return (
        <CompassShell
          variant={variant}
          heroMeta={heroMeta}
          timeFlow={timeFlow}
          activeFlow={activeFlow}
        >
          {!hideFlowTabs && (
            <FlowTabs activeFlow={activeFlow} onSwitch={handleSwitchFlow} />
          )}
          <p className="text-sm text-text-muted">Logga in för att spara kvällskompass.</p>
        </CompassShell>
      );
    }
    return (
      <CompassShell
        variant={variant}
        heroMeta={heroMeta}
        timeFlow={timeFlow}
        activeFlow={activeFlow}
      >
        {!hideFlowTabs && (
          <FlowTabs activeFlow={activeFlow} onSwitch={handleSwitchFlow} />
        )}
        <KasamEvening
          userId={user.uid}
          onKlar={clearSession}
          onSaved={onCheckInSaved}
        />
      </CompassShell>
    );
  }

  const flow = getFlowConfig(activeFlow)!;
  const { selected, saved, saving, error, showParalys } = session;

  const handleSave = async () => {
    if (!selected || !user) return;
    setSession((s) => ({ ...s, saving: true, error: null }));
    try {
      await saveCheckIn(user.uid, {
        questionId: `compass_${activeFlow}`,
        questionText: flow.question,
        optionSelected: selected,
        taskCategory: activeFlow,
      });
      setSession((s) => ({ ...s, saved: true, saving: false }));
      onCheckInSaved?.();
    } catch {
      setSession((s) => ({
        ...s,
        saving: false,
        error: 'Kunde inte spara check-in. Kontrollera Firestore-regler och .env.',
      }));
    }
  };

  return (
    <CompassShell
      variant={variant}
      heroMeta={heroMeta}
      timeFlow={timeFlow}
      activeFlow={activeFlow}
    >
      {!hideFlowTabs && (
        <FlowTabs activeFlow={activeFlow} onSwitch={handleSwitchFlow} />
      )}

      {activeFlow === 'morning' && (
        <div className="space-y-3">
          <p className="rounded-xl border border-gold/20 bg-gold/5 px-4 py-3 text-sm text-gold/90">
            {MORNING_ANCHOR}
          </p>
          {anchorLogs.length > 0 && (
            <div className="rounded-xl border border-border-strong bg-surface/30 px-4 py-3">
              <p className="text-[10px] uppercase tracking-widest text-text-dim mb-2">
                Sanningens Ankare (read-only)
              </p>
              <ul className="space-y-2">
                {anchorLogs.map((log) => (
                  <li key={log.id} className="text-sm text-text-muted line-clamp-2">
                    {(log.truth || '').slice(0, 120)}
                    {(log.truth || '').length > 120 ? '…' : ''}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      <div className={showParalys ? 'pointer-events-none opacity-20' : ''}>
        {!showParalys && (
          <BentoCard
            title={variant === 'hero' || variant === 'module' ? undefined : flow.label}
            icon={
              variant === 'hero' || variant === 'module' ? undefined : (
                <flow.icon className="h-4 w-4" />
              )
            }
            className={
              variant === 'hero' || variant === 'module'
                ? 'border-0 bg-transparent p-0 shadow-none'
                : ''
            }
          >
            <p className="mb-4 text-sm text-text-muted">{flow.question}</p>
            <div className="space-y-2">
              {flow.options.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() =>
                    setSession((s) => ({ ...s, selected: opt, saved: false, error: null }))
                  }
                  className={`w-full rounded-xl border px-4 py-3 text-left text-sm transition-colors ${
                    selected === opt
                      ? 'border-accent/50 bg-accent/10 text-accent'
                      : 'border-border-strong text-text-muted hover:border-accent/20'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>

            {selected && !saved && (
              <button
                type="button"
                onClick={handleSave}
                disabled={saving || !user}
                className="btn-pill--success mt-4"
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Check className="h-4 w-4" />
                )}
                Spara check-in
              </button>
            )}

            {saved && (
              <div className="mt-4 space-y-2">
                <p className="flex items-center gap-2 text-sm text-success">
                  <Check className="h-4 w-4" /> Check-in sparad.
                </p>
                <button type="button" onClick={clearSession} className="btn-pill--ghost text-sm">
                  Klar
                </button>
              </div>
            )}

            {error && <p className="mt-2 text-sm text-danger">{error}</p>}

            {!user && selected && !saved && (
              <p className="mt-2 text-sm text-text-muted">Logga in för att spara.</p>
            )}

            {activeFlow === 'morning' && selected === 'Inget — vila' && !saved && (
              <button
                type="button"
                onClick={() => {
                  handleSwitchFlow('day');
                  setSession((s) => ({ ...s, showParalys: true, selected: null, saved: false }));
                }}
                className="btn-pill--ghost mt-3 w-full text-sm"
              >
                Vill du ha ett mikrosteg?
              </button>
            )}
          </BentoCard>
        )}
      </div>

      {activeFlow === 'day' && (
        <>
          {!showParalys && !saved && (
            <button
              type="button"
              onClick={() => setSession((s) => ({ ...s, showParalys: true }))}
              className="btn-pill--secondary w-full text-sm"
            >
              Hjälp mig börja (Paralys)
            </button>
          )}
          {showParalys && (
            <ParalysPanel onDone={() => setSession((s) => ({ ...s, showParalys: false }))} />
          )}
        </>
      )}
    </CompassShell>
  );
}

type HeroMeta = {
  heroTitle: string;
  heroLead: string;
  label: string;
};

function CompassShell({
  variant,
  heroMeta,
  timeFlow,
  activeFlow,
  children,
}: {
  variant: 'page' | 'hero' | 'hub' | 'module';
  heroMeta: HeroMeta;
  timeFlow: CompassFlow;
  activeFlow: CompassFlow;
  children: ReactNode;
}) {
  const autoHint =
    activeFlow === timeFlow
      ? 'Aktiv för tid på dygnet'
      : `Tidsläge just nu: ${TIME_LABEL[timeFlow]}`;

  if (variant === 'hero') {
    return (
      <div className="space-y-4">
        <div>
          <p className="home-page__eyebrow">Hem · {heroMeta.label}</p>
          <h2 className="home-page__title">{heroMeta.heroTitle}</h2>
          <p className="home-page__lead">{heroMeta.heroLead}</p>
          <p className="mt-1 text-[10px] uppercase tracking-widest text-text-dim">{autoHint}</p>
        </div>
        {children}
      </div>
    );
  }

  if (variant === 'hub' || variant === 'module') {
    return <div className="space-y-3">{children}</div>;
  }

  return <div className="space-y-6">{children}</div>;
}

const TIME_LABEL: Record<CompassFlow, string> = {
  morning: 'Morgon',
  day: 'Dag',
  evening: 'Kväll',
};

function FlowTabs({
  activeFlow,
  onSwitch,
}: {
  activeFlow: CompassFlow;
  onSwitch: (id: CompassFlow) => void;
}) {
  const tabs: { id: CompassFlow; label: string; icon: typeof Sun }[] = [
    ...COMPASS_FLOWS.map((f) => ({ id: f.id, label: f.label, icon: f.icon })),
    { id: 'evening', label: EVENING_HERO.label, icon: EVENING_HERO.icon },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {tabs.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          type="button"
          onClick={() => onSwitch(id)}
          className={`flex items-center gap-2 rounded-full border px-4 py-2 text-xs uppercase tracking-widest ${
            activeFlow === id ? 'chip--active' : 'chip--idle'
          }`}
        >
          <Icon className="h-3 w-3" />
          {label}
        </button>
      ))}
    </div>
  );
}
