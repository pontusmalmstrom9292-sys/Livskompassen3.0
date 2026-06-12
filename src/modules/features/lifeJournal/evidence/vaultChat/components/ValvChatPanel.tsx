import { useEffect, useRef, useState } from 'react';
import { Brain, Loader2, Search, Send, Sparkles, User, X, FileText, ExternalLink } from 'lucide-react';
import { BentoCard } from '@/shared/ui/BentoCard';
import { VAVAREN_VALVCHAT_HINT } from '../../vault/constants/vavarenCopy';
import type { ValvChatCitation } from '../api/valvChatService';
import { useValvChatSession, type ValvChatMessage } from '../hooks/useValvChatSession';
import type { VaultLog } from '@/core/types/firestore';
import { RAGErrorBoundary } from '@/shared/ui/RAGErrorBoundary';

type ValvChatPanelProps = {
  active: boolean;
  onCitationClick?: (docId: string) => void;
  logs?: (VaultLog & { id: string })[]; // Tillagd prop för interaktiv källgranskning
};

function CitationList({
  citations,
  onCitationClick,
}: {
  citations: ValvChatCitation[];
  onCitationClick?: (docId: string) => void;
}) {
  if (!citations.length) return null;
  return (
    <div className="mt-3 space-y-2 border-t border-white/10 pt-3">
      <p className="text-[10px] uppercase tracking-widest text-success">Källor (låsta poster)</p>
      <ul className="space-y-2">
        {citations.map((c) => (
          <li key={c.docId}>
            <button
              type="button"
              onClick={() => onCitationClick?.(c.docId)}
              className="w-full rounded-lg border border-success/20 bg-success/5 p-2 text-left hover:opacity-90 cursor-pointer"
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
            isUser ? 'border-white/10 bg-surface/80' : 'border-indigo-400/30 bg-indigo-500/15'
          }`}
        >
          {isUser ? <User className="h-4 w-4 text-text-dim" /> : <Sparkles className="h-4 w-4 text-indigo-300" />}
        </div>
        <div
          className={`rounded-[1.25rem] px-4 py-3 ${
            isUser
              ? 'rounded-br-sm bg-surface/90 text-text'
              : 'rounded-bl-sm glass-card border border-indigo-400/15 text-text-muted'
          }`}
        >
          <div className="whitespace-pre-wrap text-sm leading-relaxed">{msg.text}</div>
          {msg.role === 'assistant' && msg.citations && (
            <CitationList citations={msg.citations} onCitationClick={onCitationClick} />
          )}
          <span className="mt-2 block text-right text-[9px] text-text-dim">{msg.timestamp}</span>
        </div>
      </div>
    </div>
  );
}

export function ValvChatPanel({ active, onCitationClick, logs = [] }: ValvChatPanelProps) {
  const { draft, setDraft, messages, loading, error, submit } = useValvChatSession(active);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Lokal state för källförhandsgranskning (Citation Preview Modal)
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

  // Fånga källklick och visa modal istället för att lämna chatten direkt
  const handleSourceClick = (docId: string) => {
    const matchedLog = logs.find((l) => l.id === docId);
    if (matchedLog) {
      setPreviewLog(matchedLog);
    } else if (onCitationClick) {
      onCitationClick(docId); // Fallback till föräldern om logg ej hittas lokalt
    }
  };

  return (
    <RAGErrorBoundary fallbackTitle="Nätverksfel i Valv-Chat">
      <div className="valv-chat-panel space-y-4">
        <div className="glass-card flex items-center gap-3 rounded-[2rem] border border-indigo-400/15 p-4">
          <div className="rounded-2xl border border-indigo-400/25 bg-indigo-500/15 p-3">
            <Search className="h-5 w-5 text-indigo-300" />
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-indigo-300/90">
              Forensisk sökning
            </p>
            <h2 className="font-display text-lg text-text">Sök i Valvet</h2>
          </div>
        </div>

        <BentoCard title="Chatt mot arkiv" description="Källor länkas till Logga">
          <p className="mb-3 text-xs text-text-dim">{VAVAREN_VALVCHAT_HINT}</p>
          <div className="flex max-h-[min(52vh,28rem)] min-h-[12rem] flex-col overflow-y-auto rounded-2xl border border-white/5 bg-obsidian/40 p-3">
            {messages.length === 0 && !loading && (
              <div className="flex flex-1 flex-col items-center justify-center gap-3 py-8 text-center opacity-70">
                <Brain className="h-10 w-10 text-indigo-300/80" />
                <p className="max-w-[220px] text-sm text-text-muted">
                  Ställ en fråga mot dina säkrade poster — inget sparas efter stäng.
                </p>
              </div>
            )}
            <div className="space-y-4">
              {messages.map((msg) => (
                <ChatBubble key={msg.id} msg={msg} onCitationClick={handleSourceClick} />
              ))}
              {loading && (
                <div className="glass-card flex items-center gap-2 rounded-2xl px-4 py-3 text-sm text-text-dim">
                  <Loader2 className="h-4 w-4 animate-spin text-indigo-300" /> Söker i arkivet…
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
            <button
              type="submit"
              disabled={loading || !draft.trim()}
              className="btn-pill--secondary flex shrink-0 items-center gap-1 self-end"
              aria-label="Skicka fråga"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </BentoCard>

        {/* —— INTERAKTIV KÄLLGRANSKNINGS-MODAL —— */}
        {previewLog && (
          <div className="fixed inset-0 z-[250] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
            <div className="w-full max-w-lg rounded-2xl border border-accent/25 bg-surface-2 p-5 shadow-accent-glow relative max-h-[85vh] overflow-y-auto">
              <button
                type="button"
                onClick={() => setPreviewLog(null)}
                className="absolute right-4 top-4 rounded-full border border-border bg-bg p-1 text-text-dim hover:text-text cursor-pointer"
                aria-label="Stäng källgranskning"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="flex items-center gap-2 border-b border-border pb-3 mb-4">
                <FileText className="h-4 w-4 text-accent" />
                <div>
                  <h3 className="text-sm font-semibold text-accent">Källgranskning · Låst post</h3>
                  <p className="text-[9px] uppercase tracking-wider text-text-dim">
                    ID: {previewLog.id}
                  </p>
                </div>
              </div>

              <div className="space-y-3.5 text-sm">
                <div className="grid grid-cols-2 gap-2 text-[10px] uppercase tracking-widest text-text-dim">
                  <div>
                    <span>Kategori</span>
                    <p className="font-semibold text-text mt-0.5">{previewLog.category ?? 'allmänt'}</p>
                  </div>
                  <div>
                    <span>Server-tidsstämpel</span>
                    <p className="font-semibold text-text mt-0.5">
                      {previewLog.createdAt ? previewLog.createdAt.slice(0, 19).replace('T', ' ') : '—'}
                    </p>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] uppercase tracking-widest text-text-dim">Låst sanning</span>
                  <div className="mt-1 p-3.5 rounded-xl border border-border-strong bg-surface/40 max-h-64 overflow-y-auto">
                    <p className="whitespace-pre-wrap text-text-muted leading-relaxed select-all">
                      {previewLog.truth}
                    </p>
                  </div>
                </div>

                {previewLog.myReality && (
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <div className="p-3 rounded-lg border border-border bg-surface-3/30">
                      <span className="text-[9px] uppercase tracking-widest text-text-dim">Hens version</span>
                      <p className="text-xs text-text-muted mt-1">{previewLog.theirVersion || '—'}</p>
                    </div>
                    <div className="p-3 rounded-lg border border-accent/20 bg-accent/5">
                      <span className="text-[9px] uppercase tracking-widest text-accent-light">Min verklighet</span>
                      <p className="text-xs text-text mt-1">{previewLog.myReality}</p>
                    </div>
                  </div>
                )}

                {previewLog.evidenceUrl && (
                  <div className="rounded-xl border border-border-strong bg-surface/20 p-2.5 flex items-center justify-between">
                    <span className="text-xs text-text-muted">📎 Bifogat bevisdokument</span>
                    <a
                      href={previewLog.evidenceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-pill--ghost text-[10px] px-2.5 py-1 inline-flex items-center gap-1"
                    >
                      <ExternalLink className="h-3 w-3" /> Öppna bilaga
                    </a>
                  </div>
                )}

                <div className="flex gap-2 border-t border-border pt-4 mt-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (onCitationClick) onCitationClick(previewLog.id);
                      setPreviewLog(null);
                    }}
                    className="btn-pill--accent text-xs flex-1"
                  >
                    Visa och highlighta i loggen
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewLog(null)}
                    className="btn-pill--ghost text-xs flex-1"
                  >
                    Stäng
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </RAGErrorBoundary>
  );
}
