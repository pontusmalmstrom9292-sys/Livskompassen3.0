
import type { JournalEntry } from '../types';

export const JournalView = ({ entry }: { entry: JournalEntry }) => (
  <div className="space-y-6 p-6 bg-background-surface rounded-2xl border border-border-muted shadow-sm">
    <h2 className="text-3xl font-display-serif text-text tracking-wide">{entry.mood || 'Dagboksanteckning'}</h2>
    <p className="whitespace-pre-wrap text-lg leading-relaxed text-text-muted">{entry.text}</p>
    {entry.tags && entry.tags.length > 0 && (
      <div className="flex flex-wrap gap-2 pt-4 border-t border-border-muted">
        {entry.tags.map((tag: string) => (
          <span key={tag} className="px-3 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full text-xs font-medium tracking-wide">
            #{tag}
          </span>
        ))}
      </div>
    )}
  </div>
);
