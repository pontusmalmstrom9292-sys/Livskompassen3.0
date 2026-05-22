import { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Anchor, Loader2, Shield } from 'lucide-react';
import { BentoCard } from '../../core/ui/BentoCard';
import { analyzeBiffMessage, extractGreyRockReply } from '../api/biffService';
import { useStore } from '../../core/store';
import { saveVaultLog } from '../../core/firebase/firestore';

export function SafeHarborPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useStore((s) => s.user);
  const [message, setMessage] = useState('');
  const [reply, setReply] = useState<string | null>(null);
  const [riskScore, setRiskScore] = useState<number | null>(null);
  const [hitlRequired, setHitlRequired] = useState(false);
  const [loading, setLoading] = useState(false);
  const [savingEvidence, setSavingEvidence] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [evidenceSaved, setEvidenceSaved] = useState(false);

  const wipeHamnFields = useCallback(() => {
    setMessage('');
    setReply(null);
    setRiskScore(null);
    setHitlRequired(false);
    setError(null);
    setEvidenceSaved(false);
  }, []);

  const handleKlar = useCallback(() => {
    wipeHamnFields();
    navigate(location.pathname, { replace: true, state: null });
  }, [wipeHamnFields, navigate, location.pathname]);

  useEffect(() => {
    const prefilled = (location.state as { prefilledMessage?: string } | null)?.prefilledMessage;
    if (prefilled) setMessage(prefilled);
  }, [location.state]);

  useEffect(() => () => wipeHamnFields(), [wipeHamnFields]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setLoading(true);
    setError(null);
    setReply(null);
    setRiskScore(null);
    setHitlRequired(false);
    setEvidenceSaved(false);

    try {
      const result = await analyzeBiffMessage(message);
      setReply(extractGreyRockReply(result));
      setRiskScore(result.dcap?.riskScore ?? null);
      setHitlRequired(result.data?.hitlRequired === true);
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
          {hitlRequired && (
            <div className="mb-3 rounded-xl border border-border-strong bg-surface/50 px-3 py-2 text-sm text-text-muted">
              Hög risk flaggad. AI-svaret är ett förslag — överväg att prata med någon du litar på.
              Eskalering registrerad för manuell uppföljning (HITL).
            </div>
          )}
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
          <button
            type="button"
            onClick={handleKlar}
            className="mt-4 btn-pill--ghost text-xs uppercase tracking-widest"
          >
            Klar — rensa
          </button>
        </BentoCard>
      )}
    </div>
  );
}
