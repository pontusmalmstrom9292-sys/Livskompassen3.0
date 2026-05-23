import { useState, useEffect, useCallback, type ReactNode } from 'react';
import { Sun, Check, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import type { HomeActionId } from '../../core/home/homeActionCategories';
import { LifeAreaActivationBar } from '../../core/home/LifeAreaActivationBar';
import { BentoCard } from '../../core/ui/BentoCard';
import { useStore } from '../../core/store';
import { getRecentCheckIns, getVaultLogs, saveCheckIn } from '../../core/firebase/firestore';
import type { VaultLog } from '../../core/types/firestore';
import {
  isDayCompassUnlocked,
  isEveningCompassUnlocked,
  type CompassFlow,
} from '../utils/compassTime';
import { findTodayCheckInForFlow } from '../utils/compassCheckIns';
import { getDayFlowTabPresentation } from '../config/compassDayTab';
import {
  getEveningFlowTabPresentation,
  type EveningCheckInSnapshot,
} from '../config/compassEveningTab';
import {
  COMPASS_FLOWS,
  EVENING_HERO,
  MORNING_ANCHOR,
  getFlowConfig,
} from '../config/compassFlows';
import { useCompassTimeFlow } from '../hooks/useCompassTimeFlow';
import { ParalysPanel } from './ParalysPanel';
import { KasamEvening } from './KasamEvening';
import { CompassOptionPicker } from './CompassOptionPicker';

type DashboardPageProps = {
  embedded?: boolean;
  variant?: 'page' | 'hero' | 'hub';
  onCheckInSaved?: () => void;
  onLifeAreaActivate?: (id: HomeActionId) => void;
  onShowFact?: (text: string) => void;
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
  onCheckInSaved,
  onLifeAreaActivate,
  onShowFact,
}: DashboardPageProps) {
  const { activeFlow, timeFlow, switchFlow } = useCompassTimeFlow();
  const user = useStore((s) => s.user);
  const isHub = variant === 'hub';

  const [session, setSession] = useState(resetSessionState);
  const [anchorLogs, setAnchorLogs] = useState<(VaultLog & { id: string })[]>([]);
  const [morningExpanded, setMorningExpanded] = useState(false);
  const [todayDayMood, setTodayDayMood] = useState<string | null>(null);
  const [todayEveningCheckIn, setTodayEveningCheckIn] =
    useState<EveningCheckInSnapshot>(null);
  const dayUnlocked = isDayCompassUnlocked();
  const eveningUnlocked = isEveningCompassUnlocked();

  const clearSession = useCallback(() => {
    setSession(resetSessionState());
  }, []);

  const refreshTodayTabCheckIns = useCallback(async () => {
    if (!user) {
      setTodayDayMood(null);
      setTodayEveningCheckIn(null);
      return;
    }
    try {
      const rows = await getRecentCheckIns(user.uid, 24);
      const dayHit = findTodayCheckInForFlow(rows, 'day');
      const eveningHit = findTodayCheckInForFlow(rows, 'evening');
      setTodayDayMood(dayHit?.optionSelected ?? null);
      setTodayEveningCheckIn(
        eveningHit
          ? {
              optionSelected: eveningHit.optionSelected,
              taskNote: eveningHit.taskNote,
            }
          : null,
      );
    } catch {
      setTodayDayMood(null);
      setTodayEveningCheckIn(null);
    }
  }, [user]);

  const handleSwitchFlow = (id: CompassFlow) => {
    switchFlow(id);
    clearSession();
    setMorningExpanded(false);
  };

  useEffect(() => () => clearSession(), [clearSession]);

  useEffect(() => {
    void refreshTodayTabCheckIns();
  }, [refreshTodayTabCheckIns]);

  useEffect(() => {
    if (!dayUnlocked && activeFlow === 'day') {
      switchFlow(timeFlow);
      clearSession();
    }
  }, [dayUnlocked, activeFlow, timeFlow, switchFlow, clearSession]);

  useEffect(() => {
    if (!eveningUnlocked && activeFlow === 'evening') {
      switchFlow(timeFlow);
      clearSession();
    }
  }, [eveningUnlocked, activeFlow, timeFlow, switchFlow, clearSession]);

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

  const dayTabMood =
    activeFlow === 'day' && session.selected ? session.selected : todayDayMood;

  const eveningTabCheckIn = todayEveningCheckIn;

  if (activeFlow === 'evening') {
    if (!user) {
      return (
        <CompassShell
          variant={variant}
          heroMeta={heroMeta}
          timeFlow={timeFlow}
          activeFlow={activeFlow}
        >
          <FlowTabs
            activeFlow={activeFlow}
            onSwitch={handleSwitchFlow}
            dayUnlocked={dayUnlocked}
            dayTabMood={dayTabMood}
            eveningUnlocked={eveningUnlocked}
            eveningTabCheckIn={eveningTabCheckIn}
          />
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
        <FlowTabs
          activeFlow={activeFlow}
          onSwitch={handleSwitchFlow}
          dayUnlocked={dayUnlocked}
          dayTabMood={dayTabMood}
          eveningUnlocked={eveningUnlocked}
          eveningTabCheckIn={eveningTabCheckIn}
        />
        <KasamEvening
          userId={user.uid}
          onKlar={clearSession}
          onSaved={() => {
            void refreshTodayTabCheckIns();
            onCheckInSaved?.();
          }}
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
      if (activeFlow === 'day') {
        setTodayDayMood(selected);
      }
      void refreshTodayTabCheckIns();
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
      <FlowTabs
        activeFlow={activeFlow}
        onSwitch={handleSwitchFlow}
        compact={isHub}
        dayUnlocked={dayUnlocked}
        dayTabMood={dayTabMood}
        eveningUnlocked={eveningUnlocked}
        eveningTabCheckIn={eveningTabCheckIn}
      />

      {activeFlow === 'morning' && (
        <div className={isHub ? 'space-y-2' : 'space-y-3'}>
          {isHub && !morningExpanded ? (
            <p className="compass-anchor-compact line-clamp-2 text-xs leading-snug text-gold/85">
              {MORNING_ANCHOR}
            </p>
          ) : (
            <p
              className={
                isHub
                  ? 'rounded-lg border border-gold/20 bg-gold/5 px-3 py-2 text-xs text-gold/90'
                  : 'rounded-xl border border-gold/20 bg-gold/5 px-4 py-3 text-sm text-gold/90'
              }
            >
              {MORNING_ANCHOR}
            </p>
          )}
          {isHub && (
            <button
              type="button"
              className="compass-expand-btn"
              onClick={() => setMorningExpanded((v) => !v)}
            >
              {morningExpanded ? (
                <>
                  <ChevronUp className="h-3 w-3" /> Dölj ankare
                </>
              ) : (
                <>
                  <ChevronDown className="h-3 w-3" /> Visa ankare & bevis
                </>
              )}
            </button>
          )}
          {(!isHub || morningExpanded) && anchorLogs.length > 0 && (
            <div
              className={
                isHub
                  ? 'rounded-lg border border-border-strong bg-surface/30 px-3 py-2'
                  : 'rounded-xl border border-border-strong bg-surface/30 px-4 py-3'
              }
            >
              <p className="mb-1.5 text-[10px] uppercase tracking-widest text-text-dim">
                Sanningens Ankare (read-only)
              </p>
              <ul className="space-y-1">
                {anchorLogs.map((log) => (
                  <li key={log.id} className="text-xs text-text-muted line-clamp-2">
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
            title={variant === 'hero' || isHub ? undefined : flow.label}
            icon={variant === 'hero' || isHub ? undefined : <flow.icon className="h-4 w-4" />}
            className={
              variant === 'hero' || isHub
                ? 'border-0 bg-transparent p-0 shadow-none'
                : ''
            }
          >
            <p
              className={
                isHub
                  ? 'compass-option-question mb-2.5'
                  : 'compass-option-question compass-option-question--comfortable mb-4'
              }
            >
              {flow.question}
            </p>
            <CompassOptionPicker
              options={flow.options}
              selected={selected}
              onSelect={(opt) =>
                setSession((s) => ({ ...s, selected: opt, saved: false, error: null }))
              }
              density={isHub ? 'compact' : 'comfortable'}
            />

            {selected && !saved && (
              <button
                type="button"
                onClick={handleSave}
                disabled={saving || !user}
                className={isHub ? 'btn-pill--success mt-3 text-xs' : 'btn-pill--success mt-4'}
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

      {isHub && onLifeAreaActivate && onShowFact && (
        <LifeAreaActivationBar
          flow={activeFlow}
          option={selected}
          saved={saved}
          onHomeAction={onLifeAreaActivate}
          onShowFact={onShowFact}
        />
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
  variant: 'page' | 'hero' | 'hub';
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

  if (variant === 'hub') {
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
  compact = false,
  dayUnlocked,
  dayTabMood,
  eveningUnlocked,
  eveningTabCheckIn,
}: {
  activeFlow: CompassFlow;
  onSwitch: (id: CompassFlow) => void;
  compact?: boolean;
  dayUnlocked: boolean;
  dayTabMood: string | null;
  eveningUnlocked: boolean;
  eveningTabCheckIn: EveningCheckInSnapshot;
}) {
  const dayPresentation = getDayFlowTabPresentation(dayTabMood);
  const eveningPresentation = getEveningFlowTabPresentation(eveningTabCheckIn);

  const tabs: {
    id: CompassFlow;
    label: string;
    icon: typeof Sun;
    ariaLabel: string;
    tone: string | null;
    moodMarked?: boolean;
  }[] = [
    ...COMPASS_FLOWS.filter((f) => f.id !== 'day' || dayUnlocked).map((f) => {
      if (f.id === 'day') {
        return {
          id: f.id,
          label: dayPresentation.label,
          icon: dayPresentation.icon,
          ariaLabel: dayPresentation.ariaLabel,
          tone: dayPresentation.tone,
          moodMarked: Boolean(dayTabMood),
        };
      }
      return {
        id: f.id,
        label: f.label,
        icon: f.icon,
        ariaLabel: f.label,
        tone: null,
      };
    }),
    ...(eveningUnlocked
      ? [
          {
            id: 'evening' as const,
            label: eveningPresentation.label,
            icon: eveningPresentation.icon,
            ariaLabel: eveningPresentation.ariaLabel,
            tone: eveningPresentation.tone,
            moodMarked: eveningTabCheckIn?.optionSelected === 'kasam',
          },
        ]
      : []),
  ];

  return (
    <div className={compact ? 'compass-flow-tabs' : 'flex flex-wrap gap-2'}>
      {tabs.map(({ id, label, icon: Icon, ariaLabel, tone, moodMarked }) => (
        <button
          key={id}
          type="button"
          aria-label={ariaLabel}
          onClick={() => onSwitch(id)}
          className={
            compact
              ? [
                  'compass-flow-tab',
                  activeFlow === id && 'compass-flow-tab--active',
                  tone && `compass-flow-tab--tone-${tone}`,
                  id === 'day' && moodMarked && 'compass-flow-tab--day-mood',
                  id === 'evening' && moodMarked && 'compass-flow-tab--evening-kasam',
                ]
                  .filter(Boolean)
                  .join(' ')
              : [
                  'flex items-center gap-2 rounded-full border px-4 py-2 text-xs uppercase tracking-widest',
                  activeFlow === id ? 'chip--active' : 'chip--idle',
                  tone && `compass-flow-tab--tone-${tone}`,
                ]
                  .filter(Boolean)
                  .join(' ')
          }
        >
          <Icon className="h-3 w-3" />
          {label}
        </button>
      ))}
    </div>
  );
}
