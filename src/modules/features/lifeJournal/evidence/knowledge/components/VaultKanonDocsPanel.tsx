import type { ComponentProps } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { BookOpen, ScrollText } from 'lucide-react';
import { ButtonLink } from '@/design-system';
import { CalmCollapsible } from '@/core/ui/CalmCollapsible';
import { vaultDrawerPath } from '@/core/navigation/navTruth';
import {
  VALV_KANON_CONTENT_MD,
  VALV_KANON_DOMAIN_MD,
  VALV_KANON_ROUTING_MD,
  VALV_KANON_SILOS_MD,
  VALV_KANON_WORM_MD,
} from '../content/valvKanonDocsContent';
import { VAULT_MAIN_TAB_LABELS, VALV_KUNSKAP_DRAWER_LEAF } from '@/core/copy/valvNavCopy';

const markdownComponents = {
  p: ({ ...props }: ComponentProps<'p'>) => (
    <p className="mb-2 last:mb-0 text-sm leading-relaxed text-text-muted" {...props} />
  ),
  ul: ({ ...props }: ComponentProps<'ul'>) => (
    <ul className="mb-2 list-disc space-y-1 pl-5 text-sm text-text-muted last:mb-0" {...props} />
  ),
  ol: ({ ...props }: ComponentProps<'ol'>) => (
    <ol className="mb-2 list-decimal space-y-1 pl-5 text-sm text-text-muted last:mb-0" {...props} />
  ),
  li: ({ ...props }: ComponentProps<'li'>) => <li {...props} />,
  strong: ({ ...props }: ComponentProps<'strong'>) => (
    <strong className="font-semibold text-text" {...props} />
  ),
  h2: ({ ...props }: ComponentProps<'h2'>) => (
    <h2 className="mb-2 font-display text-sm tracking-[0.12em] text-accent uppercase" {...props} />
  ),
  table: ({ ...props }: ComponentProps<'table'>) => (
    <div className="mb-2 overflow-x-auto rounded-xl border border-border/60">
      <table className="w-full min-w-[280px] text-left text-xs" {...props} />
    </div>
  ),
  thead: ({ ...props }: ComponentProps<'thead'>) => (
    <thead className="border-b border-border/60 bg-surface-3/40 text-text-muted" {...props} />
  ),
  th: ({ ...props }: ComponentProps<'th'>) => <th className="px-3 py-2 font-medium" {...props} />,
  td: ({ ...props }: ComponentProps<'td'>) => (
    <td className="border-t border-border/40 px-3 py-2 text-text-muted" {...props} />
  ),
  code: ({ ...props }: ComponentProps<'code'>) => (
    <code className="rounded bg-surface-3/60 px-1 py-0.5 font-mono text-[0.7rem] text-accent-light" {...props} />
  ),
};

function KanonMarkdown({ content }: { content: string }) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
      {content}
    </ReactMarkdown>
  );
}

/** A2.7 — primär: routing-guide. Sekundär: silos, WORM, domän, innehåll (CalmCollapsible). */
export function VaultKanonDocsPanel() {
  return (
    <div className="valv-zone-stack space-y-4">
      <section className="calm-card glow-bottom-blue rounded-2xl border border-border p-4">
        <div className="mb-3 flex items-start gap-3">
          <div className="rounded-xl border border-accent/25 bg-accent/10 p-2">
            <ScrollText className="h-4 w-4 text-accent" aria-hidden />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="font-display text-base text-text">{VAULT_MAIN_TAB_LABELS.docs}</h2>
            <p className="mt-0.5 text-xs text-text-muted">
              {VALV_KUNSKAP_DRAWER_LEAF.docs} · statisk referens bakom PIN (ingen RAG)
            </p>
          </div>
        </div>

        <ButtonLink
          to={vaultDrawerPath('kunskapsbank')}
          variant="ghost"
          size="sm"
          className="mb-4 inline-flex items-center gap-2"
        >
          <BookOpen className="h-3 w-3" />
          Till Kunskapsbank
        </ButtonLink>

        <KanonMarkdown content={VALV_KANON_ROUTING_MD} />
      </section>

      <CalmCollapsible title="Tre silos (U1)" meta="Kunskap · Valv · Barnen">
        <KanonMarkdown content={VALV_KANON_SILOS_MD} />
      </CalmCollapsible>

      <CalmCollapsible title="WORM & bevis" meta="Append-only · beteende + datum">
        <KanonMarkdown content={VALV_KANON_WORM_MD} />
      </CalmCollapsible>

      <CalmCollapsible title="Domän — covert HCF" meta="Routing ~80% inkast">
        <KanonMarkdown content={VALV_KANON_DOMAIN_MD} />
      </CalmCollapsible>

      <CalmCollapsible title="Innehåll (U6)" meta="FACT · REFLECTION · EVIDENCE">
        <KanonMarkdown content={VALV_KANON_CONTENT_MD} />
      </CalmCollapsible>
    </div>
  );
}
