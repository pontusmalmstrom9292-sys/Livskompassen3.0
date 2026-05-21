import { useState } from 'react';
import { Anchor, Loader2 } from 'lucide-react';
import { BentoCard } from '../../core/ui/BentoCard';
import { analyzeBiffMessage, extractGreyRockReply } from '../api/biffService';

export function SafeHarborPage() {
  const [message, setMessage] = useState('');
  const [reply, setReply] = useState<string | null>(null);
  const [riskScore, setRiskScore] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setLoading(true);
    setError(null);
    setReply(null);
    setRiskScore(null);

    try {
      const result = await analyzeBiffMessage(message);
      setReply(extractGreyRockReply(result));
      setRiskScore(result.dcap?.riskScore ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analys misslyckades.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <BentoCard title="Safe Harbor — BIFF-Skölden" icon={<Anchor className="h-4 w-4" />}>
        <p className="mb-4 text-sm text-text-muted">
          Klistra in ett sms eller mejl. Få ett kort, affärsmässigt Grey Rock-svar utan JADE.
        </p>
        <form onSubmit={handleSubmit} className="space-y-3">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Klistra in meddelandet här..."
            rows={5}
            className="input-glass"
            disabled={loading}
          />
          <button type="submit" disabled={loading || !message.trim()} className="btn-pill--accent">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Generera BIFF-svar
          </button>
        </form>
      </BentoCard>

      {error && <p className="text-sm text-danger">{error}</p>}

      {reply && (
        <BentoCard title="Föreslaget svar">
          {riskScore !== null && (
            <p className="mb-2 text-[10px] uppercase tracking-widest text-text-dim">
              Riskpoäng: {riskScore}
            </p>
          )}
          <p className="whitespace-pre-wrap text-sm text-text-muted">{reply}</p>
          <button
            type="button"
            onClick={() => navigator.clipboard.writeText(reply)}
            className="mt-4 text-xs uppercase tracking-widest text-accent/70"
          >
            Kopiera svar
          </button>
        </BentoCard>
      )}
    </div>
  );
}
