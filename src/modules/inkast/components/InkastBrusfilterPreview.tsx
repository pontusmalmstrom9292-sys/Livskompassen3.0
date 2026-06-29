import { useCallback, useEffect, useState } from 'react';
import { Check, Copy, Filter, Loader2, Shield } from 'lucide-react';
import { BentoCard } from '@/shared/ui/BentoCard';
import {
  callProcessBrusfilter,
  type ProcessBrusfilterResult,
} from '@/features/lifeJournal/evidence/vault/api/processBrusfilterService';

export type InkastBrusfilterAcceptPayload = {
  cleanedText: string;
  logistics: string;
  biffDraft: string;
  result: ProcessBrusfilterResult;
};

type Props = {
  rawText: string;
  onAccept: (payload: InkastBrusfilterAcceptPayload) => void;
  onKeepOriginal: () => void;
  onBack: () => void;
};

function RiskBadge({
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
    >
      <Shield className="h-3 w-3 shrink-0 opacity-80" aria-hidden />
      DCAP {riskScore}/100
      {isWarning ? ' · Varning' : ''}
    </span>
  );
}

function buildCleanedInkastText(logistics: string, rawText: string): string {
  const facts = logistics.trim();
  if (facts) return facts;
  return `Meddelande utan operativ logistik (brusfiltrerat).\n\nOriginal längd: ${rawText.trim().length} tecken.`;
}

export function InkastBrusfilterPreview({ rawText, onAccept, onKeepOriginal, onBack }: Props) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ProcessBrusfilterResult | null>(null);
  const [copiedReply, setCopiedReply] = useState(false);

  const runFilter = useCallback(async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await callProcessBrusfilter(rawText);
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Brusfilter misslyckades.');
    } finally {
      setLoading(false);
    }
  }, [rawText]);

  useEffect(() => {
    void runFilter();
  }, [runFilter]);

  const handleCopyReply = async () => {
    if (!result?.biff_draft_reply) return;
    try {
      await navigator.clipboard.writeText(result.biff_draft_reply);
      setCopiedReply(true);
      window.setTimeout(() => setCopiedReply(false), 2000);
    } catch {
      setCopiedReply(false);
    }
  };

  const handleAccept = () => {
    if (!result) return;
    const logistics = result.isolated_logistics.trim();
    onAccept({
      cleanedText: buildCleanedInkastText(logistics, rawText),
      logistics,
      biffDraft: result.biff_draft_reply,
      result,
    });
  };

  const showWarning = result?.dcap_analysis.recommended_action === 'VARNING';

  return (
    <div className="space-y-3">
      <BentoCard
        title="Brusfilter — förhandsgranskning"
        description="Inget sparas förrän du godkänner i nästa steg"
        icon={<Filter className="h-4 w-4" />}
        glow="gold"
        noHover
      >
        <p className="mb-3 text-sm text-text-muted">
          Rensad text går vidare till AI-sortering och ditt manuella godkännande — inte automatiskt till
          arkivet.
        </p>

        {loading && (
          <p className="flex items-center gap-2 py-3 text-sm text-text-dim" role="status">
            <Loader2 className="h-4 w-4 animate-spin shrink-0" aria-hidden />
            Filtrerar brus…
          </p>
        )}

        {error && (
          <div className="space-y-3">
            <p className="text-sm text-danger" role="alert">
              {error}
            </p>
            <div className="flex flex-wrap gap-2">
              <button type="button" className="ds-btn ds-btn--ghost text-sm" onClick={() => void runFilter()}>
                Försök igen
              </button>
              <button type="button" className="ds-btn ds-btn--secondary text-sm" onClick={onKeepOriginal}>
                Hoppa över — original
              </button>
              <button type="button" className="ds-btn ds-btn--ghost text-sm" onClick={onBack}>
                Tillbaka
              </button>
            </div>
          </div>
        )}

        {result && !loading && (
          <div
            className={`space-y-3 ${showWarning ? 'rounded-xl border border-accent/20 bg-surface-2/30 p-3' : ''}`}
          >
            <RiskBadge
              riskScore={result.dcap_analysis.risk_score}
              recommendedAction={result.dcap_analysis.recommended_action}
            />

            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-xl border border-border/30 bg-surface-2/50 p-3">
                <p className="mb-1 text-[10px] uppercase tracking-widest text-text-dim">
                  Isolerad logistik
                </p>
                <p className="whitespace-pre-wrap text-sm text-text-muted">
                  {result.isolated_logistics.trim() || 'Ingen ren logistik extraherad.'}
                </p>
              </div>
              <div className="rounded-xl border border-border/30 bg-surface-2/50 p-3">
                <p className="mb-1 text-[10px] uppercase tracking-widest text-text-dim">
                  BIFF-utkast (ej skickat)
                </p>
                <p className="whitespace-pre-wrap text-sm text-text">{result.biff_draft_reply}</p>
                <button
                  type="button"
                  onClick={() => void handleCopyReply()}
                  className="ds-btn ds-btn--ghost mt-2 inline-flex items-center gap-1.5 text-xs"
                >
                  {copiedReply ? (
                    <Check className="h-3 w-3 text-success" aria-hidden />
                  ) : (
                    <Copy className="h-3 w-3" aria-hidden />
                  )}
                  {copiedReply ? 'Kopierad' : 'Kopiera svar'}
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
              <button type="button" className="ds-btn ds-btn--accent text-sm" onClick={handleAccept}>
                Fortsätt med rensad text
              </button>
              <button type="button" className="ds-btn ds-btn--secondary text-sm" onClick={onKeepOriginal}>
                Behåll original
              </button>
              <button type="button" className="ds-btn ds-btn--ghost text-sm" onClick={onBack}>
                Tillbaka
              </button>
            </div>
          </div>
        )}
      </BentoCard>
    </div>
  );
}
