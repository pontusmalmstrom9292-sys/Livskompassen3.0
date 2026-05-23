import { useEffect, useRef } from 'react';
import { Brain, Loader2, Search, Send, Sparkles, User } from 'lucide-react';
import { BentoCard } from '../../core/ui/BentoCard';
import type { ValvChatCitation } from '../api/valvChatService';
import { useValvChatSession, type ValvChatMessage } from '../hooks/useValvChatSession';

type ValvChatPanelProps = {
  active: boolean;
  onCitationClick?: (docId: string) => void;
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
      <p className="text-[10px] uppercase tracking-widest text-success">Källor (WORM)</p>
      <ul className="space-y-2">
        {citations.map((c) => (
          <li key={c.docId}>
            <button
              type="button"
              onClick={() => onCitationClick?.(c.docId)}
              disabled={!onCitationClick}
              className="w-full rounded-lg border border-success/20 bg-success/5 p-2 text-left hover:opacity-90 disabled:cursor-default"
            >
              <p className="text-[10px] text-success">
                {c.date || 'datum saknas'} · {c.docId.slice(0, 8)}…
                {onCitationClick ? ' · visa post' : ''}
              </p>
              <p className="mt-1 text-xs text-text-muted">{c.excerpt}</p>
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
          <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.text}</p>
          {msg.role === 'assistant' && msg.citations && (
            <CitationList citations={msg.citations} onCitationClick={onCitationClick} />
          )}
          <span className="mt-2 block text-right text-[9px] text-text-dim">{msg.timestamp}</span>
        </div>
      </div>
    </div>
  );
}

export function ValvChatPanel({ active, onCitationClick }: ValvChatPanelProps) {
  const { draft, setDraft, messages, loading, error, submit } = useValvChatSession(active);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  return (
    <div className="space-y-4">
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

      <BentoCard title="Chatt mot WORM-bevis" description="Källor länkas till Logga">
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
              <ChatBubble key={msg.id} msg={msg} onCitationClick={onCitationClick} />
            ))}
            {loading && (
              <div className="glass-card flex items-center gap-2 rounded-2xl px-4 py-3 text-sm text-text-dim">
                <Loader2 className="h-4 w-4 animate-spin text-indigo-300" /> Söker i arkivet…
              </div>
            )}
          </div>
          <div ref={messagesEndRef} />
        </div>
        {error && <p className="mt-3 text-sm text-danger">{error}</p>}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void submit(draft);
          }}
          className="relative mt-4 flex items-center"
        >
          <input
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Fråga mot dina bevis…"
            className="input-glass w-full rounded-full py-3 pl-5 pr-14 text-sm"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !draft.trim()}
            className="absolute right-1.5 flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500 text-white disabled:opacity-40"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </BentoCard>
    </div>
  );
}
