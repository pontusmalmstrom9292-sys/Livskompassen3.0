import { useMemo } from 'react';
import { Loader2, PenLine } from 'lucide-react';
import type { JournalEntry } from '../types/journal';
import { formatJournalDate } from '../utils/formatJournalDate';

type Props = {
  entries: JournalEntry[];
  quickText: string;
  onQuickTextChange: (v: string) => void;
  onQuickSave: () => void;
  saving: boolean;
};

function countLast7Days(entries: JournalEntry[]): number {
  const cutoff = Date.now() - 7 * 24 * 60 * 60 * 1000;
  return entries.filter((e) => {
    const t = e.createdAt ? new Date(e.createdAt).getTime() : 0;
    return t >= cutoff;
  }).length;
}

export function DagbokTodayStrip({
  entries,
  quickText,
  onQuickTextChange,
  onQuickSave,
  saving,
}: Props) {
  const latest = entries[0];
  const weekCount = useMemo(() => countLast7Days(entries), [entries]);

  return (
    <section className="dagbok-today" aria-label="Snabb dagbok">
      <div className="dagbok-today__stats">
        <div>
          <p className="dagbok-today__label">Senaste</p>
          <p className="dagbok-today__value">
            {latest ? (
              <>
                <span className="dagbok-mood-badge dagbok-mood-badge--neutral">{latest.mood}</span>
                <span className="text-text-dim"> · {formatJournalDate(latest.createdAt)}</span>
              </>
            ) : (
              <span className="text-text-muted">Ingen post ännu</span>
            )}
          </p>
        </div>
        <div className="text-right">
          <p className="dagbok-today__label">7 dagar</p>
          <p className="dagbok-today__value tabular-nums">{weekCount} poster</p>
        </div>
      </div>

      <div className="dagbok-today__quick">
        <PenLine className="h-4 w-4 shrink-0 text-accent-secondary" strokeWidth={1.75} />
        <input
          type="text"
          value={quickText}
          onChange={(e) => onQuickTextChange(e.target.value)}
          placeholder="Snabb rad — humör väljer du i steget nedan"
          className="dagbok-today__input"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && quickText.trim()) onQuickSave();
          }}
        />
        <button
          type="button"
          disabled={!quickText.trim() || saving}
          onClick={onQuickSave}
          className="dagbok-today__save"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Spara'}
        </button>
      </div>
      <p className="dagbok-today__hint">Snabb rad sparas med humör Lugn. Använd guiden nedan för full reflektion.</p>
    </section>
  );
}
