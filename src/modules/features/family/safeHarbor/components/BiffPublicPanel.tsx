import { useState, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, Shield, AlertTriangle, Sparkles } from 'lucide-react';
import { BentoCard } from '@/shared/ui/BentoCard';
import { vaultDrawerPath } from '@/core/navigation/navTruth';
import { useStore } from '@/core/store';
import { saveVaultLog, saveEvolutionLedger } from '@/core/firebase/firestore';
import { BiffTriagePanel } from './BiffTriagePanel';
import { HandoffBox } from '@/features/lifeJournal/diary/diary/components/HandoffBox';
import { SAVED_TO_VAULT_LABEL } from '@/core/copy/evidenceCopy';
import { shouldShowValvHandoff } from '@/core/triggers/valvHandoff';
import { submitCaptureDraft } from '@/modules/capture/submitCaptureDraft';
import { shouldRedirectMabraCoachToSpeglar } from '@/features/dailyLife/wellbeing/mabra/lib/mabraCoachGuard';
import { MabraSpeglarGuardHint } from '@/features/dailyLife/wellbeing/mabra/components/MabraSpeglarGuardHint';
import { detectHamnTaktikSignal } from '../lib/hamnTaktikWire';
import { HamnTaktikLexikonBro } from './HamnTaktikLexikonBro';
import { useHamnBiffWizard } from '../hooks/useHamnBiffWizard';
import { HAMN_POST_COPY_CALM } from '../hamnCopy';

type Props = {
  initialMessage?: string;
};

import { analyzeJadePatterns, type JadeViolation } from '../lib/jadeDetector';

export function BiffPublicPanel({ initialMessage = '' }: Props) {
  const [message, setMessage] = useState(initialMessage);
  const { state: wizard, reset: resetWizard, analyze, confirmReply } = useHamnBiffWizard();
  const {
    grans,
    agentName,
    riskScore,
    hitlRequired,
    theoryWithoutEvidence,
    reply,
    triageReady,
    loading,
    error,
  } = wizard;
  /** gransAnalysis — DCAP-triage från analyzeMessage (Gräns-Arkitekten). */
  const gransAnalysis = grans;
  const [speglarGuardDismissed, setSpeglarGuardDismissed] = useState(false);
  const [autosorting, setAutosorting] = useState(false);
  const [autosortNote, setAutosortNote] = useState<string | null>(null);
  const [panelError, setPanelError] = useState<string | null>(null);
  const [jadeViolations, setJadeViolations] = useState<JadeViolation[]>([]);
  const [jadeUndoText, setJadeUndoText] = useState<string | null>(null);
  const [copyCopied, setCopyCopied] = useState(false);
  const [postCopyCalm, setPostCopyCalm] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [coreQuestion, setCoreQuestion] = useState('');
  const [userGoal, setUserGoal] = useState('');
  const fromSpeglar = Boolean(initialMessage.trim());
  const taktikSignal = detectHamnTaktikSignal(message);

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
    
    // Konkatenera inmatningen om användaren angett kärnfråga och mål
    const finalPayload = [
      `Original/Utkast: ${message.trim()}`,
      coreQuestion.trim() ? `Kärnfråga (Brusfilter): ${coreQuestion.trim()}` : '',
      userGoal.trim() ? `Mål med svaret: ${userGoal.trim()}` : ''
    ].filter(Boolean).join('\n\n');
    
    await analyze(finalPayload);
  };

  const handleKlar = useCallback(() => {
    setMessage('');
    setCoreQuestion('');
    setUserGoal('');
    setStep(1);
    resetWizard();
    setAutosortNote(null);
    setPanelError(null);
    setJadeViolations([]);
    setJadeUndoText(null);
    setCopyCopied(false);
    setPostCopyCalm(false);
  }, [resetWizard]);

  // "Städa till Grey Rock"-städningen (autokorrigering av ditt svar)
  const handleCleanToGreyRock = () => {
    const defaultTemplate =
      'Jag har tagit emot ditt meddelande. Vi håller oss till gällande schema. Hälsningar.';
    setJadeUndoText(message);
    setMessage(defaultTemplate);
    setJadeViolations([]);
  };

  const handleUndoGreyRock = () => {
    if (jadeUndoText === null) return;
    setMessage(jadeUndoText);
    setJadeUndoText(null);
    setJadeViolations(analyzeJadePatterns(jadeUndoText));
  };

  const handleCopyReply = async () => {
    if (!reply) return;
    try {
      await navigator.clipboard.writeText(reply);
      setCopyCopied(true);
      setPostCopyCalm(true);
      window.setTimeout(() => setCopyCopied(false), 2000);
    } catch {
      setPanelError('Kunde inte kopiera — markera texten manuellt.');
    }
  };

  const handleAutosortToArkiv = async () => {
    if (!message.trim()) return;
    setAutosorting(true);
    setPanelError(null);
    setAutosortNote(null);
    try {
      const { message: note } = await submitCaptureDraft({
        text: message.trim(),
        fileName: 'hamn_biff.txt',
        sourceModule: 'hamn_biff',
      });
      setAutosortNote(note);
    } catch (err) {
      setPanelError(err instanceof Error ? err.message : 'Autosort misslyckades.');
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
        {step === 1 && (
          <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
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
                {jadeUndoText !== null ? (
                  <button
                    type="button"
                    onClick={handleUndoGreyRock}
                    className="btn-pill--ghost text-[11px] px-3 py-1.5"
                  >
                    Ångra städning
                  </button>
                ) : null}
              </div>
            )}

            {shouldShowValvHandoff(message) && <HandoffBox className="mt-1" sourceText={message} />}
            {shouldRedirectMabraCoachToSpeglar(message) && !speglarGuardDismissed && (
              <MabraSpeglarGuardHint
                className="mt-1"
                onStay={() => setSpeglarGuardDismissed(true)}
              />
            )}
            {taktikSignal && <HamnTaktikLexikonBro signal={taktikSignal} className="mt-1" />}
            
            <button 
              type="button" 
              onClick={() => setStep(2)} 
              disabled={!message.trim()} 
              className="btn-pill--accent w-full"
            >
              Nästa: Brusfiltret
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-3 animate-in fade-in slide-in-from-right-2 duration-300">
            <BentoCard glow="blue" className="!p-3">
              <p className="text-xs font-medium text-accent">Steg 2: Brusfiltret</p>
              <p className="mt-1 text-xs text-text-dim">
                Skala bort manipulation, anklagelser och lögner. Vad är den rent logistiska eller faktiska frågan? (t.ex. "När hämtar du barnen?")
              </p>
              <textarea
                value={coreQuestion}
                onChange={(e) => setCoreQuestion(e.target.value)}
                placeholder="Den objektiva kärnfrågan är..."
                rows={2}
                className="input-glass text-sm mt-3 resize-none"
              />
            </BentoCard>
            <div className="flex gap-2">
              <button type="button" onClick={() => setStep(1)} className="btn-pill--secondary flex-1">
                Tillbaka
              </button>
              <button type="button" onClick={() => setStep(3)} className="btn-pill--accent flex-1">
                Nästa: Mål
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-3 animate-in fade-in slide-in-from-right-2 duration-300">
            <BentoCard glow="indigo" className="!p-3">
              <p className="text-xs font-medium text-accent">Steg 3: Ditt mål</p>
              <p className="mt-1 text-xs text-text-dim">
                Vad vill du uppnå med svaret? (t.ex. "Skydda min tid", "Dokumentera för Valvet", "Bara säga nej")
              </p>
              <textarea
                value={userGoal}
                onChange={(e) => setUserGoal(e.target.value)}
                placeholder="Mitt mål med svaret är..."
                rows={2}
                className="input-glass text-sm mt-3 resize-none"
              />
            </BentoCard>
            <div className="flex gap-2">
              <button type="button" onClick={() => setStep(2)} className="btn-pill--secondary flex-1">
                Tillbaka
              </button>
              <button type="submit" disabled={loading} className="btn-pill--accent flex-1">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                Få Grey Rock-svar
              </button>
            </div>
          </div>
        )}
      </form>

      {error || panelError ? (
        <p className="text-sm text-text-muted">{error || panelError}</p>
      ) : null}

      {triageReady && !reply && step === 3 && (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
          <BiffTriagePanel
            grans={gransAnalysis}
            riskScore={riskScore}
            hitlRequired={hitlRequired}
            agentName={agentName}
            theoryWithoutEvidence={theoryWithoutEvidence}
          />
          <button
            type="button"
            onClick={confirmReply}
            className="btn-pill--accent w-full text-sm mt-3"
          >
            Visa Grey Rock-svar
          </button>
        </div>
      )}

      {!triageReady && !reply && !loading && !error && !message.trim() && step === 1 && (
        <div className="space-y-2">
          <p className="text-xs text-text-dim">
            Tomt fält — klistra in meddelandet. Inget sparas förrän du trycker Klar. Behöver du riskanalys
            eller bevisarkiv?{' '}
            <Link to={vaultDrawerPath('hamn_analys')} className="text-accent/80 underline-offset-2 hover:underline">
              Valv → Hamn · Analys
            </Link>
          </p>
          <HamnTaktikLexikonBro />
        </div>
      )}

      {reply && (
        <BentoCard glow="indigo" title="Föreslaget svar" className="!px-3 !py-3">
          <p className="mt-0 whitespace-pre-wrap text-sm text-text-muted">{reply}</p>
          {postCopyCalm ? (
            <p className="mt-3 text-xs text-text-muted" role="status">
              {HAMN_POST_COPY_CALM}
            </p>
          ) : null}
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => void handleCopyReply()}
              className="btn-pill--accent text-xs"
            >
              {copyCopied ? 'Kopierat ✓' : 'Kopiera svar'}
            </button>
            <button type="button" onClick={handleKlar} className="btn-pill--ghost text-xs">
              Klar — rensa
            </button>
            <button
              type="button"
              onClick={() => void handleAutosortToArkiv()}
              disabled={autosorting || !message.trim()}
              className="btn-pill--ghost text-xs"
            >
              {autosorting ? <Loader2 className="h-3 w-3 animate-spin" /> : null}
              Sortera till arkiv
            </button>
          </div>
          {autosortNote && (
            <p className="mt-2 text-xs text-gold/90" role="status">
              {autosortNote}
            </p>
          )}
        </BentoCard>
      )}
    </div>
  );
}

/** Valv-zon Hamn — risk, agent, spara bevis. */
export function HamnForensicPanel({ initialMessage = '' }: Props) {
  const user = useStore((s) => s.user);
  const [message, setMessage] = useState(initialMessage);
  const { state: wizard, reset: resetWizard, analyze, confirmReply } = useHamnBiffWizard();
  const {
    grans,
    agentName,
    riskScore,
    hitlRequired,
    theoryWithoutEvidence,
    reply,
    triageReady,
    loading,
    error,
  } = wizard;
  const gransAnalysis = grans;

  useEffect(() => {
    if (initialMessage.trim()) setMessage(initialMessage);
  }, [initialMessage]);
  const [savingEvidence, setSavingEvidence] = useState(false);
  const [autosorting, setAutosorting] = useState(false);
  const [autosortNote, setAutosortNote] = useState<string | null>(null);
  const [evidenceSaved, setEvidenceSaved] = useState(false);
  const [panelError, setPanelError] = useState<string | null>(null);

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [coreQuestion, setCoreQuestion] = useState('');
  const [userGoal, setUserGoal] = useState('');
  const [trainingMode, setTrainingMode] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setEvidenceSaved(false);

    const finalPayload = [
      `Original/Utkast: ${message.trim()}`,
      coreQuestion.trim() ? `Kärnfråga (Brusfilter): ${coreQuestion.trim()}` : '',
      userGoal.trim() ? `Mål med svaret: ${userGoal.trim()}` : ''
    ].filter(Boolean).join('\n\n');

    await analyze(finalPayload);
  };

  const handleKlar = useCallback(() => {
    setMessage('');
    setCoreQuestion('');
    setUserGoal('');
    setStep(1);
    resetWizard();
    setAutosortNote(null);
    setPanelError(null);
    setEvidenceSaved(false);
  }, [resetWizard]);

  const handleAutosortToArkiv = async () => {
    if (!message.trim()) return;
    setAutosorting(true);
    setPanelError(null);
    setAutosortNote(null);
    try {
      const { message: note } = await submitCaptureDraft({
        text: message.trim(),
        fileName: 'hamn_biff.txt',
        sourceModule: 'hamn_biff',
      });
      setAutosortNote(note);
    } catch (err) {
      setPanelError(err instanceof Error ? err.message : 'Autosort misslyckades.');
    } finally {
      setAutosorting(false);
    }
  };

  const handleSaveAsEvidence = async () => {
    if (!user || !message.trim()) return;
    setSavingEvidence(true);
    setPanelError(null);
    try {
      await saveVaultLog(user.uid, {
        action: 'hamn_biff',
        truth: message.trim(),
        category: 'kommunikation',
        biffUsed: true,
        entryType: 'simple',
      });
      
      // Dual-write: Om DCAP-data finns (hög risk eller gränser utvärderade), notera i evolution_ledger
      if (riskScore !== null || gransAnalysis) {
        await saveEvolutionLedger(user.uid, {
          type: 'covert_tactic_detected',
          pillar: 'system',
          levelBefore: 0,
          levelAfter: 0,
          rationale: 'Sparat som bevis från Trygg Hamn via BIFF-triage',
          metadata: {
            riskScore,
            hitlRequired,
            gransDetected: !!gransAnalysis,
            agentName,
          },
        });
      }
      
      setEvidenceSaved(true);
    } catch (err) {
      setPanelError(err instanceof Error ? err.message : 'Bevis kunde inte sparas. Försök igen.');
    } finally {
      setSavingEvidence(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 relative">
        <label className="flex items-center gap-1.5 cursor-pointer text-[11px] text-text-dim hover:text-text mb-1">
          <input
            type="checkbox"
            checked={trainingMode}
            onChange={(e) => setTrainingMode(e.target.checked)}
            className="h-3.5 w-3.5 rounded border-border/40 bg-surface-2/60 accent-accent"
          />
          Grey Rock Träningsläge (Sandbox — ingen sparning)
        </label>
        {step === 1 && (
          <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Klistra in meddelandet för full analys…"
              rows={4}
              className="input-glass text-sm resize-none"
              disabled={loading}
            />
            {shouldShowValvHandoff(message) && <HandoffBox className="mt-1" sourceText={message} />}
            <button 
              type="button" 
              onClick={() => setStep(2)} 
              disabled={!message.trim()} 
              className="btn-pill--accent w-full"
            >
              Nästa: Brusfiltret
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-3 animate-in fade-in slide-in-from-right-2 duration-300">
            <BentoCard glow="blue" className="!p-3">
              <p className="text-xs font-medium text-accent">Steg 2: Brusfiltret</p>
              <p className="mt-1 text-xs text-text-dim">
                Skala bort manipulation och känslobrus. Vad är kärnfrågan?
              </p>
              <textarea
                value={coreQuestion}
                onChange={(e) => setCoreQuestion(e.target.value)}
                placeholder="Den objektiva kärnfrågan är..."
                rows={2}
                className="input-glass text-sm mt-3 resize-none"
              />
            </BentoCard>
            <div className="flex gap-2">
              <button type="button" onClick={() => setStep(1)} className="btn-pill--secondary flex-1">
                Tillbaka
              </button>
              <button type="button" onClick={() => setStep(3)} className="btn-pill--accent flex-1">
                Nästa: Mål
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-3 animate-in fade-in slide-in-from-right-2 duration-300">
            <BentoCard glow="indigo" className="!p-3">
              <p className="text-xs font-medium text-accent">Steg 3: Ditt mål</p>
              <p className="mt-1 text-xs text-text-dim">
                Vad vill du uppnå med denna interaktion?
              </p>
              <textarea
                value={userGoal}
                onChange={(e) => setUserGoal(e.target.value)}
                placeholder="Mitt mål med analysen är..."
                rows={2}
                className="input-glass text-sm mt-3 resize-none"
              />
            </BentoCard>
            <div className="flex gap-2">
              <button type="button" onClick={() => setStep(2)} className="btn-pill--secondary flex-1">
                Tillbaka
              </button>
              <button type="submit" disabled={loading} className="btn-pill--accent flex-1">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                Kör BIFF Triage
              </button>
            </div>
          </div>
        )}
      </form>

      {error || panelError ? (
        <p className="text-sm text-text-muted">{error || panelError}</p>
      ) : null}

      {triageReady && !reply && step === 3 && (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 mt-3">
          <BiffTriagePanel
            grans={gransAnalysis}
            riskScore={riskScore}
            hitlRequired={hitlRequired}
            agentName={agentName}
            theoryWithoutEvidence={theoryWithoutEvidence}
          />
          <button
            type="button"
            onClick={confirmReply}
            className="btn-pill--accent w-full text-sm mt-3"
          >
            Visa Grey Rock-svar
          </button>
        </div>
      )}

      {reply && (
        <BentoCard
          glow="indigo"
          title={`Föreslaget svar${agentName ? ` · ${agentName}` : ''}`}
          className="!px-3 !py-3"
        >
          {hitlRequired && (
            <p className="text-xs text-text-muted">Hög risk — överväg mänsklig uppföljning (HITL).</p>
          )}
          {riskScore !== null && (
            <p className="text-[10px] text-text-dim">Riskpoäng: {riskScore}</p>
          )}
          <p className="mt-2 whitespace-pre-wrap text-sm text-text-muted">{reply}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {!trainingMode ? (
              <>
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
              </>
            ) : (
              <p className="text-[11px] text-gold w-full mb-1">
                Du är i träningsläge. Svaret sparas inte.
              </p>
            )}
            <button type="button" onClick={handleKlar} className="btn-pill--ghost text-xs">
              Klar — rensa
            </button>
          </div>
          {evidenceSaved && (
            <p className="mt-2 text-xs text-success">{SAVED_TO_VAULT_LABEL}.</p>
          )}
          {autosortNote && (
            <p className="mt-2 text-xs text-gold/90" role="status">
              {autosortNote}
            </p>
          )}
        </BentoCard>
      )}
    </div>
  );
}
