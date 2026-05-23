import { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Anchor, Loader2 } from 'lucide-react';
import { ClusterShell } from '../../core/ui/ClusterShell';
import { BentoCard } from '../../core/ui/BentoCard';
import { JadeGuardBanner } from '../../core/ui/JadeGuardBanner';
import {
  analyzeBiffMessage,
  extractGreyRockReply,
  type GransAnalysis,
} from '../api/biffService';
import { useStore } from '../../core/store';
import { saveVaultLog } from '../../core/firebase/firestore';
import { BiffTriagePanel } from './BiffTriagePanel';
import { GreyRockVariants } from './GreyRockVariants';

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

  const hasHamnSession =
    Boolean(message.trim()) || Boolean(grans) || Boolean(reply) || Boolean(error);

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

  return (
    <ClusterShell
      title="Hamnen"
      description="BIFF · gränser · Grey Rock"
      tone="indigo"
      hint="10% logistik · 90% beten ignoreras — klistra in, ett steg, inget JADE."
    >
      <div className="space-y-4">
        <BentoCard icon={<Anchor className="h-4 w-4" />}>
          <form onSubmit={handleSubmit} className="space-y-3">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Klistra in meddelandet här..."
              rows={5}
              className="input-glass"
              disabled={loading}
            />
            <JadeGuardBanner text={message} className="mt-2" />
            <div className="flex flex-wrap items-center gap-2">
              <button type="submit" disabled={loading || !message.trim()} className="btn-pill--accent">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                Generera BIFF-svar
              </button>
              {hasHamnSession && (
                <button type="button" onClick={handleKlar} className="btn-pill--ghost text-xs">
                  Klar — rensa
                </button>
              )}
            </div>
          </form>
        </BentoCard>

        {error && <p className="text-sm text-danger">{error}</p>}

        {grans && <BiffTriagePanel grans={grans} />}

        {reply && (
          <GreyRockVariants
            reply={reply}
            agentName={agentName}
            riskScore={riskScore}
            hitlRequired={hitlRequired}
            onSaveEvidence={handleSaveAsEvidence}
            savingEvidence={savingEvidence}
            evidenceSaved={evidenceSaved}
            onKlar={handleKlar}
          />
        )}
      </div>
    </ClusterShell>
  );
}
