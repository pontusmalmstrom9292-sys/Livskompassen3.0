import type { JournalAttachment } from './journalAttachment';

export type JournalStep = 'mood' | 'text' | 'save' | 'done';

export type DagbokMode = 'snabb' | 'reflektera' | 'arkiv';

export interface JournalEntry {
  id: string;
  mood: string;
  text: string;
  userId?: string;
  ownerId?: string;
  createdAt?: string;
  category?: string;
  tags?: string[];
  /** Legacy single attachment (still written as first of attachments when saving). */
  attachment?: JournalAttachment;
  /** Preferred: 1–2 captioned attachments. */
  attachments?: JournalAttachment[];
  isPinned?: boolean;
}

export type JournalSavePayload = {
  mood: string;
  text: string;
  category?: string;
  tags?: string[];
};
