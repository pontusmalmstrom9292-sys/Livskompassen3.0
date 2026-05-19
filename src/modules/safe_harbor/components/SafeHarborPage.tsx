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
        <p className="mb-4 text-sm text-slate-300">
          Klistra in ett sms eller mejl. Få ett kort, affärsmässigt Grey Rock-svar utan JADE.
        </p>
        <form onSubmit={handleSubmit} className="space-y-3">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Klistra in meddelandet här..."
            rows={5}
            className="w-full rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-white resize-none focus:outline-none focus:border-[#FDE68A]/40"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !message.trim()}
            className="flex items-center gap-2 rounded-full border border-[#FDE68A]/30 px-5 py-2 text-xs uppercase tracking-widest text-[#FDE68A] disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Generera BIFF-svar
          </button>
        </form>
      </BentoCard>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      {reply && (
        <BentoCard title="Föreslaget svar">
          {riskScore !== null && (
            <p className="text-[10px] uppercase tracking-widest text-white/40 mb-2">
              Riskpoäng: {riskScore}
            </p>
          )}
          <p className="text-sm text-slate-200 whitespace-pre-wrap">{reply}</p>
          <button
            type="button"
            onClick={() => navigator.clipboard.writeText(reply)}
            className="mt-4 text-xs text-[#FDE68A]/70 uppercase tracking-widest"
          >
            Kopiera svar
          </button>
        </BentoCard>
      )}
    </div>
  );
}
