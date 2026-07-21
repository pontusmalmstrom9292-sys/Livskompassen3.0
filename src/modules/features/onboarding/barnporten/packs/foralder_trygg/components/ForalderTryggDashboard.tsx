import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { useForalderTryggContent } from '../useForalderTryggContent';
import { CheckCircle, Circle } from 'lucide-react';
import { EmptyState } from '@/core/ui/EmptyState';
import { HubPanelSkeleton } from '@/core/ui/HubPanelSkeleton';

export interface ForalderTryggDashboardProps {
  childId?: string;
  contextData?: any;
}

export const ForalderTryggDashboard: React.FC<ForalderTryggDashboardProps> = () => {
  const { tips, isLoading } = useForalderTryggContent();
  const [readState, setReadState] = useState<Record<string, boolean>>({});

  const toggleRead = (id: string) => {
    setReadState((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  if (isLoading) {
    return (
      <div className="calm-scroll-island p-4 md:p-6" role="status" aria-label="Laddar Förälder Trygg">
        <HubPanelSkeleton lines={3} />
      </div>
    );
  }

  if (!tips.length) {
    return (
      <div className="calm-scroll-island p-4 md:p-6">
        <EmptyState
          title="Inga tips just nu"
          message="Förälder Trygg-innehåll saknas. Kom tillbaka senare — HITL och Barnfokus är oförändrade."
        />
      </div>
    );
  }

  return (
    <div className="calm-scroll-island flex flex-col gap-6 p-4 font-sans md:p-6">
      <header className="mb-1 flex flex-col gap-2">
        <h2 className="font-display text-2xl font-light text-text">Förälder Trygg</h2>
        <p className="text-sm text-text-muted">
          Tre spetsar för en stabil och trygg vardag för dig och dina barn.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {tips.map((tip) => {
          const isRead = readState[tip.id] || false;

          return (
            <article
              key={tip.id}
              className={`flex flex-col rounded-2xl border bg-surface-2 p-5 transition-[opacity,box-shadow] duration-300 ${
                isRead
                  ? 'border-border opacity-70'
                  : 'border-border shadow-[0_0_20px_color-mix(in_srgb,var(--accent)_10%,transparent)]'
              }`}
            >
              <div className="mb-4 flex items-start justify-between gap-3">
                <div className="flex min-w-0 flex-col">
                  <span className="text-eyebrow mb-1 uppercase tracking-widest text-obsidian-indigo">
                    {tip.category}
                  </span>
                  <h3 className="text-lg font-medium text-text">{tip.title}</h3>
                </div>
                <button
                  type="button"
                  onClick={() => toggleRead(tip.id)}
                  className="ml-2 inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-lg text-obsidian-indigo transition-colors hover:text-accent-ai focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent/50"
                  aria-label={isRead ? 'Markera som oläst' : 'Markera som läst'}
                  aria-pressed={isRead}
                >
                  {isRead ? (
                    <CheckCircle className="h-6 w-6" aria-hidden />
                  ) : (
                    <Circle className="h-6 w-6" aria-hidden />
                  )}
                </button>
              </div>

              <div className="prose prose-invert prose-sm mb-6 flex-grow text-text-muted">
                <ReactMarkdown>{tip.content}</ReactMarkdown>
              </div>

              <div className="mt-auto rounded-xl border border-border bg-surface p-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-obsidian-indigo">
                  Reflektion
                </p>
                <p className="text-sm italic text-text">&ldquo;{tip.reflectionQuestion}&rdquo;</p>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};
