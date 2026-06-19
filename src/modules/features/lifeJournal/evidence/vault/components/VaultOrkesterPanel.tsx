/** @locked-ux Valv Orkester — do not remove; see `.context/locked-ux-features.md` */
import { useCallback, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Copy, Filter, Loader2, Shield } from 'lucide-react';
import { ModuleHelpFromRegistry } from '@/core/help/ModuleHelpFromRegistry';
import { BentoCard } from '@/shared/ui/BentoCard';
import { AgentRoutingBadge } from '@/shared/agents/components/AgentRoutingBadge';
import {
  analyzeBiffMessage,
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
          : 'border-border/40 bg-surface-2/50 text-text-dim'
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
      const result = await analyzeBiffMessage(thread);
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

  const handleTrioAgentAction = useCallback(
    (agentId: string) => {
      if (agentId === 'agent_sannings_analytikern') {
        navigate('/valvet?vaultTab=sok');
        return;
      }
      if (agentId === 'agent_brusfiltret' || agentId === 'agent_biff_skolden') {
        brusfilterRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    },
    [navigate],
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <ModuleHelpFromRegistry moduleId="valv_orkester" />
      </div>
      <OrkesterAgentTrio onAgentAction={handleTrioAgentAction} />

      <div ref={brusfilterRef} id="orkester-brusfilter">
      <BentoCard
        title="P1 Brusfilter"
        description="Rå inkommande meddelande — logistik och BIFF utan JADE"
        icon={<Filter className="h-4 w-4" />}
        glow="gold"
      >
        <p className="mb-3 text-sm text-text-muted">
          Klistra in sms eller mejl. Brusfiltret extraherar ren logistik (~10 %) och föreslår ett kort
          Grey Rock-svar. Inget sparas automatiskt.
        </p>
        <textarea
          value={rawInput}
          onChange={(e) => setRawInput(e.target.value.slice(0, RAW_INPUT_MAX))}
          placeholder="Klistra in meddelande från motparten…"
          maxLength={RAW_INPUT_MAX}
          disabled={brusLoading}
          className="input-glass min-h-[120px] w-full resize-y rounded-xl px-3 py-2 text-sm"
          aria-label="Rå inkommande meddelande"
        />
        <div className="mt-1 flex items-center justify-between gap-2">
          <p className="text-[10px] uppercase tracking-widest text-text-dim">
            {rawInput.length}/{RAW_INPUT_MAX}
          </p>
          <button
            type="button"
            onClick={() => void handleBrusfilter()}
            disabled={brusLoading || !rawInput.trim()}
            className="btn-pill--accent inline-flex items-center gap-2 disabled:opacity-50"
          >
            {brusLoading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
            Filtrera bort brus
          </button>
        </div>

        {brusLoading && (
          <p className="mt-3 flex items-center gap-2 text-sm text-text-dim" role="status">
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
                <p className="text-[10px] uppercase tracking-widest text-text-dim">
                  Eskaleringsrisk — svara kort, ingen JADE
                </p>
              )}
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <BentoCard
                title="Isolerad Logistik (10%)"
                glow="gold"
                className="!p-4"
                noHover
              >
                <p className="whitespace-pre-wrap text-sm text-text-muted">
                  {brusResult.isolated_logistics.trim() || 'Ingen ren logistik extraherad.'}
                </p>
              </BentoCard>

              <BentoCard
                title="Färdigt BIFF Svarsförslag"
                glow="gold"
                className="!p-4"
                noHover
              >
                <p className="whitespace-pre-wrap text-sm text-text">
                  {brusResult.biff_draft_reply}
                </p>
                <button
                  type="button"
                  onClick={() => void handleCopyReply()}
                  className="btn-pill--ghost mt-3 inline-flex items-center gap-1.5 text-xs"
                >
                  {copiedReply ? (
                    <Check className="h-3 w-3 text-success" aria-hidden />
                  ) : (
                    <Copy className="h-3 w-3" aria-hidden />
                  )}
                  {copiedReply ? 'Kopierad' : 'Kopiera text'}
                </button>
              </BentoCard>
            </div>
          </div>
        )}
      </BentoCard>
      </div>

      <section aria-labelledby="vault-orkester-assistentroller">
        <h3 id="vault-orkester-assistentroller" className="sr-only">
          Assistentroller
        </h3>
        <AdkAgentRegistryPanel />
      </section>

      {registeredDocs.length > 0 && (
        <BentoCard title="Registrerade dokument" description="SMS, mejl, myndighet">
          <ul className="space-y-2">
            {registeredDocs.map((log) => {
              const tags = scanTechniquesForLog(log);
              return (
                <li key={log.id} className="glass-card p-3 text-sm">
                  <p className="text-[10px] uppercase tracking-widest text-text-dim">
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
        </BentoCard>
      )}

      <div id="orkester-monstersokning">
      <BentoCard
        title="Mönstersökning i SMS-tråd"
        description="Klistra in hela tråden — Brusfiltret + DCAP"
        glow="gold"
      >
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
        <button
          type="button"
          onClick={handleScan}
          disabled={loading || !thread.trim()}
          className="btn-pill--accent mt-3 disabled:opacity-50"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          Kör mönstersökning
        </button>
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
                <p className="text-xs uppercase tracking-widest text-text-dim">Taktiker</p>
                <ul className="mt-1 list-inside list-disc text-text-muted">
                  {grans.techniques.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </div>
            ) : null}
            {grans?.cleanFacts?.length ? (
              <div>
                <p className="text-xs uppercase tracking-widest text-text-dim">Rena fakta</p>
                <ul className="mt-1 list-inside list-disc text-text-muted">
                  {grans.cleanFacts.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
              </div>
            ) : null}
            {grans?.emotionalBait?.length ? (
              <div>
                <p className="text-xs uppercase tracking-widest text-text-dim">Känslomässigt bete</p>
                <ul className="mt-1 list-inside list-disc text-text-muted">
                  {grans.emotionalBait.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        )}
      </BentoCard>
      </div>
    </div>
  );
}
