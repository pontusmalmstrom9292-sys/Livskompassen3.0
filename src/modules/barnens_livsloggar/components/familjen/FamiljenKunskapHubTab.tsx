import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, Search, Shield } from 'lucide-react';
import { BentoCard } from '../../../core/ui/BentoCard';
import { callKnowledgeVault, type KnowledgeVaultCitation } from '../../../kompis/api/knowledgeVaultService';
import {
  KunskapsvalvFileIngest,
  type KunskapsvalvUploadedDoc,
} from '../../../kompis/components/KunskapsvalvFileIngest';
import { callValvChat, type ValvChatCitation } from '../../../valv_chatt/api/valvChatService';
import { callChildrenLogsQuery, type ChildrenLogCitation } from '../../api/childrenLogsService';
import type { ChildAlias } from '../../constants';

type SearchMode = 'hela' | 'valv' | 'barn' | 'dokument';

type Props = {
  activeChild: ChildAlias;
};

export function FamiljenKunskapHubTab({ activeChild }: Props) {
  const [mode, setMode] = useState<SearchMode>('hela');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [answer, setAnswer] = useState<string | null>(null);
  const [kvCitations, setKvCitations] = useState<KnowledgeVaultCitation[]>([]);
  const [valvCitations, setValvCitations] = useState<ValvChatCitation[]>([]);
  const [childCitations, setChildCitations] = useState<ChildrenLogCitation[]>([]);
  const [scopedDocs, setScopedDocs] = useState<KunskapsvalvUploadedDoc[]>([]);

  const modes: { id: SearchMode; label: string; hint: string }[] = [
    { id: 'hela', label: 'Hela Minnet', hint: 'kampspar + kb_docs (Kunskapsvalvet)' },
    { id: 'valv', label: 'Valv-Chat', hint: 'reality_vault · WORM-bevis' },
    { id: 'barn', label: 'Barnloggar', hint: `children_logs · ${activeChild}` },
    { id: 'dokument', label: 'Uppladdade filer', hint: 'Senaste filer i denna session' },
  ];

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;

    setLoading(true);
    setError(null);
    setAnswer(null);
    setKvCitations([]);
    setValvCitations([]);
    setChildCitations([]);

    try {
      if (mode === 'hela') {
        const result = await callKnowledgeVault(q);
        setAnswer(result.answer);
        setKvCitations(result.citations ?? []);
      } else if (mode === 'valv') {
        const result = await callValvChat(q);
        setAnswer(result.answer);
        setValvCitations(result.citations ?? []);
      } else if (mode === 'barn') {
        const result = await callChildrenLogsQuery(q, activeChild);
        setAnswer(result.answer);
        setChildCitations(result.citations ?? []);
      } else {
        if (scopedDocs.length === 0) {
          setError('Ladda upp minst en fil nedan — sedan söker du bara mot den.');
          return;
        }
        const ids = scopedDocs.map((d) => d.docId).join(', ');
        const scopedQ = `[Svara med fokus på uppladdade dokument id: ${ids}. Fråga: ${q}]`;
        const result = await callKnowledgeVault(scopedQ);
        setAnswer(result.answer);
        setKvCitations(result.citations ?? []);
      }
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
        title="Kunskapshub"
        description="En ingång — flera silos. Upload går alltid till Kunskapsvalvet."
        icon={<Search className="h-4 w-4" />}
      >
        <div className="flex flex-wrap gap-2">
          {modes.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setMode(m.id)}
              className={`rounded-full border px-3 py-1 text-xs ${
                mode === m.id ? 'chip--active' : 'chip--idle'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
        <p className="mt-2 text-xs text-text-dim">{modes.find((m) => m.id === mode)?.hint}</p>

        <form onSubmit={(e) => void handleSearch(e)} className="mt-4 flex flex-col gap-3">
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            rows={3}
            className="input-glass"
            placeholder={
              mode === 'valv'
                ? 'T.ex. Visa alla poster om överlämning i mars…'
                : mode === 'barn'
                  ? `T.ex. Hur har ${activeChild}s sömn varit?`
                  : 'T.ex. Vad vet vi om skolmatchen och känslorna efteråt?'
            }
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="btn-pill--accent inline-flex items-center justify-center gap-2 disabled:opacity-50"
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

        {kvCitations.length > 0 && (
          <ul className="mt-3 space-y-2">
            {kvCitations.map((c) => (
              <li key={c.docId} className="text-xs text-text-dim">
                <span className="text-accent">{c.collection}</span> · {c.title} · {c.date}
              </li>
            ))}
          </ul>
        )}
        {valvCitations.length > 0 && (
          <ul className="mt-3 space-y-2">
            {valvCitations.map((c) => (
              <li key={c.docId} className="text-xs text-text-dim">
                Valv · {c.date} · {c.excerpt.slice(0, 80)}…
              </li>
            ))}
          </ul>
        )}
        {childCitations.length > 0 && (
          <ul className="mt-3 space-y-2">
            {childCitations.map((c, i) => (
              <li key={i} className="text-xs text-text-dim">
                Barnlogg · {c.excerpt.slice(0, 80)}…
              </li>
            ))}
          </ul>
        )}
      </BentoCard>
      </div>

      <KunskapsvalvFileIngest
        variant="familjen"
        sourceLabel="familjen_hub"
        onIngested={(doc) => setScopedDocs((prev) => [doc, ...prev].slice(0, 8))}
      />

      {scopedDocs.length > 0 && (
        <p className="text-xs text-text-dim">
          Session-filer: {scopedDocs.map((d) => d.title).join(', ')} — välj läge &ldquo;Uppladdade
          filer&rdquo; för fokuserad analys.
        </p>
      )}

      <div className="flex items-start gap-2 rounded-2xl border border-gold/20 bg-gold/5 p-3">
        <Shield className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
        <p className="text-xs text-text-dim">
          Kunskap (Minne) och Valv (bevis) är separata silos. Barnloggar läser aldrig WORM automatiskt.{' '}
          <Link to="/dagbok?tab=bevis" className="text-accent hover:underline">
            Valv → Sök
          </Link>{' '}
          för enskilda bevisfiler med bilaga.
        </p>
      </div>
    </div>
  );
}
