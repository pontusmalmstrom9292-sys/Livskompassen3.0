import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Loader2 } from 'lucide-react';
import { BentoCard } from '../../core/ui/BentoCard';
import { PinGate } from '../../core/ui/PinGate';
import { EmptyState } from '../../core/ui/EmptyState';
import { TimelineEntry } from '../../core/ui/TimelineEntry';
import { useStore } from '../../core/store';
import { saveChildrenLog, getChildrenLogs } from '../../core/firebase/firestore';
import { CHILD_ALIASES, type ChildAlias } from '../constants';
import type { ChildrenLogEntry, PhysiologicalSignals } from '../types';
import { computeBalansIndex } from '../utils/balansIndex';
import { downloadBalansReportJson, exportBalansReport } from '../utils/exportBalansReport';
import { BalansMatare } from './BalansMatare';
import { PhysiologicalControls } from './PhysiologicalControls';
import { ChildSubLogPanel } from './ChildSubLogPanel';
import { SaveAsEvidencePrompt } from './SaveAsEvidencePrompt';

const CHILDREN_PIN_KEY = 'livskompassen_children_pin_hash';

function hashPin(pin: string): string {
  let h = 0;
  for (let i = 0; i < pin.length; i++) h = (Math.imul(31, h) + pin.charCodeAt(i)) | 0;
  return String(h);
}

const defaultSignals: PhysiologicalSignals = { somn: 3, angest: 3, aptit: 3 };

type LogFilter = 'all' | 'skola' | 'livslogg';

type BarnensPageProps = {
  embedded?: boolean;
};

export function BarnensPage({ embedded = false }: BarnensPageProps) {
  const user = useStore((s) => s.user);
  const isVaultUnlocked = useStore((s) => s.ui.isVaultUnlocked);
  const setVaultUnlocked = useStore((s) => s.setVaultUnlocked);
  const [unlocked, setUnlocked] = useState(false);
  const [pin, setPin] = useState('');
  const [needsSetup, setNeedsSetup] = useState(!localStorage.getItem(CHILDREN_PIN_KEY));
  const [confirmPin, setConfirmPin] = useState('');
  const [activeChild, setActiveChild] = useState<ChildAlias>('Kasper');
  const [signals, setSignals] = useState<PhysiologicalSignals>(defaultSignals);
  const [logs, setLogs] = useState<ChildrenLogEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [logFilter, setLogFilter] = useState<LogFilter>('all');
  const [evidenceForLogId, setEvidenceForLogId] = useState<string | null>(null);

  useEffect(() => {
    if (!isVaultUnlocked) setUnlocked(false);
  }, [isVaultUnlocked]);

  useEffect(() => {
    const onVisibility = () => {
      if (document.visibilityState === 'hidden') setUnlocked(false);
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  useEffect(() => {
    return () => {
      setPin('');
      setConfirmPin('');
      setEvidenceForLogId(null);
    };
  }, []);

  const refreshLogs = async () => {
    if (!user) return;
    const data = await getChildrenLogs(user.uid);
    setLogs(data as ChildrenLogEntry[]);
  };

  useEffect(() => {
    if (unlocked && user) {
      refreshLogs().catch(() => setError('Kunde inte hämta loggar.'));
    }
  }, [unlocked, user]);

  useEffect(() => {
    setSignals(defaultSignals);
    setError(null);
    setEvidenceForLogId(null);
  }, [activeChild]);

  const balans = useMemo(
    () => computeBalansIndex(logs, activeChild),
    [logs, activeChild],
  );

  const childLogs = useMemo(() => {
    let rows = logs.filter((l) => l.childAlias === activeChild);
    if (logFilter === 'skola') {
      rows = rows.filter(
        (l) =>
          l.action === 'livslogg' &&
          (l.category === 'skola' || l.category === 'tredjepart'),
      );
    } else if (logFilter === 'livslogg') {
      rows = rows.filter((l) => l.action === 'livslogg');
    }
    return rows;
  }, [logs, activeChild, logFilter]);

  const handleUnlock = () => {
    if (needsSetup) {
      if (pin.length < 4 || pin !== confirmPin) {
        setError('PIN måste matcha (minst 4 tecken).');
        return;
      }
      localStorage.setItem(CHILDREN_PIN_KEY, hashPin(pin));
      setNeedsSetup(false);
      setUnlocked(true);
      setPin('');
      setConfirmPin('');
      setError(null);
      return;
    }
    if (localStorage.getItem(CHILDREN_PIN_KEY) === hashPin(pin)) {
      setUnlocked(true);
      setPin('');
      setError(null);
    } else {
      setError('Fel PIN.');
    }
  };

  const handleSavePhysio = async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      await saveChildrenLog(user.uid, {
        childAlias: activeChild,
        observation: '',
        action: 'fysiologi',
        signals,
      });
      await refreshLogs();
    } catch {
      setError('Kunde inte spara signaler.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveObservation = async (data: {
    observation: string;
    category: string;
    childrenImpact?: string;
  }) => {
    if (!user) throw new Error('Ej inloggad');
    setError(null);
    const id = await saveChildrenLog(user.uid, {
      childAlias: activeChild,
      ...data,
      action: 'livslogg',
    });
    await refreshLogs();
    return id;
  };

  if (!unlocked) {
    return (
      <BentoCard
        title={embedded ? 'Livsloggar' : 'Barnens livsloggar'}
        icon={<Heart className="h-4 w-4" />}
      >
        <PinGate
          description="Kasper och Arvid — neutrala observationer. Separat PIN, Zero Footprint."
          pin={pin}
          confirmPin={confirmPin}
          setupMode={needsSetup}
          error={error}
          icon={<Heart className="h-4 w-4" />}
          onPinChange={setPin}
          onConfirmPinChange={setConfirmPin}
          onSubmit={handleUnlock}
        />
      </BentoCard>
    );
  }

  if (!user) {
    return <p className="text-sm text-text-muted">Logga in för att spara livsloggar.</p>;
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {CHILD_ALIASES.map((name) => (
          <button
            key={name}
            type="button"
            onClick={() => setActiveChild(name)}
            className={`flex-1 rounded-xl border py-2 text-sm ${
              activeChild === name ? 'chip--active' : 'chip--idle'
            }`}
          >
            {name}
          </button>
        ))}
      </div>

      <BentoCard title={`${activeChild} — Balans`} icon={<Heart className="h-4 w-4" />}>
        <BalansMatare result={balans} />
        <div className="mt-3 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => downloadBalansReportJson(exportBalansReport(activeChild, logs))}
            className="text-xs uppercase tracking-widest text-text-dim hover:text-accent"
          >
            Exportera stabilitetsrapport (JSON)
          </button>
          <Link to="/dossier" className="text-xs uppercase tracking-widest text-text-dim hover:text-accent">
            Skapa dossier (samlad export)
          </Link>
        </div>
      </BentoCard>

      <BentoCard title={`Dagens signaler — ${activeChild}`}>
        <PhysiologicalControls signals={signals} onChange={setSignals} />
        <button
          type="button"
          onClick={handleSavePhysio}
          disabled={loading}
          className="btn-pill--accent mt-4 disabled:opacity-50"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          Spara dagens signaler
        </button>
        <ChildSubLogPanel
          key={activeChild}
          childAlias={activeChild}
          userId={user.uid}
          onSave={handleSaveObservation}
        />
        {error && <p className="mt-2 text-sm text-danger">{error}</p>}
        <button
          type="button"
          onClick={() => {
            setUnlocked(false);
            setVaultUnlocked(false);
          }}
          className="mt-4 text-xs uppercase tracking-widest text-text-dim"
        >
          Lås modul
        </button>
      </BentoCard>

      <BentoCard title={`Tidslinje — ${activeChild}`}>
        <div className="mb-3 flex flex-wrap gap-2">
          {(
            [
              { id: 'all' as const, label: 'Alla' },
              { id: 'livslogg' as const, label: 'Livslogg' },
              { id: 'skola' as const, label: 'Skola / tredjepart' },
            ] as const
          ).map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setLogFilter(f.id)}
              className={`rounded-full border px-3 py-1 text-xs ${
                logFilter === f.id ? 'chip--active' : 'chip--idle'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        {childLogs.length === 0 ? (
          <EmptyState message="Inga loggar i detta filter." />
        ) : (
          <ul className="space-y-3">
            {childLogs.map((log) => (
              <li key={log.id}>
                <TimelineEntry
                  as="div"
                  meta={`${log.action ?? 'livslogg'}${log.category ? ` · ${log.category}` : ''} · ${(log.createdAt ?? '').slice(0, 10)}`}
                  body={
                    log.signals
                      ? `Sömn ${log.signals.somn} · Ångest ${log.signals.angest} · Aptit ${log.signals.aptit}`
                      : (log.observation ?? log.truth ?? '')
                  }
                  truncateAt={0}
                />
                {log.action === 'livslogg' && log.id && evidenceForLogId !== log.id && (
                  <button
                    type="button"
                    onClick={() => setEvidenceForLogId(log.id)}
                    className="mt-2 text-xs uppercase tracking-widest text-text-dim hover:text-gold"
                  >
                    Spara som bevis?
                  </button>
                )}
                {evidenceForLogId === log.id && log.id && (
                  <SaveAsEvidencePrompt
                    userId={user.uid}
                    childAlias={activeChild}
                    childrenLogId={log.id}
                    observation={log.observation ?? log.truth ?? ''}
                    category={log.category ?? 'vardag'}
                    childrenImpact={log.childrenImpact}
                    onDone={() => setEvidenceForLogId(null)}
                  />
                )}
              </li>
            ))}
          </ul>
        )}
      </BentoCard>
    </div>
  );
}
