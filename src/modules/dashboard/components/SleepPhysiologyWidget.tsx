import { Moon, Zap } from 'lucide-react';
import { useState } from 'react';
import { useStore } from '@/core/store';
import { saveJournalEntry } from '@/core/firebase/firestore';

type Props = {
  onLogged?: () => void;
};

export function SleepPhysiologyWidget({ onLogged }: Props) {
  const user = useStore(s => s.user);
  const [sleepScore, setSleepScore] = useState(5);
  const [energyScore, setEnergyScore] = useState(5);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    if (!user?.uid) return;
    setSaving(true);
    try {
      await saveJournalEntry(user.uid, {
        mood: 'physiology',
        text: `Sömn: ${sleepScore}/10, Energi: ${energyScore}/10`,
        category: 'physiology',
        tags: [`sleep:${sleepScore}`, `energy:${energyScore}`]
      });
      setSaved(true);
      onLogged?.();
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="calm-card rounded-2xl border border-border/30 bg-surface-2/40 p-4 space-y-3">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-text-dim flex items-center gap-2">
        <Moon className="h-3.5 w-3.5" />
        Sömn & Energi
      </h3>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs text-text-muted">Sömn</label>
          <span className="text-xs font-mono text-accent">{sleepScore}/10</span>
        </div>
        <input
          type="range" min={1} max={10} value={sleepScore}
          onChange={e => setSleepScore(Number(e.target.value))}
          className="w-full accent-accent"
          aria-label="Sömnkvalitet 1-10"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs text-text-muted flex items-center gap-1"><Zap className="h-3 w-3" /> Energi</label>
          <span className="text-xs font-mono text-accent">{energyScore}/10</span>
        </div>
        <input
          type="range" min={1} max={10} value={energyScore}
          onChange={e => setEnergyScore(Number(e.target.value))}
          className="w-full accent-accent"
          aria-label="Energinivå 1-10"
        />
      </div>

      <button
        onClick={() => void handleSave()}
        disabled={saving || saved}
        className="w-full rounded-xl border border-accent/30 bg-accent/10 px-3 py-2 text-xs font-medium text-accent transition-colors hover:bg-accent/20 disabled:opacity-50"
      >
        {saved ? 'Loggat ✓' : saving ? 'Sparar…' : 'Logga'}
      </button>
    </div>
  );
}
