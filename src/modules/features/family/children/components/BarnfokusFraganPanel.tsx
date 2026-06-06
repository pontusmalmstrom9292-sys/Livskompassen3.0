/** @locked-ux Barnfokus-frågor (ev. Middagsfrågan) — `.context/locked-ux-features.md` */
import { useState } from 'react';
import { Loader2, RefreshCw, Sparkles } from 'lucide-react';
import { BentoCard } from '@/shared/ui/BentoCard';
import { TimelineEntry } from '@/core/ui/TimelineEntry';
import { EmptyState } from '@/core/ui/EmptyState';
import {
  barnfokusQuestionForToday,
  BARNFOKUS_KIND_LABELS,
  type BarnfokusQuestion,
  type ChildAlias,
} from '../constants';
import type { ChildrenLogEntry } from '../types';
import { coerceLogText, formatChildLogDate } from '../utils/logFieldUtils';

type Props = {
  childAlias: ChildAlias;
  memoryRows: ChildrenLogEntry[];
  onSave: (observation: string, question: BarnfokusQuestion) => Promise<string>;
};

export function BarnfokusFraganPanel({ childAlias, memoryRows, onSave }: Props) {
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [question, setQuestion] = useState<BarnfokusQuestion>(() =>
    barnfokusQuestionForToday(childAlias),
  );

  const kindLabel = BARNFOKUS_KIND_LABELS[question.kind];

  const handleSave = async () => {
    const text = answer.trim();
    if (!text) return;
    setLoading(true);
    setError(null);
    try {
      await onSave(text, question);
      setAnswer('');
    } catch {
      setError('Kunde inte spara just nu. Försök igen.');
    } finally {
      setLoading(false);
    }
  };

  const anotherQuestion = () => {
    setQuestion(barnfokusQuestionForToday(childAlias, new Date(), question.id));
  };

  return (
    <BentoCard
      title="Barnfokus — dagens fråga"
      description="Roligt, knas, kunskap eller lära känna — trygg hamn, inte bevis."
      icon={<Sparkles className="h-4 w-4" />}
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full border border-accent/30 px-2 py-0.5 text-[0.65rem] uppercase tracking-wider text-accent">
          {kindLabel}
        </span>
        <button
          type="button"
          onClick={anotherQuestion}
          className="inline-flex items-center gap-1 text-xs text-text-dim hover:text-accent"
        >
          <RefreshCw className="h-3 w-3" />
          Annan fråga
        </button>
      </div>
      <p className="mt-2 text-sm text-accent">{question.text}</p>
      {question.hint ? (
        <p className="mt-1 text-xs text-text-dim">{question.hint}</p>
      ) : null}
      <textarea
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder={`${childAlias}s svar — rakt av, med barnets egna ord…`}
        rows={3}
        className="input-glass mt-3 rounded-xl px-3 py-2"
      />
      <button
        type="button"
        onClick={handleSave}
        disabled={loading || !answer.trim()}
        className="btn-pill--accent mt-3 disabled:opacity-50"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        Spara till {childAlias}s logg
      </button>
      {error && <p className="mt-2 text-sm text-danger">{error}</p>}

      <div className="mt-4 border-t border-border-subtle pt-3">
        <p className="mb-2 text-xs font-medium uppercase tracking-wider text-text-dim">
          Minneslista
        </p>
        {memoryRows.length === 0 ? (
          <EmptyState message="Inga sparade svar ännu. Ett svar dyker upp här direkt." />
        ) : (
          <ul className="space-y-2">
            {memoryRows.map((row, index) => (
              <li key={row.id || `barnfokus-mem-${index}`}>
                <TimelineEntry
                  as="div"
                  body={coerceLogText(row.observation ?? row.truth)}
                  meta={`barnfokus · ${formatChildLogDate(row.createdAt, 'nyss')}`}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </BentoCard>
  );
}

/** @deprecated use BarnfokusFraganPanel — behålls för import/smoke under migration */
