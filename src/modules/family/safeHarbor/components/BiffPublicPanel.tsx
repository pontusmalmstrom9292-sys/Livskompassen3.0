import { useState, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, Shield } from 'lucide-react';
import { vaultDrawerPath } from '../../../core/navigation/navTruth';
import { analyzeBiffMessage, extractGreyRockReply, type GransAnalysis } from '../api/biffService';
import { useStore } from '../../../core/store';
import { saveVaultLog } from '../../../core/firebase/firestore';
import { BiffTriagePanel } from './BiffTriagePanel';
import { HandoffBox } from '../../../diary/diary/components/HandoffBox';
import { shouldShowValvHandoff } from '../../../core/triggers/valvHandoff';
import { shouldRedirectMabraCoachToSpeglar } from '../../../wellbeing/mabra/lib/mabraCoachGuard';
import { MabraSpeglarGuardHint } from '../../../wellbeing/mabra/components/MabraSpeglarGuardHint';

type Props = {
  initialMessage?: string;
};

/** Publikt Hamn — endast Grey Rock-svar, ingen riskanalys eller bevis. */
export function BiffPublicPanel({ initialMessage = '' }: Props) {
  const [message, setMessage] = useState(initialMessage);
  const [reply, setReply] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [speglarGuardDismissed, setSpeglarGuardDismissed] = useState(false);
  const fromSpeglar = Boolean(initialMessage.trim());

  useEffect(() => {
    if (initialMessage.trim()) setMessage(initialMessage);
  }, [initialMessage]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setLoading(true);
    setError(null);
    setReply(null);

    try {
      const result = await analyzeBiffMessage(message);
      setReply(extractGreyRockReply(result));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Svar kunde inte hämtas. Försök igen om en stund.',
      );
    } finally {
      setLoading(false);
    }
  };

  const handleKlar = useCallback(() => {
    setMessage('');
    setReply(null);
    setError(null);
  }, []);

  return (
    <div className="space-y-3">
      {fromSpeglar && (
        <p className="text-xs text-text-dim">
          Text från Speglar är förifylld — redigera fritt innan du hämtar svar.
        </p>
      )}
      <form onSubmit={handleSubmit} className="space-y-3">
        <textarea
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            setSpeglarGuardDismissed(false);
          }}
          placeholder="Klistra in sms eller mejl (logistik först, inget JADE)…"
          rows={4}
          className="input-glass text-sm"
          disabled={loading}
        />
        {shouldShowValvHandoff(message) && <HandoffBox className="mt-1" />}
        {shouldRedirectMabraCoachToSpeglar(message) && !speglarGuardDismissed && (
          <MabraSpeglarGuardHint
            className="mt-1"
            onStay={() => setSpeglarGuardDismissed(true)}
          />
        )}
        <button type="submit" disabled={loading || !message.trim()} className="btn-pill--accent w-full">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          Få Grey Rock-svar
        </button>
      </form>

      {error && <p className="text-sm text-text-muted">{error}</p>}

      {!reply && !loading && !error && !message.trim() && (
        <p className="text-xs text-text-dim">
          Tomt fält — klistra in meddelandet. Inget sparas förrän du trycker Klar. Behöver du riskanalys
          eller bevisarkiv?{' '}
          <Link to={vaultDrawerPath('hamn_analys')} className="text-accent/80 underline">
            Valv → Hamn · Analys
          </Link>
        </p>
      )}

      {reply && (
        <div className="rounded-xl border border-accent/20 bg-accent/5 px-3 py-3">
          <p className="text-[10px] uppercase tracking-widest text-accent/70">Föreslaget svar</p>
          <p className="mt-2 whitespace-pre-wrap text-sm text-text-muted">{reply}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => navigator.clipboard.writeText(reply)}
              className="text-xs text-accent/80"
            >
              Kopiera
            </button>
            <button type="button" onClick={handleKlar} className="btn-pill--ghost text-xs">
              Klar — rensa
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/** Valv-zon Hamn — risk, agent, spara bevis. */
export function HamnForensicPanel({ initialMessage = '' }: Props) {
  const user = useStore((s) => s.user);
  const [message, setMessage] = useState(initialMessage);

  useEffect(() => {
    if (initialMessage.trim()) setMessage(initialMessage);
  }, [initialMessage]);
  const [reply, setReply] = useState<string | null>(null);
  const [grans, setGrans] = useState<GransAnalysis | null>(null);
  const [agentName, setAgentName] = useState<string | null>(null);
  const [riskScore, setRiskScore] = useState<number | null>(null);
  const [hitlRequired, setHitlRequired] = useState(false);
  const [loading, setLoading] = useState(false);
  const [savingEvidence, setSavingEvidence] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [evidenceSaved, setEvidenceSaved] = useState(false);

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
      setError(
        err instanceof Error ? err.message : 'Analysen svarar inte. Försök igen om en stund.',
      );
    } finally {
      setLoading(false);
    }
  };

  const handleKlar = useCallback(() => {
    setMessage('');
    setReply(null);
    setGrans(null);
    setAgentName(null);
    setRiskScore(null);
    setHitlRequired(false);
    setEvidenceSaved(false);
    setError(null);
  }, []);

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
      setError(err instanceof Error ? err.message : 'Bevis kunde inte sparas. Försök igen.');
    } finally {
      setSavingEvidence(false);
    }
  };

  return (
    <div className="space-y-3">
      <form onSubmit={handleSubmit} className="space-y-3">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Klistra in meddelandet för full analys…"
          rows={4}
          className="input-glass text-sm"
          disabled={loading}
        />
        {shouldShowValvHandoff(message) && <HandoffBox className="mt-1" />}
        <button type="submit" disabled={loading || !message.trim()} className="btn-pill--accent w-full">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          Kör BIFF Triage
        </button>
      </form>

      {error && <p className="text-sm text-text-muted">{error}</p>}

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
            <button type="button" onClick={handleKlar} className="btn-pill--ghost text-xs">
              Klar — rensa
            </button>
          </div>
          {evidenceSaved && (
            <p className="mt-2 text-xs text-success">Sparat i Valv → Bevis.</p>
          )}
        </div>
      )}
    </div>
  );
}
