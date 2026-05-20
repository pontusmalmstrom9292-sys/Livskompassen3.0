import { useState, useEffect, useMemo } from 'react';
import { Heart, Lock, Loader2 } from 'lucide-react';
import { BentoCard } from '../../core/ui/BentoCard';
import { useStore } from '../../core/store';
import { saveChildrenLog, getChildrenLogs } from '../../core/firebase/firestore';
import { CHILD_ALIASES, TRUST_LAVENDER, type ChildAlias } from '../constants';
import type { ChildrenLogEntry, PhysiologicalSignals } from '../types';
import { computeBalansIndex } from '../utils/balansIndex';
import { BalansMatare } from './BalansMatare';
import { PhysiologicalControls } from './PhysiologicalControls';
import { ChildSubLogPanel } from './ChildSubLogPanel';

const CHILDREN_PIN_KEY = 'livskompassen_children_pin_hash';

function hashPin(pin: string): string {
  let h = 0;
  for (let i = 0; i < pin.length; i++) h = (Math.imul(31, h) + pin.charCodeAt(i)) | 0;
  return String(h);
}

const defaultSignals: PhysiologicalSignals = { somn: 3, angest: 3, aptit: 3 };

export function BarnensPage() {
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

  const balans = useMemo(
    () => computeBalansIndex(logs, activeChild),
    [logs, activeChild]
  );

  const childLogs = logs.filter((l) => l.childAlias === activeChild);

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
    if (!user) return;
    setError(null);
    await saveChildrenLog(user.uid, {
      childAlias: activeChild,
      ...data,
      action: 'livslogg',
    });
    await refreshLogs();
  };

  if (!unlocked) {
    return (
      <BentoCard title="Barnens livsloggar" icon={<Heart className="h-4 w-4" />}>
        <p className="text-sm text-slate-300 mb-4">
          Kasper och Arvid — neutrala observationer. Separat PIN, Zero Footprint.
        </p>
        <div className="space-y-2">
          <input
            type="password"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder={needsSetup ? 'Skapa PIN' : 'PIN'}
            className="w-full rounded-xl border border-white/20 bg-black/20 px-3 py-2 text-sm"
          />
          {needsSetup && (
            <input
              type="password"
              value={confirmPin}
              onChange={(e) => setConfirmPin(e.target.value)}
              placeholder="Bekräfta PIN"
              className="w-full rounded-xl border border-white/20 bg-black/20 px-3 py-2 text-sm"
            />
          )}
          <button
            type="button"
            onClick={handleUnlock}
            className="flex items-center gap-2 rounded-xl border border-[#FDE68A]/30 px-4 py-2 text-xs uppercase tracking-widest text-[#FDE68A]"
          >
            <Lock className="h-4 w-4" />
            {needsSetup ? 'Skapa PIN' : 'Lås upp'}
          </button>
        </div>
        {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
      </BentoCard>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {CHILD_ALIASES.map((name) => (
          <button
            key={name}
            type="button"
            onClick={() => setActiveChild(name)}
            className={`flex-1 rounded-xl py-2 text-sm border ${
              activeChild === name
                ? 'border-[#818CF8]/50 text-[#818CF8] bg-[#818CF8]/10'
                : 'border-white/10 text-slate-400'
            }`}
          >
            {name}
          </button>
        ))}
      </div>

      <BentoCard title={`${activeChild} — Balans`} icon={<Heart className="h-4 w-4" style={{ color: TRUST_LAVENDER }} />}>
        <BalansMatare result={balans} />
      </BentoCard>

      <BentoCard title="Dagens signaler">
        <PhysiologicalControls signals={signals} onChange={setSignals} />
        <button
          type="button"
          onClick={handleSavePhysio}
          disabled={loading}
          className="mt-4 flex items-center gap-2 rounded-full border border-[#818CF8]/40 px-4 py-2 text-xs uppercase tracking-widest disabled:opacity-50"
          style={{ color: TRUST_LAVENDER }}
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          Spara dagens signaler
        </button>
        <ChildSubLogPanel childAlias={activeChild} onSave={handleSaveObservation} />
        {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
        <button
          type="button"
          onClick={() => {
            setUnlocked(false);
            setVaultUnlocked(false);
          }}
          className="mt-4 text-xs text-slate-500 uppercase tracking-widest"
        >
          Lås modul
        </button>
      </BentoCard>

      <BentoCard title={`Tidslinje — ${activeChild}`}>
        {childLogs.length === 0 ? (
          <p className="text-sm text-slate-400">Inga loggar ännu.</p>
        ) : (
          <ul className="space-y-3">
            {childLogs.map((log) => (
              <li key={log.id} className="rounded-xl border border-white/10 p-3 text-sm">
                <p className="text-[10px] uppercase tracking-widest text-white/40">
                  {log.action ?? 'livslogg'} · {(log.createdAt ?? '').slice(0, 10)}
                </p>
                {log.signals ? (
                  <p className="text-slate-200 mt-1">
                    Sömn {log.signals.somn} · Ångest {log.signals.angest} · Aptit {log.signals.aptit}
                  </p>
                ) : (
                  <p className="text-slate-200 mt-1">{log.observation ?? log.truth}</p>
                )}
              </li>
            ))}
          </ul>
        )}
      </BentoCard>
    </div>
  );
}
