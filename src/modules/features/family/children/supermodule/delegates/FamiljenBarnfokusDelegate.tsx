import { useState } from 'react';
import { Loader2, RefreshCw, Sparkles } from 'lucide-react';
import { TimelineEntry } from '@/core/ui/TimelineEntry';
import { BentoCard } from '@/shared/ui/BentoCard';
import { useEvolutionStore } from '@/core/store/useEvolutionStore';
import {
  barnfokusQuestionsForBracket,
  BARNFOKUS_KIND_LABELS,
  type BarnfokusQuestion,
  type BarnfokusBracket,
} from '../../constants';
import { coerceLogText, formatChildLogDate } from '../../utils/logFieldUtils';
import type { FamiljenDelegateBaseProps } from './familjenDelegateTypes';

function pickQuestion(
  pool: BarnfokusQuestion[],
  seed: number,
  excludeId?: string,
): BarnfokusQuestion {
  const filtered = pool.filter((q) => q.id !== excludeId);
  const list = filtered.length > 0 ? filtered : pool;
  return list[seed % list.length]!;
}

function daySeed(childAlias: string): number {
  const start = new Date(new Date().getFullYear(), 0, 0);
  const dayOfYear = Math.floor((Date.now() - start.getTime()) / 86_400_000);
  const childBump = childAlias === 'Arvid' ? 1 : childAlias === 'Kasper' ? 2 : 0;
  return dayOfYear + childBump;
}

const MEMORY_PREVIEW_MAX = 2;

/**
 * Barnfokus PLAY delegate — låst §12.
 * Shell: FamiljenInputSuperModule BentoCard glow="blue" (Familjen-silo).
 * PLAY-innehåll: glow="green" (låst §12) — flat OD delegate, ingen nested card-chrome.
 */
export function FamiljenBarnfokusDelegate({ shell, onSaved }: FamiljenDelegateBaseProps) {
  const childAlias = shell.activeChild;
  const memoryRows = shell.barnfokusMemory ?? [];
  const onSave = shell.handleSaveBarnfokus;

  // Bracket från evolution_hub — filtrerar barnfokus-pool per ålder (våg 29)
  const getChildBracket = useEvolutionStore((s) => s.getChildBracket);
  const bracket = getChildBracket(childAlias) as BarnfokusBracket | undefined;
  const pool = barnfokusQuestionsForBracket(bracket);

  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [question, setQuestion] = useState<BarnfokusQuestion>(() =>
    pickQuestion(pool, daySeed(childAlias)),
  );

  const kindLabel = BARNFOKUS_KIND_LABELS[question.kind];
  const previewRows = memoryRows.slice(0, MEMORY_PREVIEW_MAX);
  const hiddenCount = Math.max(0, memoryRows.length - MEMORY_PREVIEW_MAX);

  const handleSave = async () => {
    const text = answer.trim();
    if (!text) return;
    setLoading(true);
    setError(null);
    try {
      const logId = await onSave(text, question);
      setAnswer('');
      onSaved?.(logId);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : '';
      if (msg.includes('Offline')) {
        setError('Du är offline. Denna stund kunde inte sparas just nu.');
      } else {
        setError('Kunde inte spara just nu. Försök igen.');
      }
    } finally {
      setLoading(false);
    }
  };

  const anotherQuestion = () => {
    setQuestion(pickQuestion(pool, daySeed(childAlias) + Math.floor(Math.random() * 97), question.id));
  };

  return (
    <BentoCard
      glow="green"
      className="barnfokus-fragan-panel !border-x-0 !border-t-0 !bg-transparent !p-0 !shadow-none hover:!shadow-none [&>div]:flex [&>div]:flex-col [&>div]:gap-4"
    >
      <div className="od-depth__banner flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="od-depth__bento-icon !mb-0 !h-8 !w-8">
            <Sparkles className="h-3.5 w-3.5" />
          </span>
          <div>
            <p className="od-depth__bento-label">Barnfokus</p>
            <p className="text-xs text-text-dim">Dagens fråga — trygg hamn, inte bevis</p>
          </div>
        </div>
        <span className="od-depth__kind-chip">{kindLabel}</span>
      </div>

      <div className="od-depth__question-card">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={anotherQuestion}
            className="inline-flex items-center gap-1 text-xs text-text-dim transition-colors hover:text-accent"
          >
            <RefreshCw className="h-3 w-3" />
            Annan fråga
          </button>
        </div>
        <p className="mt-2 text-sm font-medium leading-relaxed text-accent">{question.text}</p>
        {question.hint ? (
          <p className="mt-1 text-xs text-text-dim">{question.hint}</p>
        ) : null}
      </div>

      <textarea
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder={`${childAlias}s svar — rakt av, med barnets egna ord…`}
        rows={3}
        className="od-depth__field"
      />

      <div className="od-depth__cta-wrap relative z-10 !mt-0">
        <button
          type="button"
          onClick={handleSave}
          disabled={loading || !answer.trim()}
          className="od-depth__cta w-full disabled:cursor-not-allowed disabled:opacity-45"
        >
          <span className="od-depth__cta-glow" aria-hidden />
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          Spara till {childAlias}s logg
        </button>
      </div>

      {error ? <p className="text-sm text-danger">{error}</p> : null}

      <div className="od-depth__memory-panel shrink-0">
        <p className="od-depth__bento-label mb-2">Minneslista</p>
        {memoryRows.length === 0 ? (
          <p className="text-xs text-text-dim">
            Inga sparade svar ännu. Ett svar dyker upp här direkt.
          </p>
        ) : (
          <>
            <ul className="space-y-2">
              {previewRows.map((row, index) => (
                <li key={row.id || `barnfokus-mem-${index}`}>
                  <TimelineEntry
                    as="div"
                    body={coerceLogText(row.observation ?? row.truth)}
                    meta={`barnfokus · ${formatChildLogDate(row.createdAt, 'nyss')}`}
                  />
                </li>
              ))}
            </ul>
            {hiddenCount > 0 ? (
              <p className="mt-2 text-[10px] uppercase tracking-wider text-text-dim">
                +{hiddenCount} till i loggen
              </p>
            ) : null}
          </>
        )}
      </div>
    </BentoCard>
  );
}
