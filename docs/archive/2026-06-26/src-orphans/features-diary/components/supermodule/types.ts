export type EntryType = 'journal' | 'vault';

export interface BaseEntry {
  id: string;
  type: EntryType;
  createdAt?: {
    seconds: number;
    nanoseconds: number;
  } | number | string;
  ownerId?: string;
}

export interface JournalEntry extends BaseEntry {
  type: 'journal';
  mood?: string;
  action?: string;
  text?: string;
  tags?: string[];
}

export interface VaultEntry extends BaseEntry {
  type: 'vault';
  action?: string;
  isAnchor?: boolean;
  isPinned?: boolean;
  pinned?: boolean;
  truth?: string;
  theirVersion?: string;
  shieldBoundary?: string;
  shieldFeeling?: string;
}

export type Entry = JournalEntry | VaultEntry;
