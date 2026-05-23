import { clsx } from 'clsx';
import { formatJournalDate } from '../utils/formatJournalDate';
import { MOOD_META } from '../constants/moodMeta';
import { MOOD_OPTIONS, type MoodOption } from '../constants/moods';
import type { JournalEntry } from '../types/journal';

type JournalEntryCardProps = {
  entry: JournalEntry;
};

function moodTone(mood: string): string {
  if (MOOD_OPTIONS.includes(mood as MoodOption)) {
    return MOOD_META[mood as MoodOption].tone;
  }
  return 'neutral';
}

export function JournalEntryCard({ entry }: JournalEntryCardProps) {
  const tone = moodTone(entry.mood);
  const preview = (entry.text ?? '').trim();
  const short = preview.length > 160 ? `${preview.slice(0, 160)}…` : preview;

  return (
    <li className={clsx('dagbok-entry', `dagbok-entry--${tone}`)}>
      <div className="dagbok-entry__meta">
        <span className={clsx('dagbok-mood-badge', `dagbok-mood-badge--${tone}`)}>{entry.mood}</span>
        <time className="dagbok-entry__date">{formatJournalDate(entry.createdAt)}</time>
      </div>
      {short ? (
        <p className="dagbok-entry__body">{short}</p>
      ) : (
        <p className="dagbok-entry__body dagbok-entry__body--empty">Humör noterat</p>
      )}
    </li>
  );
}
