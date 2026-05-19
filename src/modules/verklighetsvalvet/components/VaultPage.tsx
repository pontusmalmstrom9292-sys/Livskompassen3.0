import { Lock, ShieldAlert, Plus, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { BentoCard } from '../../core/ui/BentoCard';
import { useStore } from '../../core/store';
import { hasVaultGate } from '../../core/auth/sessionService';
import { saveVaultLog, getVaultLogs } from '../../core/firebase/firestore';
import type { VaultLog } from '../../core/types/firestore';

const PIN_STORAGE_KEY = 'livskompassen_vault_pin_hash';

function hashPin(pin: string): string {
  let h = 0;
  for (let i = 0; i < pin.length; i++) h = (Math.imul(31, h) + pin.charCodeAt(i)) | 0;
  return String(h);
}

function verifyPin(pin: string): boolean {
  const envPin = import.meta.env.VITE_VAULT_PIN as string | undefined;
  if (envPin && pin === envPin) return true;
  const stored = localStorage.getItem(PIN_STORAGE_KEY);
  if (!stored) return false;
  return stored === hashPin(pin);
}

function setupPin(pin: string) {
  localStorage.setItem(PIN_STORAGE_KEY, hashPin(pin));
}

function hasPinConfigured(): boolean {
  return Boolean(localStorage.getItem(PIN_STORAGE_KEY) || import.meta.env.VITE_VAULT_PIN);
}

export function VaultPage() {
  const isVaultUnlocked = useStore((s) => s.ui.isVaultUnlocked);
  const setVaultUnlocked = useStore((s) => s.setVaultUnlocked);
  const user = useStore((s) => s.user);
  const [pin, setPin] = useState('');
  const [isSetup, setIsSetup] = useState(!hasPinConfigured());
  const [confirmPin, setConfirmPin] = useState('');
  const [logs, setLogs] = useState<(VaultLog & { id: string })[]>([]);
  const [loading, setLoading] = useState(false);
  const [truth, setTruth] = useState('');
  const [category, setCategory] = useState('');
  const [error, setError] = useState<string | null>(null);
  const gateOk = hasVaultGate();

  useEffect(() => {
    if (isVaultUnlocked && user) {
      setLoading(true);
      getVaultLogs(user.uid)
        .then(setLogs)
        .catch(() => setError('Kunde inte hämta loggar.'))
        .finally(() => setLoading(false));
    }
  }, [isVaultUnlocked, user]);

  const handleUnlock = () => {
    if (isSetup) {
      if (pin.length < 4) {
        setError('PIN måste vara minst 4 tecken.');
        return;
      }
      if (pin !== confirmPin) {
        setError('PIN matchar inte.');
        return;
      }
      setupPin(pin);
      setIsSetup(false);
      setVaultUnlocked(true);
      setPin('');
      setConfirmPin('');
      setError(null);
      return;
    }
    if (verifyPin(pin)) {
      setVaultUnlocked(true);
      setPin('');
      setError(null);
    } else {
      setError('Fel PIN.');
    }
  };

  const handleSaveLog = async () => {
    if (!user || !truth.trim()) return;
    setLoading(true);
    try {
      await saveVaultLog(user.uid, {
        action: 'bevis',
        truth: truth.trim(),
        category: category.trim() || 'allmänt',
      });
      setTruth('');
      setCategory('');
      const updated = await getVaultLogs(user.uid);
      setLogs(updated);
    } catch {
      setError('Kunde inte spara till valvet.');
    } finally {
      setLoading(false);
    }
  };

  if (!gateOk) {
    return (
      <BentoCard
        title="Verklighetsvalvet"
        description="Sacred Feature — long-press krävs"
        icon={<ShieldAlert className="h-4 w-4" />}
      >
        <p className="text-sm text-slate-400">
          Håll Shield-ikonen i bottenmenyn i 3 sekunder för att öppna valvet. Kort tryck räcker inte.
        </p>
      </BentoCard>
    );
  }

  if (!isVaultUnlocked) {
    return (
      <BentoCard
        title="Verklighetsvalvet"
        description="Ange PIN"
        icon={<ShieldAlert className="h-4 w-4" />}
      >
        <p className="text-sm text-slate-300 mb-3">
          {isSetup
            ? 'Skapa din PIN (sparas lokalt, aldrig hårdkodad).'
            : 'Ange PIN för att låsa upp.'}
        </p>
        <div className="space-y-2">
          <input
            type="password"
            inputMode="numeric"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="PIN"
            className="w-full rounded-xl border border-white/20 bg-black/20 px-3 py-2 text-sm"
          />
          {isSetup && (
            <input
              type="password"
              inputMode="numeric"
              value={confirmPin}
              onChange={(e) => setConfirmPin(e.target.value)}
              placeholder="Bekräfta PIN"
              className="w-full rounded-xl border border-white/20 bg-black/20 px-3 py-2 text-sm"
            />
          )}
          <button
            type="button"
            onClick={handleUnlock}
            className="rounded-xl border border-[#FDE68A]/30 px-4 py-2 text-xs uppercase tracking-widest text-[#FDE68A]"
          >
            {isSetup ? 'Skapa PIN' : 'Lås upp'}
          </button>
        </div>
        {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
      </BentoCard>
    );
  }

  return (
    <div className="space-y-4">
      <BentoCard title="Verklighetsvalvet" icon={<Lock className="h-4 w-4" />}>
        <p className="text-sm text-emerald-300 mb-4">
          Valvet är upplåst. Poster är append-only (WORM).
        </p>
        <div className="space-y-2">
          <input
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Kategori (valfritt)"
            className="w-full rounded-xl border border-white/20 bg-black/20 px-3 py-2 text-sm"
          />
          <textarea
            value={truth}
            onChange={(e) => setTruth(e.target.value)}
            placeholder="Sanning / bevis (fakta, datum, händelse)..."
            rows={4}
            className="w-full rounded-xl border border-white/20 bg-black/20 px-3 py-2 text-sm resize-none"
          />
          <button
            type="button"
            onClick={handleSaveLog}
            disabled={loading || !truth.trim()}
            className="flex items-center gap-2 rounded-full border border-[#FDE68A]/30 px-4 py-2 text-xs uppercase tracking-widest text-[#FDE68A] disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            Spara bevis
          </button>
        </div>
        {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
      </BentoCard>

      <BentoCard title="VaultLog">
        {loading && logs.length === 0 ? (
          <p className="text-sm text-slate-400">Laddar...</p>
        ) : logs.length === 0 ? (
          <p className="text-sm text-slate-400">Inga poster ännu.</p>
        ) : (
          <ul className="space-y-3">
            {logs.map((log) => (
              <li key={log.id} className="rounded-xl border border-white/10 p-3 text-sm">
                <p className="text-[10px] uppercase tracking-widest text-white/40">
                  {log.category ?? 'allmänt'} · {log.createdAt.slice(0, 10)}
                </p>
                <p className="text-slate-200 mt-1">{log.truth}</p>
              </li>
            ))}
          </ul>
        )}
      </BentoCard>
    </div>
  );
}
