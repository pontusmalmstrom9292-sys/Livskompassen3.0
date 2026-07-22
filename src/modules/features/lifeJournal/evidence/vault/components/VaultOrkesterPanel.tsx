/** @locked MOD-VALV-ORKESTER — låst modul; unlock via docs/evaluations/*-unlock-MOD-VALV-ORKESTER.md
 * @locked-ux Valv Orkester — do not remove; see `.context/locked-ux-features.md` */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Copy, Filter, Loader2, Shield } from 'lucide-react';
import { Button } from '@/design-system';
import { ModuleHelpFromRegistry } from '@/core/help/ModuleHelpFromRegistry';
import { BentoCard } from '@/shared/ui/BentoCard';
import { CalmCollapsible } from '@/core/ui/CalmCollapsible';
import { AgentRoutingBadge } from '@/shared/agents/components/AgentRoutingBadge';
import { AgentRegistryProvider } from '@/shared/agents/hooks/useAgentRegistry';
import {
  analyzeBiffMessageInVault,
  type GransAnalysis,
} from '@/features/family/safeHarbor/api/biffService';
import type { VaultLog } from '@/core/types/firestore';
import { AdkAgentRegistryPanel } from './AdkAgentRegistryPanel';
import { OrkesterAgentTrio } from './OrkesterAgentTrio';
import { scanTechniquesForLog } from '../utils/vaultPatternScan';
import {
  callProcessBrusfilter,
  type ProcessBrusfilterResult,
} from '../api/processBrusfilterService';
import { HandoffBox } from '@/features/lifeJournal/diary/diary/components/HandoffBox';
import { VALV_ORKESTER_NO_AUTO_WORM, VALV_SILO_NO_CROSS_RAG } from '../constants/valvEvidenceCopy';

const RAW_INPUT_MAX = 8000;

type Props = {
  logs?: (VaultLog & { id: string })[];
};

function BrusfilterRiskBadge({
  riskScore,
  recommendedAction,
}: {
  riskScore: number;
  recommendedAction: ProcessBrusfilterResult['dcap_analysis']['recommended_action'];
}) {
  const isWarning = recommendedAction === 'VARNING';
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] uppercase tracking-widest ${
        isWarning
          ? 'border-accent/35 bg-surface-3/60 text-accent/90'
          : 'border-border/40 bg-surface-2/50 text-text-muted'
      }`}
      aria-label={`DCAP riskpoäng ${riskScore}`}
    >
      <Shield className="h-3 w-3 shrink-0 opacity-80" aria-hidden />
      DCAP {riskScore}/100
      {isWarning ? ' · Varning' : ''}
    </span>
  );
}

export function VaultOrkesterPanel({ logs = [] }: Props) {
  const navigate = useNavigate();
  const brusfilterRef = useRef<HTMLDivElement>(null);
  const brusfilterInputRef = useRef<HTMLTextAreaElement>(null);

  const [rawInput, setRawInput] = useState('');
  const [brusLoading, setBrusLoading] = useState(false);
  const [brusError, setBrusError] = useState<string | null>(null);
  const [brusResult, setBrusResult] = useState<ProcessBrusfilterResult | null>(null);
  const [copiedReply, setCopiedReply] = useState(false);

  const [thread, setThread] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [grans, setGrans] = useState<GransAnalysis | null>(null);
  const [riskScore, setRiskScore] = useState<number | null>(null);
  const [agentName, setAgentName] = useState<string | null>(null);

  const registeredDocs = useMemo(
    () =>
      logs
        .filter((log) =>
          /sms|mejl|kommunikation|myndighet|dokument/i.test(
            `${log.category ?? ''} ${log.action ?? ''}`,
          ),
        )
        .slice(0, 8),
    [logs],
  );

  useEffect(() => {
    return () => {
      setRawInput('');
      setBrusResult(null);
      setThread('');
      setGrans(null);
      setRiskScore(null);
      setAgentName(null);
      setBrusError(null);
      setError(null);
    };
  }, []);

  const handleBrusfilter = async () => {
    const text = rawInput.trim();
    if (!text) return;
    setBrusLoading(true);
    setBrusError(null);
    setBrusResult(null);
    setCopiedReply(false);
    try {
      const result = await callProcessBrusfilter(text);
      setBrusResult(result);
    } catch (err) {
      setBrusError(err instanceof Error ? err.message : 'Brusfilter misslyckades.');
    } finally {
      setBrusLoading(false);
    }
  };

  const handleCopyReply = async () => {
    if (!brusResult?.biff_draft_reply) return;
    try {
      await navigator.clipboard.writeText(brusResult.biff_draft_reply);
      setCopiedReply(true);
      window.setTimeout(() => setCopiedReply(false), 2000);
    } catch {
      setBrusError('Kunde inte kopiera till urklipp.');
    }
  };

  const handleScan = async () => {
    if (!thread.trim()) return;
    setLoading(true);
    setError(null);
    setGrans(null);
    setRiskScore(null);
    setAgentName(null);
    try {
      const result = await analyzeBiffMessageInVault(thread);
      setGrans(result.data?.gransAnalysis ?? null);
      setRiskScore(result.dcap?.riskScore ?? null);
      setAgentName(result.data?.agentName ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Mönstersökning misslyckades.');
    } finally {
      setLoading(false);
    }
  };

  const showBrusWarningBorder = brusResult?.dcap_analysis.recommended_action === 'VARNING';

  const brusHandoffText = useMemo(() => {
    if (!brusResult) return undefined;
    const parts = [
      'Källa: Orkester Brusfilter',
      brusResult.isolated_logistics?.trim()
        ? `Logistik: ${brusResult.isolated_logistics.trim()}`
        : null,
      brusResult.biff_draft_reply?.trim()
        ? `BIFF-förslag: ${brusResult.biff_draft_reply.trim()}`
        : null,
    ].filter(Boolean);
    return parts.length > 1 ? parts.join('\n') : undefined;
  }, [brusResult]);

  const threadHandoffText = useMemo(() => {
    if (!grans && riskScore == null) return undefined;
    const parts = [
      'Källa: SMS-mönstersökning (Orkester)',
      thread.trim() ? `Tråd: ${thread.trim().slice(0, 2000)}` : null,
      grans?.techniques?.length ? `Taktiker: ${grans.techniques.join(', ')}` : null,
      grans?.cleanFacts?.length ? `Rena fakta: ${grans.cleanFacts.join(', ')}` : null,
      riskScore != null ? `DCAP: ${riskScore}/100` : null,
    ].filter(Boolean);
    return parts.length > 1 ? parts.join('\n') : undefined;
  }, [grans, riskScore, thread]);

  const handleTrioAgentAction = useCallback(
    (agentId: string) => {
      if (agentId === 'agent_sannings_analytikern') {
        navigate('/valvet?vaultTab=sok');
        return;
      }
      if (agentId === 'agent_brusfiltret' || agentId === 'agent_biff_skolden') {
        brusfilterRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        window.setTimeout(() => brusfilterInputRef.current?.focus(), 350);
      }
    },
    [navigate],
  );

  return (
    <AgentRegistryProvider>
    <div className="valv-zone-stack space-y-4">
      <div className="flex justify-end">
        <ModuleHelpFromRegistry moduleId="valv_orkester" />
      </div>
      <OrkesterAgentTrio onAgentAction={handleTrioAgentAction} />
      <p className="valv-silo-notice">{VALV_ORKESTER_NO_AUTO_WORM}</p>
      <p className="valv-silo-notice">{VALV_SILO_NO_CROSS_RAG}</p>

      <CalmCollapsible
        title="P1 Brusfilter"
        meta="Logistik och BIFF"
        defaultOpen={true}
        glow="blue"
        unmountOnHide={false}
      >
        <div ref={brusfilterRef} id="orkester-brusfilter">
          <BentoCard
            description="Rå inkommande meddelande — logistik och BIFF utan JADE"
            icon={<Filter className="h-4 w-4" />}
            glow="blue"
          >
        <p className="mb-3 text-sm text-text-muted">
          Klistra in sms eller mejl. Brusfiltret extraherar ren logistik (~10 %) och föreslår ett kort
          Grey Rock-svar. Inget sparas automatiskt.
        </p>
        <textarea
          ref={brusfilterInputRef}
          value={rawInput}
          onChange={(e) => setRawInput(e.target.value.slice(0, RAW_INPUT_MAX))}
          placeholder="Klistra in meddelande från motparten…"
          maxLength={RAW_INPUT_MAX}
          disabled={brusLoading}
          className="input-glass min-h-[120px] w-full resize-y rounded-xl px-3 py-2 text-sm"
          aria-label="Rå inkommande meddelande"
        />
        <div className="mt-1 flex items-center justify-between gap-2">
          <p className="text-[10px] uppercase tracking-widest text-text-muted">
            {rawInput.length}/{RAW_INPUT_MAX}
          </p>
          <Button
            type="button"
            variant="accent"
            className="inline-flex min-h-11 items-center gap-2 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
            onClick={() => void handleBrusfilter()}
            disabled={brusLoading || !rawInput.trim()}
          >
            {brusLoading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
            Filtrera bort brus
          </Button>
        </div>

        {brusLoading && (
          <p className="mt-3 flex items-center gap-2 text-sm text-text-muted" role="status">
            <Loader2 className="h-4 w-4 animate-spin shrink-0" aria-hidden />
            Bearbetar med Brusfilter…
          </p>
        )}

        {brusError && (
          <p className="mt-3 text-sm text-danger" role="alert">
            {brusError}
          </p>
        )}

        {brusResult && !brusLoading && (
          <div
            className={`mt-4 space-y-3 pt-4 ${
              showBrusWarningBorder
                ? 'rounded-xl border border-accent/20 bg-surface-2/30 p-3'
                : 'border-t border-border/30'
            }`}
          >
            <div className="flex flex-wrap items-center gap-2">
              <BrusfilterRiskBadge
                riskScore={brusResult.dcap_analysis.risk_score}
                recommendedAction={brusResult.dcap_analysis.recommended_action}
              />
              <AgentRoutingBadge
                productAgentName="Brusfiltret"
                executorName="Gräns-Arkitekten"
              />
              {showBrusWarningBorder && (
                <p className="text-[10px] uppercase tracking-widest text-text-muted">
                  Eskaleringsrisk — svara kort, ingen JADE
                </p>
              )}
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <BentoCard
                title="Isolerad Logistik (10%)"
                glow="blue"
                className="!p-4"
                noHover
              >
                <p className="whitespace-pre-wrap text-sm text-text-muted">
                  {brusResult.isolated_logistics.trim() || 'Ingen ren logistik extraherad.'}
                </p>
              </BentoCard>

              <BentoCard
                title="Färdigt BIFF Svarsförslag"
                glow="blue"
                className="!p-4"
                noHover
              >
                <p className="whitespace-pre-wrap text-sm text-text">
                  {brusResult.biff_draft_reply}
                </p>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="mt-3 inline-flex min-h-11 items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
                  onClick={() => void handleCopyReply()}
                >
                  {copiedReply ? (
                    <Check className="h-3 w-3 text-success" aria-hidden />
                  ) : (
                    <Copy className="h-3 w-3" aria-hidden />
                  )}
                  {copiedReply ? 'Kopierad' : 'Kopiera text'}
                </Button>
              </BentoCard>
            </div>
          </div>
        )}
        {brusHandoffText ? <HandoffBox sourceText={brusHandoffText} className="mt-4" /> : null}
          </BentoCard>
        </div>
      </CalmCollapsible>

      <CalmCollapsible title="ADK & assistentroller" meta="Registry" defaultOpen={false} glow="blue">
        <section aria-labelledby="vault-orkester-assistentroller">
          <h3 id="vault-orkester-assistentroller" className="sr-only">
            Assistentroller
          </h3>
          <AdkAgentRegistryPanel />
        </section>
      </CalmCollapsible>

      {registeredDocs.length > 0 && (
        <CalmCollapsible
          title="Registrerade dokument"
          meta={`${registeredDocs.length} poster`}
          defaultOpen={false}
          glow="blue"
        >
          <ul className="space-y-2">
            {registeredDocs.map((log) => {
              const tags = scanTechniquesForLog(log);
              return (
                <li key={log.id} className="calm-card glow-bottom-blue border border-border/30 p-3 text-sm">
                  <p className="text-[10px] uppercase tracking-widest text-text-muted">
                    {log.category ?? 'dokument'} · {(log.createdAt ?? '').slice(0, 10)}
                  </p>
                  <p className="mt-1 line-clamp-2 text-text-muted">
                    {(log.truth ?? '').slice(0, 120) || '—'}
                  </p>
                  {tags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-accent/20 px-2 py-0.5 text-[10px] text-accent/80"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </CalmCollapsible>
      )}

      <CalmCollapsible title="Mönstersökning i SMS-tråd" meta="BIFF + DCAP" defaultOpen={false} glow="blue">
      <div id="orkester-monstersokning">
        <p className="mb-3 text-sm text-text-muted">
          Exportera gärna hela tråden som text/PDF först (iMazing/Decipher). Kör sedan sökning
          här — resultatet är vägledning, inte dom.
        </p>
        <textarea
          value={thread}
          onChange={(e) => setThread(e.target.value)}
          placeholder="Klistra in sms-tråden här…"
          rows={8}
          className="input-glass rounded-xl px-3 py-2"
          disabled={loading}
        />
        <Button
          type="button"
          variant="accent"
          className="mt-3 disabled:opacity-50 min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
          onClick={handleScan}
          disabled={loading || !thread.trim()}
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          Kör mönstersökning
        </Button>
        {error && <p className="mt-2 text-sm text-danger">{error}</p>}

        {(riskScore != null || grans) && (
          <div className="mt-4 space-y-3 border-t border-border-strong pt-4 text-sm">
            <AgentRoutingBadge agentName={agentName ?? 'Gräns-Arkitekten'} />
            {riskScore != null && (
              <p>
                DCAP riskpoäng: <span className="text-accent">{riskScore}</span>/100
              </p>
            )}
            {grans?.techniques?.length ? (
              <div>
                <p className="text-xs uppercase tracking-widest text-text-muted">Taktiker</p>
                <ul className="mt-1 list-inside list-disc text-text-muted">
                  {grans.techniques.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </div>
            ) : null}
            {grans?.cleanFacts?.length ? (
              <div>
                <p className="text-xs uppercase tracking-widest text-text-muted">Rena fakta</p>
                <ul className="mt-1 list-inside list-disc text-text-muted">
                  {grans.cleanFacts.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
              </div>
            ) : null}
            {grans?.emotionalBait?.length ? (
              <div>
                <p className="text-xs uppercase tracking-widest text-text-muted">Känslomässigt bete</p>
                <ul className="mt-1 list-inside list-disc text-text-muted">
                  {grans.emotionalBait.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        )}
        {threadHandoffText ? <HandoffBox sourceText={threadHandoffText} className="mt-4" /> : null}
      </div>
      </CalmCollapsible>
    </div>
    </AgentRegistryProvider>
  );
}
