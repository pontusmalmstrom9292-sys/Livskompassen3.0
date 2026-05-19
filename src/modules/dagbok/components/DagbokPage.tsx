import { useState, useEffect } from 'react';
import { BookOpen, Loader2, Check } from 'lucide-react';
import { BentoCard } from '../../core/ui/BentoCard';
import { useStore } from '../../core/store';
import { saveJournalEntry, getJournalEntries } from '../../core/firebase/firestore';

const moods = ['Lugn', 'Trött', 'Spänd', 'Hoppfull', 'Låg'];

export function DagbokPage() {
  const user = useStore((s) => s.user);
  const [mood, setMood] = useState('');
  const [text, setText] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [entries, setEntries] = useState<
    { id: string; mood?: string; text?: string; createdAt?: string }[]
  >([]);

  useEffect(() => {
    if (!user) return;
    getJournalEntries(user.uid)
      .then(setEntries)
      .catch(() => setError('Kunde inte hämta dagbok.'));
  }, [user, saved]);

  const handleSave = async () => {
    if (!user || !mood || !text.trim()) return;
    setSaving(true);
    setError(null);
    try {
      await saveJournalEntry(user.uid, { mood, text: text.trim() });
      setText('');
      setMood('');
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      setError('Kunde inte spara. Kontrollera Firestore-regler.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <BentoCard title="Dagbok" icon={<BookOpen className="h-4 w-4" />}>
        <p className="text-sm text-slate-300 mb-4">Ett steg i taget — humör och kort text.</p>

        <p className="text-xs uppercase tracking-widest text-white/40 mb-2">Humör</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {moods.map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMood(m)}
              className={`rounded-full px-3 py-1 text-xs border ${
                mood === m
                  ? 'border-[#FDE68A]/50 bg-[#FDE68A]/10 text-[#FDE68A]'
                  : 'border-white/10 text-slate-400'
              }`}
            >
              {m}
            </button>
          ))}
        </div>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Kort reflektion..."
          rows={4}
          className="w-full rounded-2xl border border-white/10 bg-black/30 p-4 text-sm resize-none focus:outline-none focus:border-[#FDE68A]/40"
        />

        <button
          type="button"
          onClick={handleSave}
          disabled={saving || !mood || !text.trim()}
          className="mt-3 flex items-center gap-2 rounded-full border border-emerald-500/40 px-5 py-2 text-xs uppercase tracking-widest text-emerald-400 disabled:opacity-50"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : saved ? <Check className="h-4 w-4" /> : null}
          {saved ? 'Sparad' : 'Spara post'}
        </button>

        {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
      </BentoCard>

      {entries.length > 0 && (
        <BentoCard title="Senaste poster">
          <ul className="space-y-3">
            {entries.slice(0, 5).map((e) => (
              <li key={e.id} className="rounded-xl border border-white/10 p-3 text-sm">
                <p className="text-[10px] uppercase tracking-widest text-white/40">
                  {e.mood} · {(e.createdAt ?? '').slice(0, 10)}
                </p>
                <p className="text-slate-200 mt-1">{e.text}</p>
              </li>
            ))}
          </ul>
        </BentoCard>
      )}
    </div>
  );
}
