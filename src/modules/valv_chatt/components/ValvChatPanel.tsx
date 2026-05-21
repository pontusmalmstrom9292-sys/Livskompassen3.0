import { BentoCard } from '../../core/ui/BentoCard';
import { useValvChatSession } from '../hooks/useValvChatSession';

type ValvChatPanelProps = {
  /** Zero Footprint: rensa session när false (låsning / byte från Sök). */
  active: boolean;
};

export function ValvChatPanel({ active }: ValvChatPanelProps) {
  const { question, setQuestion, answer, citations, loading, error, submit } =
    useValvChatSession(active);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void submit(question);
  };

  return (
    <BentoCard title="Sök i Valvet" description="Fråga mot dina WORM-bevis">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="T.ex. När sa hen att jag inte hämtade barnen?"
          rows={3}
          className="input-glass text-accent"
          disabled={loading}
        />
        <button type="submit" disabled={loading || !question.trim()} className="btn-pill--secondary self-end">
          {loading ? 'Söker…' : 'Sök'}
        </button>
      </form>

      {loading && (
        <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-surface/50">
          <div className="h-full w-1/3 animate-pulse rounded-full bg-indigo-400/80" />
        </div>
      )}

      {error && <p className="mt-4 text-sm text-danger">{error}</p>}

      {answer && (
        <div className="glass-card mt-6 space-y-4 p-6">
          <div>
            <h3 className="mb-2 font-display text-sm font-semibold uppercase tracking-widest text-text-dim">
              Svar
            </h3>
            <p className="whitespace-pre-wrap text-sm text-text-muted">{answer}</p>
          </div>

          {citations.length > 0 && (
            <div>
              <h3 className="mb-2 font-display text-sm font-semibold uppercase tracking-widest text-success">
                Källor
              </h3>
              <ul className="space-y-2">
                {citations.map((c) => (
                  <li key={c.docId} className="rounded-lg border border-success/20 bg-success/5 p-3">
                    <p className="text-xs text-success">
                      {c.date || 'datum saknas'} · {c.docId.slice(0, 8)}…
                    </p>
                    <p className="mt-1 text-sm text-text-muted">{c.excerpt}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </BentoCard>
  );
}
