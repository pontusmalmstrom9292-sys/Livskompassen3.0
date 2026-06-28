import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, Search, Shield } from 'lucide-react';
import { BentoCard } from '@/shared/ui/BentoCard';
import { callChildrenLogsQuery, type ChildrenLogCitation } from '../../api/childrenLogsService';
import type { ChildAlias } from '../../constants';

type Props = {
  activeChild: ChildAlias;
};

export function FamiljenKunskapHubTab({ activeChild }: Props) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [answer, setAnswer] = useState<string | null>(null);
  const [childCitations, setChildCitations] = useState<ChildrenLogCitation[]>([]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;

    setLoading(true);
    setError(null);
    setAnswer(null);
    setChildCitations([]);

    try {
      const result = await callChildrenLogsQuery(q, activeChild);
      setAnswer(result.answer);
      setChildCitations(result.citations ?? []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Sökningen misslyckades.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="familjen-kunskap-panel">
      <BentoCard
        title="Barnloggar"
        description={`Sök i livsloggar för ${activeChild}`}
        icon={<Search className="h-4 w-4" />}
      >
        <form onSubmit={(e) => void handleSearch(e)} className="mt-4 flex flex-col gap-3">
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            rows={3}
            className="input-glass"
            placeholder={`T.ex. Hur har ${activeChild}s sömn varit?`}
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="ds-btn ds-btn--accent inline-flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            Sök och analysera
          </button>
        </form>

        {error && <p className="mt-2 text-sm text-danger">{error}</p>}

        {answer && (
          <div className="mt-4 rounded-2xl border border-border-subtle bg-surface/50 p-4">
            <p className="whitespace-pre-wrap text-sm text-text-muted">{answer}</p>
          </div>
        )}

        {childCitations.length > 0 && (
          <ul className="mt-3 space-y-2">
            {childCitations.map((c, i) => (
              <li key={i} className="text-xs text-text-dim">
                Barnlogg · {c.date} · {c.excerpt.slice(0, 80)}…
              </li>
            ))}
          </ul>
        )}
      </BentoCard>
      </div>

      <div className="flex items-start gap-2 rounded-2xl border border-gold/20 bg-gold/5 p-3">
        <Shield className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
        <p className="text-xs text-text-dim">
          Barnloggar hålls i sin egen silo (Barnen). För anteckningar, använd Kunskapsvalvet, och för arkivbevis, använd{' '}
          <Link to="/valvet" className="text-accent hover:underline">
            Valv → Sök
          </Link>.
        </p>
      </div>
    </div>
  );
}
