import { useState, useEffect } from 'react';
import { Heart, Lock, Loader2, Plus } from 'lucide-react';
import { BentoCard } from '../../core/ui/BentoCard';
import { useStore } from '../../core/store';
import { saveChildrenLog, getChildrenLogs } from '../../core/firebase/firestore';

const CHILDREN_PIN_KEY = 'livskompassen_children_pin_hash';

function hashPin(pin: string): string {
  let h = 0;
  for (let i = 0; i < pin.length; i++) h = (Math.imul(31, h) + pin.charCodeAt(i)) | 0;
  return String(h);
}

export function BarnensPage() {
  const user = useStore((s) => s.user);
  const isVaultUnlocked = useStore((s) => s.ui.isVaultUnlocked);
  const setVaultUnlocked = useStore((s) => s.setVaultUnlocked);
  const [unlocked, setUnlocked] = useState(false);
  const [pin, setPin] = useState('');
  const [needsSetup, setNeedsSetup] = useState(!localStorage.getItem(CHILDREN_PIN_KEY));
  const [confirmPin, setConfirmPin] = useState('');
  const [childAlias, setChildAlias] = useState('');
  const [observation, setObservation] = useState('');
  const [childrenImpact, setChildrenImpact] = useState('');
  const [category, setCategory] = useState('vardag');
  const [logs, setLogs] = useState<
    { id: string; childAlias?: string; observation?: string; truth?: string; createdAt?: string }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isVaultUnlocked) {
      setUnlocked(false);
    }
  }, [isVaultUnlocked]);

  useEffect(() => {
    const onVisibility = () => {
      if (document.visibilityState === 'hidden') setUnlocked(false);
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  useEffect(() => {
    if (unlocked && user) {
      getChildrenLogs(user.uid).then(setLogs).catch(() => setError('Kunde inte hämta loggar.'));
    }
  }, [unlocked, user]);

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
    const stored = localStorage.getItem(CHILDREN_PIN_KEY);
    if (stored === hashPin(pin)) {
      setUnlocked(true);
      setPin('');
      setError(null);
    } else {
      setError('Fel PIN.');
    }
  };

  const handleSave = async () => {
    if (!user || !childAlias.trim() || !observation.trim()) return;
    setLoading(true);
    setError(null);
    try {
      await saveChildrenLog(user.uid, {
        childAlias: childAlias.trim(),
        observation: observation.trim(),
        childrenImpact: childrenImpact.trim() || undefined,
        category,
      });
      setObservation('');
      setChildrenImpact('');
      const updated = await getChildrenLogs(user.uid);
      setLogs(updated);
    } catch {
      setError('Kunde inte spara livslogg.');
    } finally {
      setLoading(false);
    }
  };

  if (!unlocked) {
    return (
      <BentoCard title="Barnens livsloggar" icon={<Heart className="h-4 w-4" />}>
        <p className="text-sm text-slate-300 mb-4">
          Neutrala, faktabaserade observationer. Separat PIN — rensas vid bakgrund (Zero Footprint).
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
      <BentoCard title="Ny livslogg" icon={<Heart className="h-4 w-4" />}>
        <p className="text-sm text-slate-400 mb-4">
          Endast fakta: vad hände, när, barnets reaktion. Inga känsloutbrott i lagrad text.
        </p>
        <div className="space-y-2">
          <input
            value={childAlias}
            onChange={(e) => setChildAlias(e.target.value)}
            placeholder="Barn (alias, t.ex. P1)"
            className="w-full rounded-xl border border-white/20 bg-black/20 px-3 py-2 text-sm"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-xl border border-white/20 bg-black/20 px-3 py-2 text-sm"
          >
            <option value="vardag">Vardag</option>
            <option value="skola">Skola</option>
            <option value="halsa">Hälsa</option>
            <option value="overlamning">Överlämning</option>
          </select>
          <textarea
            value={observation}
            onChange={(e) => setObservation(e.target.value)}
            placeholder="Observation (neutral, faktabaserad)..."
            rows={4}
            className="w-full rounded-xl border border-white/20 bg-black/20 px-3 py-2 text-sm resize-none"
          />
          <textarea
            value={childrenImpact}
            onChange={(e) => setChildrenImpact(e.target.value)}
            placeholder="Påverkan på barn (valfritt)..."
            rows={2}
            className="w-full rounded-xl border border-white/20 bg-black/20 px-3 py-2 text-sm resize-none"
          />
          <button
            type="button"
            onClick={handleSave}
            disabled={loading || !childAlias.trim() || !observation.trim()}
            className="flex items-center gap-2 rounded-full border border-[#FDE68A]/30 px-4 py-2 text-xs uppercase tracking-widest text-[#FDE68A] disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            Spara livslogg
          </button>
        </div>
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

      <BentoCard title="Tidslinje">
        {logs.length === 0 ? (
          <p className="text-sm text-slate-400">Inga loggar ännu.</p>
        ) : (
          <ul className="space-y-3">
            {logs.map((log) => (
              <li key={log.id} className="rounded-xl border border-white/10 p-3 text-sm">
                <p className="text-[10px] uppercase tracking-widest text-white/40">
                  {log.childAlias} · {(log.createdAt ?? '').slice(0, 10)}
                </p>
                <p className="text-slate-200 mt-1">{log.observation ?? log.truth}</p>
              </li>
            ))}
          </ul>
        )}
      </BentoCard>
    </div>
  );
}
