import { useState } from 'react';
import { Loader2, Lock } from 'lucide-react';
import { BentoCard } from '../../../core/ui/BentoCard';
import { useStore } from '../../../core/store';
import { saveVaultLog } from '../../../core/firebase/firestore';

/** D26 — Svart på vitt: hens version vs min verklighet → WORM. */
export function SvartPaVittForm() {
  const user = useStore((s) => s.user);
  const [theirVersion, setTheirVersion] = useState('');
  const [myReality, setMyReality] = useState('');
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLock = async () => {
    if (!user || !theirVersion.trim() || !myReality.trim()) return;
    setLoading(true);
    setError(null);
    try {
      await saveVaultLog(user.uid, {
        action: 'svart_pa_vitt',
        entryType: 'two_column',
        theirVersion: theirVersion.trim(),
        myReality: myReality.trim(),
        category: 'gaslighting',
        truth: myReality.trim(),
      });
      setSaved(true);
      setTheirVersion('');
      setMyReality('');
    } catch {
      setError('Bevis kunde inte låsas. Kontrollera nätverk och försök igen.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <BentoCard title="Svart på vitt" description="Hens version · Min verklighet">
      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <label className="text-[10px] uppercase tracking-widest text-text-dim">Hens version</label>
          <textarea
            value={theirVersion}
            onChange={(e) => setTheirVersion(e.target.value)}
            rows={4}
            className="input-glass mt-1 w-full text-sm"
            placeholder="Vad påstås…"
            disabled={loading}
          />
        </div>
        <div>
          <label className="text-[10px] uppercase tracking-widest text-text-dim">Min verklighet</label>
          <textarea
            value={myReality}
            onChange={(e) => setMyReality(e.target.value)}
            rows={4}
            className="input-glass mt-1 w-full text-sm"
            placeholder="Vad hände faktiskt…"
            disabled={loading}
          />
        </div>
      </div>
      <button
        type="button"
        onClick={() => void handleLock()}
        disabled={loading || !user || !theirVersion.trim() || !myReality.trim()}
        className="btn-pill--accent mt-3 flex items-center gap-2 disabled:opacity-50"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
        Lås bevis mot gaslighting
      </button>
      {error && <p className="mt-2 text-sm text-text-muted">{error}</p>}
      {saved && (
        <p className="mt-2 text-xs text-success">
          Sparat i Valv (WORM). Fälten är rensade — inget kvar i sessionen.
        </p>
      )}
    </BentoCard>
  );
}
