import { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Loader2, Shield } from 'lucide-react';
import {
  analyzeBiffMessage,
  extractGreyRockReply,
  type GransAnalysis,
} from '../api/biffService';
import { useStore } from '../../core/store';
import { saveVaultLog } from '../../core/firebase/firestore';
import { TryggHamnHub } from './TryggHamnHub';
import { BiffTriagePanel } from './BiffTriagePanel';

export function SafeHarborPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useStore((s) => s.user);
  const [message, setMessage] = useState('');
  const [reply, setReply] = useState<string | null>(null);
  const [grans, setGrans] = useState<GransAnalysis | null>(null);
  const [agentName, setAgentName] = useState<string | null>(null);
  const [riskScore, setRiskScore] = useState<number | null>(null);
  const [hitlRequired, setHitlRequired] = useState(false);
  const [loading, setLoading] = useState(false);
  const [savingEvidence, setSavingEvidence] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [evidenceSaved, setEvidenceSaved] = useState(false);

  const wipeHamnFields = useCallback(() => {
    setMessage('');
    setReply(null);
    setGrans(null);
    setAgentName(null);
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
    setGrans(null);
    setAgentName(null);
    setRiskScore(null);
    setHitlRequired(false);
    setEvidenceSaved(false);

    try {
      const result = await analyzeBiffMessage(message);
      setReply(extractGreyRockReply(result));
      setGrans(result.data?.gransAnalysis ?? null);
      setAgentName(result.data?.agentName ?? null);
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

  const biffPanel = (
    <div className="space-y-3">
      <form onSubmit={handleSubmit} className="space-y-3">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Klistra in meddelandet här..."
          rows={4}
          className="input-glass text-sm"
          disabled={loading}
        />
        <button type="submit" disabled={loading || !message.trim()} className="btn-pill--accent w-full">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          Kör BIFF Triage
        </button>
      </form>

      {error && <p className="text-sm text-danger">{error}</p>}

      <BiffTriagePanel
        grans={grans}
        riskScore={riskScore}
        hitlRequired={hitlRequired}
        agentName={agentName}
      />

      {reply && (
        <div className="rounded-xl border border-accent/20 bg-accent/5 px-3 py-3">
          <p className="text-[10px] uppercase tracking-widest text-accent/70">
            Föreslaget svar
            {agentName ? ` · ${agentName}` : ''}
          </p>
          {hitlRequired && (
            <p className="mt-1 text-xs text-text-muted">Hög risk — överväg mänsklig uppföljning (HITL).</p>
          )}
          {riskScore !== null && (
            <p className="text-[10px] text-text-dim">Riskpoäng: {riskScore}</p>
          )}
          <p className="mt-2 whitespace-pre-wrap text-sm text-text-muted">{reply}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => navigator.clipboard.writeText(reply)}
              className="text-xs text-accent/80"
            >
              Kopiera
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
              Spara som bevis
            </button>
          </div>
          {evidenceSaved && (
            <p className="mt-2 text-xs text-success">Sparat i Valv → Bevis.</p>
          )}
          <button type="button" onClick={handleKlar} className="btn-pill--ghost mt-3 w-full text-xs">
            Klar — rensa
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-4">
      <header className="px-0.5">
        <p className="home-page__eyebrow">Trygg hamn</p>
        <h1 className="home-page__title text-xl">Gränser & BIFF</h1>
        <p className="home-page__lead text-xs">Kompassråd och affärsmässiga svar — utan JADE.</p>
      </header>
      <TryggHamnHub biffPanel={biffPanel} />
    </div>
  );
}
