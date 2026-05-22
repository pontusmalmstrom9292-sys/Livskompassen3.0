import { useCallback, useEffect, useState } from 'react';
import { Loader2, Plus } from 'lucide-react';
import { useStore } from '../../core/store';
import { BentoCard } from '../../core/ui/BentoCard';
import { EmptyState } from '../../core/ui/EmptyState';
import {
  getMemoryAnchors,
  saveMemoryAnchor,
  type MemoryAnchorRow,
} from '../../core/firebase/firestore';
import { ValidationReminder } from './ValidationReminder';

function relativeLabel(iso: string): string {
  const d = iso.slice(0, 10);
  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  if (d === today) return 'Idag';
  if (d === yesterday) return 'Igår';
  return d;
}

/** F-05 — positiva minnesankare, skild från WORM-valv. */
export function MemoryAnchorsPanel() {
  const user = useStore((s) => s.user);
  const [text, setText] = useState('');
  const [rows, setRows] = useState<MemoryAnchorRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      setRows(await getMemoryAnchors(user.uid));
    } catch {
      setError('Kunde inte hämta minnesankare.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const handleSave = async () => {
    const trimmed = text.trim();
    if (!user || !trimmed) return;
    setSaving(true);
    setError(null);
    try {
      await saveMemoryAnchor(user.uid, trimmed);
      setText('');
      await refresh();
    } catch {
      setError('Kunde inte spara ankare.');
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return <p className="text-sm text-text-muted">Logga in för att spara minnesankare.</p>;
  }

  return (
    <div className="space-y-4">
      <BentoCard
        title="Mina positiva minnesankare"
        description="Återhämtning — inte juridisk bevisföring"
        icon={<Plus className="h-4 w-4" />}
      >
        <label className="block">
          <span className="sr-only">Positiv stund</span>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="En kort positiv stund…"
            className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-text"
            maxLength={280}
          />
        </label>
        <button
          type="button"
          onClick={handleSave}
          disabled={saving || !text.trim()}
          className="btn-pill--accent mt-3 disabled:opacity-50"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          Spara ankare
        </button>
        {error && <p className="mt-2 text-sm text-danger">{error}</p>}
      </BentoCard>

      <BentoCard title="Senaste stunder">
        {loading && rows.length === 0 ? (
          <p className="flex items-center gap-2 text-sm text-text-dim">
            <Loader2 className="h-4 w-4 animate-spin" /> Laddar…
          </p>
        ) : rows.length === 0 ? (
          <EmptyState message="Inga ankare ännu — ett fält räcker." />
        ) : (
          <ul className="space-y-3">
            {rows.map((row) => (
              <li key={row.id} className="glass-card p-3 text-sm">
                <p className="text-[10px] uppercase tracking-widest text-text-dim">
                  {relativeLabel(row.createdAt)}
                </p>
                <p className="mt-1 text-text-muted">{row.text}</p>
              </li>
            ))}
          </ul>
        )}
      </BentoCard>

      <ValidationReminder />
    </div>
  );
}
