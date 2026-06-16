import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { fetchNutritionCoach } from '../api/mabraCoachService';

type Props = {
  uid?: string;
};

export function MabraNutritionCoachPanel({ uid }: Props) {
  const [note, setNote] = useState('');
  const [coachText, setCoachText] = useState('');
  const [loading, setLoading] = useState(false);
  const [requested, setRequested] = useState(false);

  const handleCoach = async () => {
    setLoading(true);
    setRequested(true);
    try {
      const result = await fetchNutritionCoach(note);
      setCoachText(result.coach);
    } catch {
      setCoachText('Coachen är offline just nu. Lyssna på din kropp — den vet ofta vad den behöver.');
    } finally {
      setLoading(false);
    }
  };

  if (requested) {
    return (
      <div className="mt-4 glass-card glass-card--ai border-accent-ai/30 p-4">
        <p className="mb-2 flex items-center gap-2 text-[10px] uppercase tracking-widest text-text-dim">
          Kost-Coach Svar <span className="text-accent-ai">AI</span>
        </p>
        {loading ? (
          <p className="text-sm text-text-dim">Analyserar och hämtar evidensbaserade råd...</p>
        ) : (
          <p className="text-sm leading-relaxed text-accent-ai">{coachText}</p>
        )}
      </div>
    );
  }

  return (
    <div className="mt-4 w-full text-left">
      <p className="mb-2 text-xs text-text-dim">Har du specifika sug eller svårt att få till en måltid? Fråga om ett tillägg.</p>
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value.slice(0, 300))}
        placeholder="T.ex: Jag har jättesug efter choklad, hur kan jag balansera det?"
        rows={2}
        className="input-glass mb-3 text-sm"
      />
      <button
        type="button"
        onClick={() => void handleCoach()}
        disabled={loading || !uid}
        className="btn-pill--secondary w-full"
      >
        {loading ? <Loader2 className="mx-auto h-4 w-4 animate-spin" /> : 'Fråga Kost-Coachen'}
      </button>
    </div>
  );
}
