/** @locked MOD-FAM-HAMN — låst modul; unlock via docs/evaluations/*-unlock-MOD-FAM-HAMN.md */
import { useState, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/design-system';
import { Loader2, Shield, AlertTriangle, Sparkles } from 'lucide-react';
import { BentoCard } from '@/shared/ui/BentoCard';
import { EmptyState } from '@/core/ui/EmptyState';
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
import { HAMN_POST_COPY_CALM, HAMN_UPLOAD_HINT } from '../hamnCopy';

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
    <div className="familjen-tab-surface space-y-3">
      {fromSpeglar && (
        <p className="text-xs text-text-muted">
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
              aria-label="Meddelande till BIFF-analys"
              className={[
                'input-glass min-h-28 resize-none text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent/55',
                jadeViolations.length > 0 ? 'border-danger/30 focus:border-danger/50' : '',
              ].join(' ')}
              aria-invalid={jadeViolations.length > 0 || Boolean(error || panelError)}
              disabled={loading}
            />

            {/* —— REALTIME JADE DETECTOR BAR —— */}
            {jadeViolations.length > 0 && (
              <div
                className="space-y-2.5 rounded-xl border border-danger/20 bg-danger/5 p-3.5"
                role="alert"
              >
                <div className="flex items-center gap-1.5 text-xs font-semibold text-danger">
                  <AlertTriangle className="h-4 w-4 shrink-0" aria-hidden />
                  <span>Varning: Detekterade JADE-mönster</span>
                </div>
                <ul className="space-y-1.5 text-xs text-text-muted">
                  {jadeViolations.map((v, i) => (
                    <li key={i} className="leading-relaxed">
                      <strong className="text-text">{v.label}:</strong> {v.description}
                    </li>
                  ))}
                </ul>
                <p className="text-[11px] leading-relaxed text-text-muted">
                  Grey Rock: kort, sakligt, endast logistik. Ingen förklaring, inget försvar.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="accent"
                    onClick={handleCleanToGreyRock}
                    className="flex min-h-11 items-center gap-1.5 px-3 text-[11px]"
                  >
                    <Sparkles className="h-3.5 w-3.5" aria-hidden />
                    Städa till Grey Rock-mall
                  </Button>
                  {jadeUndoText !== null ? (
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={handleUndoGreyRock}
                      className="min-h-11 px-3 text-[11px]"
                    >
                      Ångra städning
                    </Button>
                  ) : null}
                </div>
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
            
            <Button 
              type="button" 
              variant="accent"
              onClick={() => setStep(2)} 
              disabled={!message.trim()} 
              className="min-h-11 w-full"
            >
              Nästa: Brusfiltret
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-3 animate-in fade-in slide-in-from-right-2 duration-300">
            <BentoCard glow="blue" className="!p-3">
              <p className="text-xs font-medium text-accent">Steg 2: Brusfiltret</p>
              <p className="mt-1 text-xs text-text-muted">
                Skala bort manipulation, anklagelser och lögner. Vad är den rent logistiska eller faktiska frågan? (t.ex. "När hämtar du barnen?")
              </p>
              <textarea
                value={coreQuestion}
                onChange={(e) => setCoreQuestion(e.target.value)}
                placeholder="Den objektiva kärnfrågan är..."
                rows={2}
                className="input-glass mt-3 resize-none text-sm"
              />
            </BentoCard>
            <div className="flex gap-2">
              <Button type="button" variant="secondary" onClick={() => setStep(1)} className="min-h-11 flex-1">
                Tillbaka
              </Button>
              <Button type="button" variant="accent" onClick={() => setStep(3)} className="min-h-11 flex-1">
                Nästa: Mål
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-3 animate-in fade-in slide-in-from-right-2 duration-300">
            <BentoCard glow="indigo" className="!p-3">
              <p className="text-xs font-medium text-accent">Steg 3: Ditt mål</p>
              <p className="mt-1 text-xs text-text-muted">
                Vad vill du uppnå med svaret? (t.ex. "Skydda min tid", "Dokumentera för Valvet", "Bara säga nej")
              </p>
              <textarea
                value={userGoal}
                onChange={(e) => setUserGoal(e.target.value)}
                placeholder="Mitt mål med svaret är..."
                rows={2}
                className="input-glass mt-3 resize-none text-sm"
              />
            </BentoCard>
            <div className="flex gap-2">
              <Button type="button" variant="secondary" onClick={() => setStep(2)} className="min-h-11 flex-1">
                Tillbaka
              </Button>
              <Button type="submit" variant="accent" disabled={loading} className="min-h-11 flex-1">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
                Få Grey Rock-svar
              </Button>
            </div>
          </div>
        )}
      </form>

      {error || panelError ? (
        <p
          role="alert"
          className="rounded-lg border border-accent/25 bg-accent/10 px-3 py-2 text-sm text-accent-light"
        >
          {error || panelError}
        </p>
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
          <p className="mt-2 text-[11px] text-text-muted">
            Grey Rock-tips: svara bara på kärnfrågan. Datum och logistik — inget JADE.
          </p>
          <Button
            type="button"
            variant="accent"
            onClick={confirmReply}
            className="mt-3 min-h-11 w-full text-sm"
          >
            Visa Grey Rock-svar
          </Button>
        </div>
      )}

      {!triageReady && !reply && !loading && !error && !message.trim() && step === 1 && (
        <div className="space-y-2">
          <EmptyState
            className="!p-3"
            message="Tomt fält — klistra in meddelandet. Inget sparas förrän du trycker Klar."
            action={
              <Link
                to={vaultDrawerPath('hamn_analys')}
                className="inline-flex min-h-11 items-center text-sm text-accent underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent/55"
              >
                Valv → Hamn · Analys
              </Link>
            }
          />
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
            <Button
              type="button"
              variant="accent"
              onClick={() => void handleCopyReply()}
              className="min-h-11 text-xs"
            >
              {copyCopied ? 'Kopierat ✓' : 'Kopiera svar'}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={handleKlar}
              className="min-h-11 text-xs"
              aria-label="Klar — rensa session (Zero Footprint)"
            >
              Klar — rensa
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => void handleAutosortToArkiv()}
              disabled={autosorting || !message.trim()}
              className="min-h-11 text-xs"
              aria-describedby="hamn-upload-hint"
            >
              {autosorting ? <Loader2 className="h-3 w-3 animate-spin" aria-hidden /> : null}
              Sortera till arkiv
            </Button>
          </div>
          <p id="hamn-upload-hint" className="mt-2 text-[11px] leading-relaxed text-text-muted" role="note">
            {HAMN_UPLOAD_HINT}
          </p>
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
        <label className="mb-1 flex min-h-11 cursor-pointer items-center gap-2 text-[11px] text-text-muted hover:text-text">
          <input
            type="checkbox"
            checked={trainingMode}
            onChange={(e) => setTrainingMode(e.target.checked)}
            className="h-4 w-4 rounded border-border/40 bg-surface-2/60 accent-accent"
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
              aria-label="Meddelande för Hamn-analys"
              className="input-glass resize-none text-sm"
              disabled={loading}
            />
            {shouldShowValvHandoff(message) && <HandoffBox className="mt-1" sourceText={message} />}
            <Button
              type="button"
              variant="accent"
              onClick={() => setStep(2)}
              disabled={!message.trim()}
              className="min-h-11 w-full"
            >
              Nästa: Brusfiltret
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-3 animate-in fade-in slide-in-from-right-2 duration-300">
            <BentoCard glow="blue" className="!p-3">
              <p className="text-xs font-medium text-accent">Steg 2: Brusfiltret</p>
              <p className="mt-1 text-xs text-text-muted">
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
              <Button type="button" variant="secondary" onClick={() => setStep(1)} className="min-h-11 flex-1">
                Tillbaka
              </Button>
              <Button type="button" variant="accent" onClick={() => setStep(3)} className="min-h-11 flex-1">
                Nästa: Mål
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-3 animate-in fade-in slide-in-from-right-2 duration-300">
            <BentoCard glow="indigo" className="!p-3">
              <p className="text-xs font-medium text-accent">Steg 3: Ditt mål</p>
              <p className="mt-1 text-xs text-text-muted">
                Vad vill du uppnå med denna interaktion?
              </p>
              <textarea
                value={userGoal}
                onChange={(e) => setUserGoal(e.target.value)}
                placeholder="Mitt mål med analysen är..."
                rows={2}
                aria-label="Mål med Hamn-analys"
                className="input-glass mt-3 resize-none text-sm"
              />
            </BentoCard>
            <div className="flex gap-2">
              <Button type="button" variant="secondary" onClick={() => setStep(2)} className="min-h-11 flex-1">
                Tillbaka
              </Button>
              <Button type="submit" variant="accent" disabled={loading} className="min-h-11 flex-1">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
                Kör BIFF Triage
              </Button>
            </div>
          </div>
        )}
      </form>

      {error || panelError ? (
        <p
          role="alert"
          className="rounded-lg border border-accent/25 bg-accent/10 px-3 py-2 text-sm text-accent-light"
        >
          {error || panelError}
        </p>
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
          <Button
            type="button"
            variant="accent"
            onClick={confirmReply}
            className="mt-3 min-h-11 w-full text-sm"
          >
            Visa Grey Rock-svar
          </Button>
        </div>
      )}

      {reply && (
        <BentoCard
          glow="indigo"
          title={`Föreslaget svar${agentName ? ` · ${agentName}` : ''}`}
          className="!px-3 !py-3"
        >
          {hitlRequired && (
            <p className="mb-2 text-xs leading-relaxed text-text-muted" role="note">
              Hög risk — överväg mänsklig uppföljning (HITL).
            </p>
          )}
          {riskScore !== null && (
            <p className="text-[10px] text-text-muted">Riskpoäng: {riskScore}</p>
          )}
          <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-text-muted">{reply}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {!trainingMode ? (
              <>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => void handleAutosortToArkiv()}
                  disabled={autosorting || !message.trim()}
                  className="flex min-h-11 items-center gap-2 text-xs"
                  aria-describedby="hamn-forensic-upload-hint"
                >
                  {autosorting ? <Loader2 className="h-3 w-3 animate-spin" aria-hidden /> : null}
                  Sortera till arkiv
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleSaveAsEvidence}
                  disabled={savingEvidence || !user}
                  className="flex min-h-11 items-center gap-2 text-xs"
                >
                  {savingEvidence ? (
                    <Loader2 className="h-3 w-3 animate-spin" aria-hidden />
                  ) : (
                    <Shield className="h-3 w-3" aria-hidden />
                  )}
                  Spara som bevis
                </Button>
              </>
            ) : (
              <p className="mb-1 w-full text-[11px] leading-relaxed text-gold">
                Du är i träningsläge. Svaret sparas inte.
              </p>
            )}
            <Button
              type="button"
              variant="ghost"
              onClick={handleKlar}
              className="min-h-11 text-xs"
              aria-label="Klar — rensa session (Zero Footprint)"
            >
              Klar — rensa
            </Button>
          </div>
          {!trainingMode ? (
            <p id="hamn-forensic-upload-hint" className="mt-2 text-[11px] leading-relaxed text-text-muted" role="note">
              {HAMN_UPLOAD_HINT}
            </p>
          ) : null}
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
