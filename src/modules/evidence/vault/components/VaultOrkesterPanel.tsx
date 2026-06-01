/** @locked-ux Valv Orkester — do not remove; see `.context/locked-ux-features.md` */
import { useMemo, useState } from 'react';
import { Loader2, Network } from 'lucide-react';
import { BentoCard } from '@/shared/ui/BentoCard';
import {
  analyzeBiffMessage,
  type GransAnalysis,
} from '../../../family/safeHarbor/api/biffService';
import type { VaultLog } from '../../../core/types/firestore';
import { PRODUCT_AGENTS } from '../constants/productAgents';
import { OrkesterAgentTrio } from './OrkesterAgentTrio';
import { scanTechniquesForLog } from '../utils/vaultPatternScan';

type Props = {
  logs?: (VaultLog & { id: string })[];
};

export function VaultOrkesterPanel({ logs = [] }: Props) {
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

  return (
    <div className="space-y-4">
      <OrkesterAgentTrio />

      <BentoCard
        title="Assistentroller"
        description="Vilka hjälpare som finns"
        icon={<Network className="h-4 w-4" />}
      >
        <ul className="space-y-2">
          {PRODUCT_AGENTS.map((agent) => (
            <li key={agent.id} className="glass-card p-3 text-sm">
              <p className="font-medium text-text">{agent.name}</p>
              <p className="text-xs text-text-dim">
                {agent.role} · {agent.focus}
              </p>
            </li>
          ))}
        </ul>
      </BentoCard>

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

      <BentoCard
        title="Mönstersökning i SMS-tråd"
        description="Klistra in hela tråden — Brusfiltret + DCAP"
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
            {agentName && (
              <p className="text-text-dim">
                Dirigerad av: <span className="text-accent">{agentName}</span>
              </p>
            )}
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
  );
}
