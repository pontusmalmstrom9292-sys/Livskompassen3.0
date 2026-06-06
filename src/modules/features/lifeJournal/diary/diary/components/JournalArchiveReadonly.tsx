import { JournalArchive } from './JournalArchive';
import type { JournalEntry } from '../types/journal';

export type JournalArchiveReadonlyProps = {
  entries: JournalEntry[];
  /** Inbäddad i Dagbok-kort utan extra BentoCard. */
  bare?: boolean;
  intro?: string;
};

/** Canonical readonly journal-lista — delad mellan Dagbok arkiv och Valv forensic. */
export function JournalArchiveReadonly({ entries, bare = false, intro }: JournalArchiveReadonlyProps) {
  return (
    <div className={bare ? 'mt-4' : undefined}>
      {intro ? <p className="reflektion-intro mb-4">{intro}</p> : null}
      <JournalArchive entries={entries} bare={bare} />
    </div>
  );
}
