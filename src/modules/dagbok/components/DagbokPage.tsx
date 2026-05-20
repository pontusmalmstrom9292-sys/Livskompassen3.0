import { useState, useEffect } from 'react';
import { BookOpen, Loader2, Check, ChevronRight, ChevronLeft } from 'lucide-react';
import { BentoCard } from '../../core/ui/BentoCard';
import { useStore } from '../../core/store';
import { saveJournalEntry, getJournalEntries } from '../../core/firebase/firestore';
import { weaveJournalEntry } from '../api/weaverService';

const moods = ['Lugn', 'Trött', 'Spänd', 'Hoppfull', 'Låg'];

type Step = 'mood' | 'text' | 'save' | 'done';

export function DagbokPage() {
  const user = useStore((s) => s.user);
  const [step, setStep] = useState<Step>('mood');
  const [mood, setMood] = useState('');
  const [text, setText] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [entries, setEntries] = useState<
    { id: string; mood?: string; text?: string; createdAt?: string }[]
  >([]);

  useEffect(() => {
    if (!user) return;
    getJournalEntries(user.uid)
      .then(setEntries)
      .catch(() => setError('Kunde inte hämta dagbok.'));
  }, [user, step]);

  const handleSave = async () => {
    if (!user || !mood || !text.trim()) return;
    setSaving(true);
    setError(null);
    try {
      const id = await saveJournalEntry(user.uid, { mood, text: text.trim() });
      weaveJournalEntry({ journalEntryId: id, mood, text: text.trim() });
      setStep('done');
    } catch {
      setError('Kunde inte spara. Kontrollera Firestore-regler.');
    } finally {
      setSaving(false);
    }
  };

  const resetFlow = () => {
    setMood('');
    setText('');
    setStep('mood');
  };

  return (
    <div className="space-y-6">
      <BentoCard title="Dagbok" icon={<BookOpen className="h-4 w-4" />}>
        <p className="text-sm text-slate-300 mb-4">Ett fält i taget — minimera sensorisk belastning.</p>

        {step === 'mood' && (
          <>
            <p className="text-xs uppercase tracking-widest text-white/40 mb-2">Steg 1 — Humör</p>
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
            <button
              type="button"
              disabled={!mood}
              onClick={() => setStep('text')}
              className="flex items-center gap-2 rounded-full border border-[#818CF8]/40 px-5 py-2 text-xs uppercase tracking-widest text-[#818CF8] disabled:opacity-50"
            >
              Fortsätt <ChevronRight className="h-4 w-4" />
            </button>
          </>
        )}

        {step === 'text' && (
          <>
            <p className="text-xs uppercase tracking-widest text-white/40 mb-2">Steg 2 — Reflektion</p>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Kort reflektion..."
              rows={4}
              className="w-full rounded-2xl border border-white/10 bg-black/30 p-4 text-sm resize-none focus:outline-none focus:border-[#FDE68A]/40"
            />
            <div className="flex gap-2 mt-3">
              <button
                type="button"
                onClick={() => setStep('mood')}
                className="flex items-center gap-1 rounded-full border border-white/10 px-4 py-2 text-xs text-slate-400"
              >
                <ChevronLeft className="h-4 w-4" /> Tillbaka
              </button>
              <button
                type="button"
                disabled={!text.trim()}
                onClick={() => setStep('save')}
                className="flex items-center gap-2 rounded-full border border-[#818CF8]/40 px-5 py-2 text-xs uppercase tracking-widest text-[#818CF8] disabled:opacity-50"
              >
                Fortsätt <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </>
        )}

        {step === 'save' && (
          <>
            <p className="text-xs uppercase tracking-widest text-white/40 mb-2">Steg 3 — Bekräfta</p>
            <div className="rounded-xl border border-white/10 p-3 text-sm space-y-1 mb-4">
              <p><span className="text-white/40">Humör:</span> {mood}</p>
              <p className="text-slate-200">{text}</p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setStep('text')}
                className="flex items-center gap-1 rounded-full border border-white/10 px-4 py-2 text-xs text-slate-400"
              >
                <ChevronLeft className="h-4 w-4" /> Tillbaka
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 rounded-full border border-emerald-500/40 px-5 py-2 text-xs uppercase tracking-widest text-emerald-400 disabled:opacity-50"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                Spara post
              </button>
            </div>
          </>
        )}

        {step === 'done' && (
          <>
            <div className="flex items-center gap-2 text-emerald-400 mb-2">
              <Check className="h-5 w-5" />
              <span className="text-sm">Sparad. Vävaren taggar i bakgrunden.</span>
            </div>
            <button
              type="button"
              onClick={resetFlow}
              className="rounded-full border border-[#FDE68A]/40 px-5 py-2 text-xs uppercase tracking-widest text-[#FDE68A]"
            >
              Ny post
            </button>
          </>
        )}

        {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
      </BentoCard>

      {entries.length > 0 && step === 'mood' && (
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
