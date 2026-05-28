export type JournalStep = 'mood' | 'text' | 'save' | 'done';

export interface JournalEntry {
  id: string;
  mood: string;
  text: string;
  userId?: string;
  ownerId?: string;
  createdAt?: string;
}
