import { useState } from 'react';
import { Button } from '@/design-system';
import { MessageCircle } from 'lucide-react';
import { BentoCard } from '@/shared/ui/BentoCard';
import { EmptyState } from '@/core/ui/EmptyState';
import { callChildrenLogsQuery, type ChildrenLogCitation } from '../api/childrenLogsService';
import type { ChildAlias } from '../constants';
import { RAGErrorBoundary } from '@/shared/ui/RAGErrorBoundary';

type ChildrenLogsChatProps = {
  activeChild: ChildAlias;
};

export function ChildrenLogsChat({ activeChild }: ChildrenLogsChatProps) {
  const [inputText, setInputText] = useState('');
  const [answer, setAnswer] = useState<string | null>(null);
  const [citations, setCitations] = useState<ChildrenLogCitation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const q = inputText.trim();
    if (!q) return;

    setLoading(true);
    setError(null);
    setAnswer(null);
    setCitations([]);

    try {
      const result = await callChildrenLogsQuery(q, activeChild);
      setAnswer(result.answer);
      setCitations(result.citations ?? []);
      setInputText('');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Frågan kunde inte besvaras.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <RAGErrorBoundary fallbackTitle="Nätverksfel i Barnloggar" glow="blue">
      <BentoCard
        glow="blue"
        title="Fråga livsloggarna"
        description={`Mönster-Arkivarien · endast ${activeChild}`}
        icon={<MessageCircle className="h-4 w-4" />}
      >
        <p className="mb-3 text-xs text-text-muted">
          Neutral dokumentation — inte Valv-ton. Läser endast children_logs.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="T.ex. Hur har sömnen varit senaste veckan?"
            rows={3}
            className="input-glass"
            disabled={loading}
          />
          <Button type="submit" variant="secondary" disabled={loading || !inputText.trim()}>
            {loading ? 'Söker…' : 'Ställ fråga'}
          </Button>
        </form>
        {error && <p className="mt-2 text-sm text-danger">{error}</p>}
        {!answer && !loading && !error && (
          <EmptyState message={`Ställ en fråga om ${activeChild}s livslogg — t.ex. sömn eller humör senaste veckan.`} />
        )}
        {answer && (
          <div className="mt-4 space-y-2">
            <p className="text-sm text-text-muted whitespace-pre-wrap">{answer}</p>
            {citations.length > 0 && (
              <ul className="space-y-1 border-t border-border-strong pt-2">
                {citations.map((c) => (
                  <li key={c.docId} className="text-xs text-text-muted">
                    {c.childAlias} · {c.date} — {String(c.excerpt ?? '').slice(0, 80)}
                    {String(c.excerpt ?? '').length > 80 ? '…' : ''}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </BentoCard>
    </RAGErrorBoundary>
  );
}
