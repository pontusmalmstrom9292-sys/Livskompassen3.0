import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Anchor, Loader2, Shield } from 'lucide-react';
import { BentoCard } from '../../core/ui/BentoCard';
import { analyzeBiffMessage, extractGreyRockReply } from '../api/biffService';
import { useStore } from '../../core/store';
import { saveVaultLog } from '../../core/firebase/firestore';

export function SafeHarborPage() {
  const location = useLocation();
  const user = useStore((s) => s.user);
  const [message, setMessage] = useState('');
  const [reply, setReply] = useState<string | null>(null);
  const [riskScore, setRiskScore] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [savingEvidence, setSavingEvidence] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [evidenceSaved, setEvidenceSaved] = useState(false);

  useEffect(() => {
    const prefilled = (location.state as { prefilledMessage?: string } | null)?.prefilledMessage;
    if (prefilled) setMessage(prefilled);
  }, [location.state]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setLoading(true);
    setError(null);
    setReply(null);
    setRiskScore(null);
    setEvidenceSaved(false);

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

  const handleSaveAsEvidence = async () => {
    if (!user || !message.trim()) return;
    setSavingEvidence(true);
    setError(null);
    try {
      await saveVaultLog(user.uid, {
        action: 'hamn_biff',
        truth: message.trim(),
        category: 'kommunikation',
        biffUsed: true,
        entryType: 'simple',
      });
      setEvidenceSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kunde inte spara som bevis.');
    } finally {
      setSavingEvidence(false);
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
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => navigator.clipboard.writeText(reply)}
              className="text-xs uppercase tracking-widest text-accent/70"
            >
              Kopiera svar
            </button>
            <button
              type="button"
              onClick={handleSaveAsEvidence}
              disabled={savingEvidence || !user}
              className="btn-pill--secondary flex items-center gap-2 text-xs"
            >
              {savingEvidence ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <Shield className="h-3 w-3" />
              )}
              Spara original som bevis
            </button>
          </div>
          {evidenceSaved && (
            <p className="mt-3 text-sm text-success">Sparat i Verklighetsvalvet under Hjärtat → Bevis.</p>
          )}
        </BentoCard>
      )}
    </div>
  );
}
