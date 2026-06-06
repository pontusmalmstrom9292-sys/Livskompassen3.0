import { useState, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, Shield, AlertTriangle, Sparkles } from 'lucide-react';
import { vaultDrawerPath } from '@/core/navigation/navTruth';
import { analyzeBiffMessage, extractGreyRockReply, type GransAnalysis } from '../api/biffService';
import { useStore } from '@/core/store';
import { saveVaultLog } from '@/core/firebase/firestore';
import { BiffTriagePanel } from './BiffTriagePanel';
import { HandoffBox } from '@/features/lifeJournal/diary/diary/components/HandoffBox';
import { shouldShowValvHandoff } from '@/core/triggers/valvHandoff';
import { submitCaptureDraft } from '@/modules/capture/submitCaptureDraft';
import { shouldRedirectMabraCoachToSpeglar } from '@/features/dailyLife/wellbeing/mabra/lib/mabraCoachGuard';
import { MabraSpeglarGuardHint } from '@/features/dailyLife/wellbeing/mabra/components/MabraSpeglarGuardHint';

type Props = {
  initialMessage?: string;
};

interface JadeViolation {
  type: 'J' | 'A' | 'D' | 'E';
  label: string;
  description: string;
}

// Lokal realtidsanalys för JADE-mönster (Justify, Argue, Defend, Explain)
function analyzeJadePatterns(text: string): JadeViolation[] {
  const lower = text.toLowerCase();
  const violations: JadeViolation[] = [];

  if (
    lower.includes('förklara') ||
    lower.includes('måste förstå') ||
    lower.includes('vill förtydliga') ||
    lower.includes('meningen var')
  ) {
    violations.push({
      type: 'J',
      label: 'Justifiering (Förklaring)',
      description:
        'Du försöker få motparten att förstå eller godkänna dina skäl. Detta ger motparten mer "bränsle" att angripa.',
    });
  }
  if (
    lower.includes('ljuger') ||
    lower.includes('du gjorde') ||
    lower.includes('du alltid') ||
    lower.includes('du aldrig') ||
    lower.includes('du började')
  ) {
    violations.push({
      type: 'A',
      label: 'Argumentering (Anklagelse)',
      description:
        'Du går i motattack eller påpekar hens fel. Håll fokus helt på saklig logistik, aldrig hens karaktär.',
    });
  }
  if (
    lower.includes('mitt fel') ||
    lower.includes('försvarar') ||
    lower.includes('gjorde det för att') ||
    lower.includes('inte sant')
  ) {
    violations.push({
      type: 'D',
      label: 'Försvar (Defensivitet)',
      description:
        'Du försvarar ditt beteende. Ett defensivt svar indikerar för en narcissist att anklagelsen har träffat och har makt.',
    });
  }
  if (
    lower.includes('eftersom') ||
    lower.includes('därför att') ||
    lower.includes('orsaken är') ||
    lower.includes('anledningen var')
  ) {
    violations.push({
      type: 'E',
      label: 'Explikering (Förtydligande)',
      description:
        'Du förklarar bakomliggande detaljer eller motiv. En fientlig motpart är inte intresserad av "varför" — svara bara Ja, Nej eller ge fakta.',
    });
  }

  return violations;
}

export function BiffPublicPanel({ initialMessage = '' }: Props) {
  const [message, setMessage] = useState(initialMessage);
  const [reply, setReply] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [speglarGuardDismissed, setSpeglarGuardDismissed] = useState(false);
  const [autosorting, setAutosorting] = useState(false);
  const [autosortNote, setAutosortNote] = useState<string | null>(null);
  const [jadeViolations, setJadeViolations] = useState<JadeViolation[]>([]);
  const fromSpeglar = Boolean(initialMessage.trim());

  useEffect(() => {
    if (initialMessage.trim()) {
      setMessage(initialMessage);
    }
  }, [initialMessage]);

  // Kör JADE-detektorn i realtid vid ändring
  useEffect(() => {
    if (message.trim().length < 8) {
      setJadeViolations([]);
      return;
    }
    const caught = analyzeJadePatterns(message);
    setJadeViolations(caught);
  }, [message]);

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
    setAutosortNote(null);
    setJadeViolations([]);
  }, []);

  // "Städa till Grey Rock"-städningen (autokorrigering av ditt svar)
  const handleCleanToGreyRock = () => {
    const defaultTemplate =
      'Jag har tagit emot ditt meddelande. Vi håller oss till gällande schema. Hälsningar.';
    setMessage(defaultTemplate);
    setJadeViolations([]);
  };

  const handleAutosortToArkiv = async () => {
    if (!message.trim()) return;
    setAutosorting(true);
    setError(null);
    setAutosortNote(null);
    try {
      const { message: note } = await submitCaptureDraft({
        text: message.trim(),
        fileName: 'hamn_biff.txt',
        sourceModule: 'hamn_biff',
      });
      setAutosortNote(note);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Autosort misslyckades.');
    } finally {
      setAutosorting(false);
    }
  };

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
          placeholder="Klistra in sms eller skriv ditt tänkta svar till motparten (inget JADE)…"
          rows={4}
          className={[
            'input-glass text-sm resize-none',
            jadeViolations.length > 0 ? 'border-danger/30 focus:border-danger/50' : '',
          ].join(' ')}
          disabled={loading}
        />

        {/* —— REALTIME JADE DETECTOR BAR —— */}
        {jadeViolations.length > 0 && (
          <div className="rounded-xl border border-danger/20 bg-danger/5 p-3.5 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-danger">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              <span>Varning: Detekterade JADE-mönster</span>
            </div>
            <ul className="space-y-1.5 text-xs text-text-muted">
              {jadeViolations.map((v, i) => (
                <li key={i} className="leading-relaxed">
                  <strong className="text-text">{v.label}:</strong> {v.description}
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={handleCleanToGreyRock}
              className="btn-pill--accent text-[11px] px-3 py-1.5 flex items-center gap-1.5"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Städa till Grey Rock-mall
            </button>
          </div>
        )}

        {shouldShowValvHandoff(message) && <HandoffBox className="mt-1" sourceText={message} />}
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
          <Link to={vaultDrawerPath('hamn_analys')} className="text-accent/80 underline-offset-2 hover:underline">
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
              onClick={() => void handleAutosortToArkiv()}
              disabled={autosorting || !message.trim()}
              className="btn-pill--ghost text-xs"
            >
              {autosorting ? <Loader2 className="h-3 w-3 animate-spin" /> : null}
              Sortera till arkiv
            </button>
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
          {autosortNote && (
            <p className="mt-2 text-xs text-gold/90" role="status">
              {autosortNote}
            </p>
          )}
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
  const [autosorting, setAutosorting] = useState(false);
  const [autosortNote, setAutosortNote] = useState<string | null>(null);
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
    setAutosortNote(null);
    setError(null);
  }, []);

  const handleAutosortToArkiv = async () => {
    if (!message.trim()) return;
    setAutosorting(true);
    setError(null);
    setAutosortNote(null);
    try {
      const { message: note } = await submitCaptureDraft({
        text: message.trim(),
        fileName: 'hamn_biff.txt',
        sourceModule: 'hamn_biff',
      });
      setAutosortNote(note);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Autosort misslyckades.');
    } finally {
      setAutosorting(false);
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
        {shouldShowValvHandoff(message) && <HandoffBox className="mt-1" sourceText={message} />}
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
              onClick={() => void handleAutosortToArkiv()}
              disabled={autosorting || !message.trim()}
              className="btn-pill--ghost flex items-center gap-2 text-xs"
            >
              {autosorting ? <Loader2 className="h-3 w-3 animate-spin" /> : null}
              Sortera till arkiv
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
            <button type="button" onClick={handleKlar} className="btn-pill--ghost text-xs">
              Klar — rensa
            </button>
          </div>
          {evidenceSaved && (
            <p className="mt-2 text-xs text-success">Sparat i Valv → Bevis.</p>
          )}
          {autosortNote && (
            <p className="mt-2 text-xs text-gold/90" role="status">
              {autosortNote}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
