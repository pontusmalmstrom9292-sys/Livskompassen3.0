import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, Send, Sparkles } from 'lucide-react';
import { Button, TextArea } from '@/design-system';
import { callChildrenLogsQuery, type ChildrenLogCitation } from '@/features/family/children/api/childrenLogsService';
import type { ChildAlias } from '@/features/family/children/constants';
import { RAGErrorBoundary } from '@/shared/ui/RAGErrorBoundary';

type Props = {
  activeChild?: ChildAlias;
};

export function ExecutiveLivsloggCard({ activeChild = 'Kasper' }: Props) {
  const navigate = useNavigate();
  const [inputText, setInputText] = useState('');
  const [answer, setAnswer] = useState<string | null>(null);
  const [citations, setCitations] = useState<ChildrenLogCitation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAsk = async () => {
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
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Frågan kunde inte besvaras.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <RAGErrorBoundary fallbackTitle="Nätverksfel i Barnloggar" glow="gold">
      <article className="calm-card exec-home-card exec-home-card--livslogg relative">
        <header className="exec-home-card__head">
          <MessageCircle className="h-4 w-4 text-accent" strokeWidth={1.5} />
          <div className="min-w-0">
            <p className="exec-home-label mb-0">FRÅGA LIVSLOGGARNA</p>
            <p className="mt-0.5 text-[9px] uppercase tracking-wider text-text-muted">
              Mönster-arkivarien · endast {activeChild}
            </p>
          </div>
        </header>
        <TextArea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="T.ex. Hur har sömnen varit senaste veckan?"
          rows={2}
          className="exec-home-input mt-3 w-full resize-none"
          disabled={loading}
        />
        <div className="mt-3 flex flex-wrap gap-2">
          <Button
            size="sm"
            className="inline-flex items-center gap-1.5 min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
            disabled={loading || !inputText.trim()}
            onClick={() => void handleAsk()}
          >
            <Sparkles className="h-3.5 w-3.5" />
            {loading ? 'Söker…' : 'Fråga'}
          </Button>
          <Button variant="ghost" size="sm" className="min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40" onClick={() => navigate('/familjen?tab=livslogg')}>
            Utforska
          </Button>
        </div>
        {error ? <p className="mt-2 text-xs text-danger">{error}</p> : null}
        {answer ? (
          <p className="mt-3 text-xs leading-relaxed text-text-muted line-clamp-4">{answer}</p>
        ) : null}
        {citations.length > 0 ? (
          <p className="mt-1 text-[10px] text-text-muted">{citations.length} källor i livslogg</p>
        ) : null}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="exec-livslogg-fab inline-flex min-h-11 min-w-11 items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent/55"
          aria-label="Skicka fråga"
          disabled={loading || !inputText.trim()}
          onClick={() => void handleAsk()}
        >
          <Send className="h-4 w-4" strokeWidth={1.5} />
        </Button>
      </article>
    </RAGErrorBoundary>
  );
}
