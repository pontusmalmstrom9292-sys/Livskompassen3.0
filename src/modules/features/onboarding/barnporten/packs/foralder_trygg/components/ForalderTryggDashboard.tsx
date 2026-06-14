import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { useForalderTryggContent } from '../useForalderTryggContent';
import { CheckCircle, Circle } from 'lucide-react';

export const ForalderTryggDashboard: React.FC = () => {
  const { tips, isLoading } = useForalderTryggContent();
  const [readState, setReadState] = useState<Record<string, boolean>>({});

  const toggleRead = (id: string) => {
    setReadState((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  if (isLoading) {
    return (
      <div className="p-6 text-text-muted animate-pulse font-sans">
        Laddar Förälder Trygg...
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 font-sans">
      <div className="flex flex-col gap-2 mb-2">
        <h2 className="text-2xl font-display font-light text-text">
          Förälder Trygg
        </h2>
        <p className="text-sm text-text-muted">
          Tre spetsar för en stabil och trygg vardag för dig och dina barn.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tips.map((tip) => {
          const isRead = readState[tip.id] || false;

          return (
            <div
              key={tip.id}
              className={`flex flex-col bg-surface-2 border transition-all duration-300 rounded-2xl p-5 ${
                isRead ? 'border-border opacity-70' : 'border-border shadow-indigo-glow'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex flex-col">
                  <span className="text-eyebrow text-obsidian-indigo mb-1 uppercase tracking-widest">
                    {tip.category}
                  </span>
                  <h3 className="text-lg font-medium text-text">
                    {tip.title}
                  </h3>
                </div>
                <button
                  onClick={() => toggleRead(tip.id)}
                  className="mt-1 text-obsidian-indigo hover:text-accent-ai transition-colors shrink-0 ml-4"
                  aria-label={isRead ? "Markera som oläst" : "Markera som läst"}
                >
                  {isRead ? (
                    <CheckCircle className="w-6 h-6" />
                  ) : (
                    <Circle className="w-6 h-6" />
                  )}
                </button>
              </div>

              <div className="prose prose-invert prose-sm text-text-muted mb-6 flex-grow">
                <ReactMarkdown>{tip.content}</ReactMarkdown>
              </div>

              <div className="bg-surface border border-border rounded-xl p-4 mt-auto">
                <p className="text-xs text-obsidian-indigo uppercase tracking-wider font-semibold mb-2">
                  Reflektion
                </p>
                <p className="text-sm text-text italic">
                  "{tip.reflectionQuestion}"
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
