import type { KnowledgeVaultCitation } from '../api/knowledgeVaultService';

type Props = {
  citations: KnowledgeVaultCitation[];
  onCitationClick?: (docId: string, collection: KnowledgeVaultCitation['collection']) => void;
};

const COLLECTION_LABEL: Record<KnowledgeVaultCitation['collection'], string> = {
  kampspar: 'Minne',
  kb_docs: 'Dokument',
};

export function KnowledgeCitationList({ citations, onCitationClick }: Props) {
  if (citations.length === 0) return null;

  return (
    <div className="space-y-2 border-t border-border pt-4">
      <p className="text-[10px] uppercase tracking-widest text-success">Källor</p>
      {citations.map((c) => {
        const clickable = Boolean(onCitationClick);
        const actionHint =
          c.collection === 'kampspar'
            ? ' · öppna i Tidshjulet'
            : c.collection === 'kb_docs'
              ? ' · visa dokument'
              : '';

        return (
          <button
            key={`${c.collection}-${c.docId}`}
            type="button"
            onClick={() => onCitationClick?.(c.docId, c.collection)}
            disabled={!clickable}
            className="w-full rounded-xl border border-border bg-surface/40 p-3 text-left transition-colors hover:border-accent/30 disabled:cursor-default disabled:opacity-90"
          >
            <p className="text-xs font-medium text-text">
              {c.title} · {c.date}
            </p>
            <p className="mt-1 text-[10px] uppercase tracking-wider text-text-dim">
              {COLLECTION_LABEL[c.collection]} · {c.docId.slice(0, 8)}…
              {clickable ? actionHint : ''}
            </p>
            <p className="mt-1 line-clamp-3 text-sm text-text-muted">{c.excerpt}</p>
          </button>
        );
      })}
    </div>
  );
}
