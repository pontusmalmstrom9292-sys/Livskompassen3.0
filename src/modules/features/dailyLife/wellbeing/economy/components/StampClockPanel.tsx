import { Link } from 'react-router-dom';
import { Button } from '@/design-system';
import { EmptyState } from '@/core/ui/EmptyState';
import { TimelineEntry } from '@/core/ui/TimelineEntry';
import type { TimeEntryRow } from '@/core/types/firestore';

const STAMP_CATEGORIES = ['Arbete', 'Semester', 'VAB', 'Sjuk', 'Sjuk dag 15+'] as const;

type StampClockPanelProps = {
  instamplad: boolean;
  stampCategory: string;
  onStampCategoryChange: (value: string) => void;
  busy: boolean;
  canStampOut: boolean;
  logs: TimeEntryRow[];
  onStampIn: () => void;
  onStampOut: () => void;
};

export function StampClockPanel({
  instamplad,
  stampCategory,
  onStampCategoryChange,
  busy,
  canStampOut,
  logs,
  onStampIn,
  onStampOut,
}: StampClockPanelProps) {
  return (
    <>
      <label className="mb-3 flex flex-col gap-1 text-sm">
        <span className="text-text-muted">Kategori vid instämpling</span>
        <select
          value={stampCategory}
          onChange={(e) => onStampCategoryChange(e.target.value)}
          className="input-glass"
          disabled={instamplad || busy}
        >
          {STAMP_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </label>

      <div className="mb-4 grid grid-cols-2 gap-2">
        <Button disabled={busy || instamplad} onClick={onStampIn} className="min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 disabled:opacity-40">
          Stämpla in
        </Button>
        <Button
          variant="ghost"
          disabled={busy || !canStampOut}
          onClick={onStampOut}
          className="min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 disabled:opacity-40"
        >
          Stämpla ut
        </Button>
      </div>

      {logs.length === 0 ? (
        <EmptyState message="Inga pass ännu." />
      ) : (
        <div className="mb-3 space-y-2">
          {logs.map((log) => (
            <TimelineEntry
              key={log.id}
              meta={`${log.date} · ${log.category}`}
              body={`${log.clockIn}–${log.clockOut ?? '…'} · ${log.hoursWorked} h`}
            />
          ))}
        </div>
      )}

      <Link
        to="/arbetsliv"
        className="inline-flex min-h-11 items-center text-xs text-accent-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
      >
        Full stämpelvy och veckokalender →
      </Link>
    </>
  );
}
