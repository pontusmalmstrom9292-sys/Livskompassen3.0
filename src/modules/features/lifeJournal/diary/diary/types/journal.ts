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
  attachment?: JournalAttachment;
}

export type JournalSavePayload = {
  mood: string;
  text: string;
  category?: string;
  tags?: string[];
};
