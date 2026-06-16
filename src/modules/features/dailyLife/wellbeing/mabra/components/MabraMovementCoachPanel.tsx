import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { fetchMovementCoach } from '../api/mabraCoachService';

type Props = {
  uid?: string;
};

export function MabraMovementCoachPanel({ uid }: Props) {
  const [note, setNote] = useState('');
  const [coachText, setCoachText] = useState('');
  const [loading, setLoading] = useState(false);
  const [requested, setRequested] = useState(false);

  const handleCoach = async () => {
    setLoading(true);
    setRequested(true);
    try {
      const result = await fetchMovementCoach(note);
      setCoachText(result.coach);
    } catch {
      setCoachText('Coachen är offline just nu. Gör en enkel stretch på en minut, det är allt som krävs.');
    } finally {
      setLoading(false);
    }
  };

  if (requested) {
    return (
      <div className="mt-4 glass-card glass-card--ai border-accent-ai/30 p-4">
        <p className="mb-2 flex items-center gap-2 text-[10px] uppercase tracking-widest text-text-dim">
          Rörelse-Coach Svar <span className="text-accent-ai">AI</span>
        </p>
        {loading ? (
          <p className="text-sm text-text-dim">Skapar ett anpassat mikropass...</p>
        ) : (
          <p className="text-sm leading-relaxed text-accent-ai">{coachText}</p>
        )}
      </div>
    );
  }

  return (
    <div className="mt-4 w-full text-left">
      <p className="mb-2 text-xs text-text-dim">Vill du ha ett specifikt mikropass utformat för hur du känner dig just nu?</p>
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value.slice(0, 300))}
        placeholder="T.ex: Jag känner mig stel i nacken och behöver ny energi."
        rows={2}
        className="input-glass mb-3 text-sm"
      />
      <button
        type="button"
        onClick={() => void handleCoach()}
        disabled={loading || !uid}
        className="btn-pill--secondary w-full"
      >
        {loading ? <Loader2 className="mx-auto h-4 w-4 animate-spin" /> : 'Fråga Rörelse-Coachen'}
      </button>
    </div>
  );
}
