import type { KnowledgeVaultCitation } from '../api/knowledgeVaultService';

type Props = {
  citations: KnowledgeVaultCitation[];
  onCitationClick?: (docId: string, collection: KnowledgeVaultCitation['collection']) => void;
  /** Visuell markering av senast klickad källa (chat → Tidshjul). */
  activeCitationKey?: string | null;
};

const COLLECTION_LABEL: Record<KnowledgeVaultCitation['collection'], string> = {
  kampspar: 'Minne',
  kb_docs: 'Dokument',
};

export function citationKey(collection: string, docId: string): string {
  return `${collection}-${docId}`;
}

export function KnowledgeCitationList({ citations, onCitationClick, activeCitationKey }: Props) {
  if (citations.length === 0) return null;

  return (
    <div className="space-y-2 border-t border-border pt-4">
      <p className="text-[10px] uppercase tracking-widest text-success">Källor</p>
      {citations.map((c) => {
        const clickable = Boolean(onCitationClick);
        const key = citationKey(c.collection, c.docId);
        const isActive = activeCitationKey === key;
        const actionHint =
          c.collection === 'kampspar'
            ? ' · öppna i Tidshjulet'
            : c.collection === 'kb_docs'
              ? ' · visa dokument'
              : '';

        return (
          <button
            key={key}
            type="button"
            onClick={() => onCitationClick?.(c.docId, c.collection)}
            disabled={!clickable}
            className={`w-full rounded-xl border p-3 text-left transition-colors hover:border-accent/30 disabled:cursor-default disabled:opacity-90 ${
              isActive
                ? 'border-accent/60 bg-accent/10 ring-2 ring-accent/40'
                : 'border-border bg-surface/40'
            }`}
          >
            <span className="block text-xs font-medium text-text">
              {c.title} · {c.date}
            </span>
            <span className="mt-1 block text-[10px] uppercase tracking-wider text-text-dim">
              {COLLECTION_LABEL[c.collection]} · {c.docId.slice(0, 8)}…
              {clickable ? actionHint : ''}
            </span>
            <span className="mt-1 block line-clamp-3 text-sm text-text-muted">{c.excerpt}</span>
          </button>
        );
      })}
    </div>
  );
}
