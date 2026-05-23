/** @locked-ux Middagsfrågan — do not remove; see `.context/locked-ux-features.md` */
import { useMemo, useState } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import { BentoCard } from '../../core/ui/BentoCard';
import { TimelineEntry } from '../../core/ui/TimelineEntry';
import { EmptyState } from '../../core/ui/EmptyState';
import { middagsQuestionForToday, type ChildAlias } from '../constants';
import type { ChildrenLogEntry } from '../types';

type Props = {
  childAlias: ChildAlias;
  memoryRows: ChildrenLogEntry[];
  onSave: (observation: string) => Promise<string>;
};

export function MiddagsfraganPanel({ childAlias, memoryRows, onSave }: Props) {
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const question = useMemo(() => middagsQuestionForToday(), []);

  const handleSave = async () => {
    const text = answer.trim();
    if (!text) return;
    setLoading(true);
    setError(null);
    try {
      await onSave(text);
      setAnswer('');
    } catch {
      setError('Kunde inte spara just nu. Försök igen.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <BentoCard
      title="Middagsfrågan"
      description="Roliga, lekfulla svar — trygg hamn, inte bevis mot någon."
      icon={<Sparkles className="h-4 w-4" />}
    >
      <p className="text-sm text-accent">{question}</p>
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

      <div className="mt-5 border-t border-border-strong pt-4">
        <p className="text-xs uppercase tracking-widest text-text-dim">
          Minneslista — {childAlias}
        </p>
        {memoryRows.length === 0 ? (
          <EmptyState message="Inga middagssvar ännu. Ett sparat svar dyker upp här direkt." />
        ) : (
          <ul className="mt-3 space-y-2">
            {memoryRows.map((row) => (
              <li key={row.id}>
                <TimelineEntry
                  as="div"
                  meta={`middag · ${(row.createdAt ?? '').slice(0, 10) || 'nyss'}`}
                  body={row.observation ?? row.truth ?? ''}
                  truncateAt={0}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </BentoCard>
  );
}
