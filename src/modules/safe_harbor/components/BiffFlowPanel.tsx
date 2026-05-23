import { useCallback, useEffect, useState } from 'react';
import { Loader2, RefreshCw, ShieldAlert, Sparkles } from 'lucide-react';
import { BentoCard } from '../../core/ui/BentoCard';
import { JadeGuardBanner } from '../../core/ui/JadeGuardBanner';
import { useStore } from '../../core/store';
import { saveVaultLog } from '../../core/firebase/firestore';
import {
  analyzeBiffMessage,
  extractGreyRockReply,
  type GransAnalysis,
} from '../api/biffService';
import { BiffTriagePanel } from './BiffTriagePanel';
import { GreyRockVariants } from './GreyRockVariants';

const BIFF_EXAMPLE =
  'Du hämtar alltid Kasper alldeis för sent och struntar helt i hans rutiner. Han var jättetrött hela tisdagen efter ditt slarv! Du måste förstå att jag måste ta över alla helger om du fortsätter förstöra hans skolgång. Svara direkt hur du tänker lösa detta inför tisdag kl 15:00.';

type BiffFlowPanelProps = {
  active?: boolean;
  variant?: 'hamn' | 'vault';
  initialMessage?: string;
  onKlar?: () => void;
};

export function BiffFlowPanel({
  active = true,
  variant = 'hamn',
  initialMessage = '',
  onKlar,
}: BiffFlowPanelProps) {
  const user = useStore((s) => s.user);
  const [message, setMessage] = useState(initialMessage);
  const [reply, setReply] = useState<string | null>(null);
  const [grans, setGrans] = useState<GransAnalysis | null>(null);
  const [agentName, setAgentName] = useState<string | null>(null);
  const [riskScore, setRiskScore] = useState<number | null>(null);
  const [hitlRequired, setHitlRequired] = useState(false);
  const [loading, setLoading] = useState(false);
  const [savingEvidence, setSavingEvidence] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [evidenceSaved, setEvidenceSaved] = useState(false);
  const isVault = variant === 'vault';

  const wipe = useCallback(() => {
    setMessage('');
    setReply(null);
    setGrans(null);
    setAgentName(null);
    setRiskScore(null);
    setHitlRequired(false);
    setError(null);
    setEvidenceSaved(false);
  }, []);

  useEffect(() => {
    if (!active) wipe();
  }, [active, wipe]);

  useEffect(() => () => wipe(), [wipe]);

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
        action: isVault ? 'valv_biff' : 'hamn_biff',
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
    <div className="space-y-4 pb-4">
      {isVault && (
        <div className="glass-card rounded-[2rem] border border-accent/20 p-5">
          <div className="flex items-center gap-4">
            <div className="rounded-2xl border border-accent/30 bg-accent/15 p-3">
              <ShieldAlert className="h-6 w-6 text-accent" />
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-accent">
                Kognitiv sköld
              </p>
              <h2 className="font-display text-xl text-text">BIFF-Detektor</h2>
            </div>
          </div>
          <p className="mt-3 text-sm text-text-muted">
            Filtrera JADE-fällor innan du läser. Samma motor som Hamnen — bakom skölden.
          </p>
        </div>
      )}

      <BentoCard>
        <JadeGuardBanner text={message} className="mb-3" />
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <p className="text-[10px] uppercase tracking-widest text-text-dim">Inkommande text</p>
            {isVault && (
              <button
                type="button"
                onClick={() => setMessage(BIFF_EXAMPLE)}
                className="rounded-lg border border-accent/20 bg-accent/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-accent"
              >
                Ladda exempel
              </button>
            )}
          </div>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Klistra in meddelandet här…"
            rows={5}
            className="input-glass resize-none"
            disabled={loading}
          />
          <button type="submit" disabled={loading || !message.trim()} className="btn-pill--accent w-full">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : isVault ? <Sparkles className="h-4 w-4" /> : null}
            {loading ? 'Analyserar…' : isVault ? 'Kör BIFF-triage' : 'Generera BIFF-svar'}
          </button>
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
          onSaveEvidence={user ? handleSaveAsEvidence : undefined}
          savingEvidence={savingEvidence}
          evidenceSaved={evidenceSaved}
          onKlar={onKlar ?? (isVault ? wipe : undefined)}
        />
      )}
      {isVault && grans && (
        <button
          type="button"
          onClick={wipe}
          className="btn-pill--ghost flex w-full items-center justify-center gap-2 text-xs uppercase tracking-widest"
        >
          <RefreshCw className="h-3 w-3" /> Ny analys
        </button>
      )}
    </div>
  );
}
