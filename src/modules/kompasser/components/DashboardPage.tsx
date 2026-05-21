import { useState, useEffect, useCallback } from 'react';
import { Sun, Cloud, Moon, Check, Loader2 } from 'lucide-react';
import { BentoCard } from '../../core/ui/BentoCard';
import { useStore } from '../../core/store';
import { saveCheckIn } from '../../core/firebase/firestore';
import { getDefaultCompassByTime, type CompassFlow } from '../utils/compassTime';
import { ParalysPanel } from './ParalysPanel';
import { KasamEvening } from './KasamEvening';

const MORNING_ANCHOR =
  'Min hjärna är inte trasig. Den reagerar helt normalt på en onormal situation.';

const flows: {
  id: CompassFlow;
  label: string;
  icon: typeof Sun;
  question: string;
  options: string[];
}[] = [
  {
    id: 'morning',
    label: 'Morgon',
    icon: Sun,
    question: 'Vilket mikrosteg ger dig lugnast start idag?',
    options: ['Andning 2 min', 'En uppgift', 'Inget — vila'],
  },
  {
    id: 'day',
    label: 'Dag',
    icon: Cloud,
    question: 'Hur mår kroppen just nu?',
    options: ['Stabil', 'Trött', 'Spänd', 'Orolig'],
  },
];

type DashboardPageProps = {
  embedded?: boolean;
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

export function DashboardPage({ embedded: _embedded = false }: DashboardPageProps) {
  const compassFilter = useStore((s) => s.ui.compassFilter);
  const setCompassFilter = useStore((s) => s.setCompassFilter);
  const user = useStore((s) => s.user);

  const [activeFlow, setActiveFlow] = useState<CompassFlow>(() => {
    if (
      compassFilter === 'morning' ||
      compassFilter === 'day' ||
      compassFilter === 'evening'
    ) {
      return compassFilter;
    }
    return getDefaultCompassByTime();
  });

  const [session, setSession] = useState(resetSessionState);

  const clearSession = useCallback(() => {
    setSession(resetSessionState());
  }, []);

  useEffect(() => {
    setCompassFilter(activeFlow);
  }, [activeFlow, setCompassFilter]);

  useEffect(() => {
    if (
      compassFilter === 'morning' ||
      compassFilter === 'day' ||
      compassFilter === 'evening'
    ) {
      setActiveFlow(compassFilter);
    }
  }, [compassFilter]);

  useEffect(() => () => clearSession(), [clearSession]);

  const switchFlow = (id: CompassFlow) => {
    setActiveFlow(id);
    clearSession();
  };

  if (activeFlow === 'evening') {
    if (!user) {
      return <p className="text-sm text-text-muted">Logga in för att spara kvällskompass.</p>;
    }
    return (
      <div className="space-y-6">
        <FlowTabs activeFlow={activeFlow} onSwitch={switchFlow} />
        <KasamEvening userId={user.uid} onKlar={clearSession} />
      </div>
    );
  }

  const flow = flows.find((f) => f.id === activeFlow)!;
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
    } catch {
      setSession((s) => ({
        ...s,
        saving: false,
        error: 'Kunde inte spara check-in. Kontrollera Firestore-regler och .env.',
      }));
    }
  };

  return (
    <div className="space-y-6">
      <FlowTabs activeFlow={activeFlow} onSwitch={switchFlow} />

      {activeFlow === 'morning' && (
        <p className="rounded-xl border border-gold/20 bg-gold/5 px-4 py-3 text-sm text-gold/90">
          {MORNING_ANCHOR}
        </p>
      )}

      <div className={showParalys ? 'pointer-events-none opacity-20' : ''}>
      {!showParalys && (
        <BentoCard title={flow.label} icon={<flow.icon className="h-4 w-4" />}>
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
              disabled={saving}
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

          {activeFlow === 'morning' && selected === 'Inget — vila' && !saved && (
            <button
              type="button"
              onClick={() => {
                setActiveFlow('day');
                setCompassFilter('day');
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
            <ParalysPanel
              onDone={() => setSession((s) => ({ ...s, showParalys: false }))}
            />
          )}
        </>
      )}
    </div>
  );
}

function FlowTabs({
  activeFlow,
  onSwitch,
}: {
  activeFlow: CompassFlow;
  onSwitch: (id: CompassFlow) => void;
}) {
  const tabs: { id: CompassFlow; label: string; icon: typeof Sun }[] = [
    { id: 'morning', label: 'Morgon', icon: Sun },
    { id: 'day', label: 'Dag', icon: Cloud },
    { id: 'evening', label: 'Kväll', icon: Moon },
  ];

  return (
    <div className="flex gap-2">
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
