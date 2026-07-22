import { useEffect, useRef, useState } from 'react';
import { Brain, ExternalLink, FileText, Loader2, Send, Sparkles, User, X } from 'lucide-react';
import { Button, Modal, buttonClassName } from '@/design-system';
import { CalmCollapsible } from '@/core/ui/CalmCollapsible';
import { VAVAREN_VALVCHAT_HINT } from '../../vault/constants/vavarenCopy';
import { VALV_SILO_NO_CROSS_RAG } from '../../vault/constants/valvEvidenceCopy';
import type { ValvChatCitation } from '../api/valvChatService';
import { useValvChatSession, type ValvChatMessage } from '../hooks/useValvChatSession';
import type { VaultLog } from '@/core/types/firestore';
import { RAGErrorBoundary } from '@/shared/ui/RAGErrorBoundary';
import { TheoryWithoutEvidenceBadge } from '@/shared/ui/TheoryWithoutEvidenceBadge';
import { EmptyState } from '@/core/ui/EmptyState';
import { SanningsAnalytikernHeader } from './SanningsAnalytikernHeader';
import { AgentResponseFooter } from '@/shared/agents/components/AgentResponseFooter';
import { VaultWormEvidenceStamp } from '../../vault/components/VaultWormEvidenceStamp';

const EXAMPLE_QUESTIONS = [
  'När sa hen att jag inte hämtade barnen?',
  'Vilka sms nämner hämtningstider?',
  'Finns mönster av tyst straff i arkivet?',
] as const;

type ValvChatPanelProps = {
  active: boolean;
  onCitationClick?: (docId: string) => void;
  logs?: (VaultLog & { id: string })[];
};

function renderTextWithCitations(
  text: string,
  citations?: ValvChatCitation[],
  onCitationClick?: (docId: string) => void
) {
  if (!citations || citations.length === 0 || !onCitationClick) return text;

  // Dela texten på mönstret [1], [2], etc.
  const parts = text.split(/(\[\d+\])/g);
  return parts.map((part, i) => {
    const match = part.match(/\[(\d+)\]/);
    if (match) {
      const index = parseInt(match[1], 10) - 1;
      const citation = citations[index];
      if (citation) {
        return (
          <button
            key={i}
            type="button"
            onClick={() => onCitationClick(citation.docId)}
            className="inline-flex min-h-11 min-w-11 items-center justify-center mx-0.5 rounded border border-success/30 bg-success/10 px-1 py-0.5 text-[10px] font-bold text-success transition-colors hover:bg-success/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 cursor-pointer"
            title="Granska källan"
          >
            {part}
          </button>
        );
      }
    }
    return <span key={i}>{part}</span>;
  });
}

function CitationList({
  citations,
  onCitationClick,
}: {
  citations: ValvChatCitation[];
  onCitationClick?: (docId: string) => void;
}) {
  if (!citations.length) return null;
  return (
    <div className="mt-3 space-y-2 border-t border-border pt-3">
      <p className="text-[10px] uppercase tracking-widest text-success">Källor (låsta poster)</p>
      <ul className="space-y-2">
        {citations.map((c) => (
          <li key={c.docId}>
            <button
              type="button"
              onClick={() => onCitationClick?.(c.docId)}
              className="w-full cursor-pointer rounded-lg border border-success/20 bg-success/5 p-2 text-left hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
            >
              <span className="block text-[10px] text-success">
                {c.date || 'datum saknas'} · {(c.docId ?? 'okänd').slice(0, 8)}… · Granska källa
              </span>
              <span className="mt-1 block text-xs text-text-muted">{c.excerpt}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ChatBubble({
  msg,
  onCitationClick,
}: {
  msg: ValvChatMessage;
  onCitationClick?: (docId: string) => void;
}) {
  const isUser = msg.role === 'user';
  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex max-w-[88%] gap-2 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        <div
          className={`mt-auto flex h-8 w-8 shrink-0 items-center justify-center rounded-full border ${
            isUser ? 'border-border bg-surface/80' : 'border-accent-secondary/30 bg-accent-secondary/15'
          }`}
        >
          {isUser ? <User className="h-4 w-4 text-text-muted" /> : <Sparkles className="h-4 w-4 text-accent-secondary" />}
        </div>
        <div
          className={`rounded-[1.25rem] px-4 py-3 ${
            isUser
              ? 'rounded-br-sm bg-surface/90 text-text'
              : 'rounded-bl-sm calm-card border border-border text-text-muted'
          }`}
        >
          <div className="whitespace-pre-wrap text-sm leading-relaxed">
            {renderTextWithCitations(msg.text, msg.citations, onCitationClick)}
          </div>
          {msg.role === 'assistant' && msg.theoryWithoutEvidence && <TheoryWithoutEvidenceBadge />}
          {msg.role === 'assistant' && (
            <AgentResponseFooter
              productAgentName="Sannings-Analytikern"
              executorName="Gräns-Arkitekten"
            />
          )}
          {msg.role === 'assistant' && msg.citations && (
            <CitationList citations={msg.citations} onCitationClick={onCitationClick} />
          )}
          <span className="mt-2 block text-right text-[9px] text-text-muted">{msg.timestamp}</span>
        </div>
      </div>
    </div>
  );
}

function ValvChatExtendedHints({
  onPickExample,
}: {
  onPickExample: (question: string) => void;
}) {
  return (
    <div className="space-y-3 text-xs text-text-muted">
      <p>{VAVAREN_VALVCHAT_HINT}</p>
      <p>{VALV_SILO_NO_CROSS_RAG}</p>
      <p>Källor länkas till låsta poster i Logga. Inget chattminne sparas efter stäng — Zero Footprint.</p>
      <div>
        <p className="mb-2 font-medium uppercase tracking-wider text-text-muted">Exempelfrågor</p>
        <ul className="space-y-2">
          {EXAMPLE_QUESTIONS.map((q) => (
            <li key={q}>
              <button
                type="button"
                className="min-h-11 w-full rounded-lg border border-border bg-surface-2/60 px-3 py-2 text-left text-text-muted transition-colors hover:border-accent/30 hover:bg-surface-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
                onClick={() => onPickExample(q)}
              >
                {q}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/** A2.2 — primär: chatt. Sekundär: tips & exempelfrågor (CalmCollapsible). */
export function ValvChatPanel({ active, onCitationClick, logs = [] }: ValvChatPanelProps) {
  const { draft, setDraft, messages, loading, error, submit } = useValvChatSession(active);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [previewLog, setPreviewLog] = useState<(VaultLog & { id: string }) | null>(null);

  useEffect(() => {
    if (messages.length === 0 && !loading) return;
    const timer = window.setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 80);
    return () => window.clearTimeout(timer);
  }, [messages, loading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void submit(draft);
  };

  const handleSourceClick = (docId: string) => {
    const matchedLog = logs.find((l) => l.id === docId);
    if (matchedLog) {
      setPreviewLog(matchedLog);
    } else if (onCitationClick) {
      onCitationClick(docId);
    }
  };

  return (
    <RAGErrorBoundary fallbackTitle="Nätverksfel i Valv-Chat" glow="blue">
      <div className="valv-chat-panel space-y-4">
        <SanningsAnalytikernHeader />

        <section className="calm-card glow-bottom-blue rounded-2xl border border-border p-4">
          <div className="flex max-h-[min(52vh,28rem)] min-h-[12rem] flex-col overflow-y-auto rounded-2xl border border-border bg-surface/40 p-3">
            {messages.length === 0 && !loading && (
              <div className="flex flex-1 flex-col items-center justify-center py-6 text-center">
                <Brain className="mb-3 h-8 w-8 text-accent-secondary/60" aria-hidden />
                <EmptyState message="Ställ en fråga mot dina säkrade poster — inget sparas efter stäng." />
              </div>
            )}
            <div className="space-y-4">
              {messages.map((msg) => (
                <ChatBubble key={msg.id} msg={msg} onCitationClick={handleSourceClick} />
              ))}
              {loading && (
                <div className="calm-card flex items-center gap-2 rounded-2xl px-4 py-3 text-sm text-text-muted">
                  <Loader2 className="h-4 w-4 animate-spin text-accent-secondary" /> Söker i arkivet…
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {error && <p className="mt-3 text-sm text-danger">{error}</p>}

          <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="T.ex. När sa hen att jag inte hämtade barnen?"
              rows={2}
              className="input-glass min-h-0 flex-1 resize-none text-accent"
              disabled={loading}
            />
            <Button
              type="submit"
              variant="secondary"
              size="icon"
              className="flex shrink-0 items-center gap-1 self-end"
              disabled={loading || !draft.trim()}
              aria-label="Skicka fråga"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </section>

        <CalmCollapsible title="Tips & exempelfrågor" meta="Valv-silo" defaultOpen={false} glow="blue">
          <ValvChatExtendedHints onPickExample={setDraft} />
        </CalmCollapsible>

        <Modal
          open={Boolean(previewLog)}
          onClose={() => setPreviewLog(null)}
          hideHeader
          ariaLabel="Källgranskning — låst post"
          className="!z-[250] !bg-black/75 !backdrop-blur-sm"
          panelClassName="relative w-full max-w-lg max-h-[85vh] overflow-y-auto !rounded-2xl !border !border-accent/25 !bg-surface-2 !p-5 shadow-accent-glow"
        >
          {previewLog ? (
            <>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-4 top-4 rounded-full border border-border bg-bg"
                onClick={() => setPreviewLog(null)}
                aria-label="Stäng källgranskning"
              >
                <X className="h-4 w-4" />
              </Button>

              <div className="mb-4 flex items-center gap-2 border-b border-border pb-3">
                <FileText className="h-4 w-4 text-accent" />
                <div>
                  <h3 className="text-sm font-semibold text-accent">Källgranskning · Låst post</h3>
                  <p className="text-[9px] uppercase tracking-wider text-text-muted">ID: {previewLog.id}</p>
                </div>
              </div>

              <VaultWormEvidenceStamp createdAt={previewLog.createdAt} />

              <div className="space-y-3.5 text-sm">
                <div className="grid grid-cols-2 gap-2 text-[10px] uppercase tracking-widest text-text-muted">
                  <div>
                    <span>Kategori</span>
                    <p className="mt-0.5 font-semibold text-text">{previewLog.category ?? 'allmänt'}</p>
                  </div>
                  <div>
                    <span>Server-tidsstämpel</span>
                    <p className="mt-0.5 font-semibold text-text">
                      {previewLog.createdAt ? previewLog.createdAt.slice(0, 19).replace('T', ' ') : '—'}
                    </p>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] uppercase tracking-widest text-text-muted">Låst sanning</span>
                  <div className="mt-1 max-h-64 overflow-y-auto rounded-xl border border-border-strong bg-surface/40 p-3.5">
                    <p className="select-all whitespace-pre-wrap leading-relaxed text-text-muted">
                      {previewLog.truth}
                    </p>
                  </div>
                </div>

                {previewLog.myReality && (
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <div className="rounded-lg border border-border bg-surface-3/30 p-3">
                      <span className="text-[9px] uppercase tracking-widest text-text-muted">Hens version</span>
                      <p className="mt-1 text-xs text-text-muted">{previewLog.theirVersion || '—'}</p>
                    </div>
                    <div className="rounded-lg border border-accent/20 bg-accent/5 p-3">
                      <span className="text-[9px] uppercase tracking-widest text-accent-light">Min verklighet</span>
                      <p className="mt-1 text-xs text-text">{previewLog.myReality}</p>
                    </div>
                  </div>
                )}

                {previewLog.evidenceUrl && (
                  <div className="flex items-center justify-between rounded-xl border border-border-strong bg-surface/20 p-2.5">
                    <span className="text-xs text-text-muted">📎 Bifogat bevisdokument</span>
                    <a
                      href={previewLog.evidenceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={buttonClassName('ghost', 'sm', 'inline-flex items-center gap-1 px-2.5 py-1 text-[10px]')}
                    >
                      <ExternalLink className="h-3 w-3" /> Öppna bilaga
                    </a>
                  </div>
                )}

                <div className="mt-2 flex gap-2 border-t border-border pt-4">
                  <Button
                    type="button"
                    variant="accent"
                    size="sm"
                    className="flex-1"
                    onClick={() => {
                      if (onCitationClick) onCitationClick(previewLog.id);
                      setPreviewLog(null);
                    }}
                  >
                    Visa och highlighta i loggen
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="flex-1"
                    onClick={() => setPreviewLog(null)}
                  >
                    Stäng
                  </Button>
                </div>
              </div>
            </>
          ) : null}
        </Modal>
      </div>
    </RAGErrorBoundary>
  );
}
