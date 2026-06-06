import { useState } from 'react';
import { Check, Loader2, PenLine } from 'lucide-react';
import { Link } from 'react-router-dom';
import { NAV_PATHS } from '@/core/navigation/navTruth';
import { useStore } from '../../store';
import { saveJournalEntry } from '../../firebase/firestore';

type Props = {
  onSaved?: () => void;
};

export function HomeDagbokPanel({ onSaved }: Props) {
  const user = useStore((s) => s.user);
  const [text, setText] = useState('');
  const [mood, setMood] = useState('neutral');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    if (!user || text.trim().length < 2) return;
    setSaving(true);
    setError(null);
    try {
      await saveJournalEntry(user.uid, { mood, text: text.trim() });
      setSaved(true);
      setText('');
      onSaved?.();
    } catch {
      setError('Kunde inte spara dagboksrad.');
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return <p className="text-sm text-text-muted">Logga in för att skriva i dagbok.</p>;
  }

  return (
    <div className="home-module-panel">
      <p className="home-module-panel__lead">
        En neutral rad räcker. Ingen analys — bara avlastning.
      </p>
      <textarea
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          setSaved(false);
        }}
        rows={4}
        placeholder="Vad vill du minnas om idag?"
        className="input-glass w-full"
      />
      <div className="mt-3 flex flex-wrap gap-2">
        {(['lugn', 'neutral', 'tung'] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMood(m)}
            className={`chip ${mood === m ? 'chip--active' : 'chip--idle'}`}
          >
            {m === 'lugn' ? 'Lugn' : m === 'tung' ? 'Tung' : 'Neutral'}
          </button>
        ))}
      </div>
      {error && <p className="mt-2 text-sm text-danger">{error}</p>}
      {saved && (
        <p className="mt-2 flex items-center gap-2 text-sm text-success">
          <Check className="h-4 w-4" /> Sparad i dagbok.
        </p>
      )}
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          disabled={saving || text.trim().length < 2}
          onClick={handleSave}
          className="btn-pill--success inline-flex items-center gap-2"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <PenLine className="h-4 w-4" />}
          Spara rad
        </button>
        <Link to={NAV_PATHS.HJARTAT} className="btn-pill--ghost">
          Öppna dagbok
        </Link>
      </div>
    </div>
  );
}
